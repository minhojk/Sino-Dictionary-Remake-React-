const assert = require('node:assert/strict');
const { test } = require('node:test');
const { ObjectId } = require('mongodb');
const { createApp } = require('../index');

async function requestApi(t, db, path, options = {}, appOptions = []) {
  const server = createApp(db, appOptions).listen(0);
  t.after(() => new Promise((resolve, reject) => {
    server.closeAllConnections();
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  }));

  await new Promise((resolve) => server.once('listening', resolve));
  const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, options);
  const body = response.status === 204 ? null : await response.json();
  return { response, body };
}

function registrationRequest(body) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

test('allows Expo web CORS preflight from localhost', async (t) => {
  const db = {
    collection() {
      throw new Error('Preflight should not query the database');
    },
  };
  const { response } = await requestApi(t, db, '/api/users', {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:8081',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });

  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:8081');
  assert.equal(response.headers.get('access-control-allow-methods'), 'GET, POST, OPTIONS');
  assert.equal(response.headers.get('access-control-allow-headers'), 'Content-Type');
});

test('allows explicitly configured web origins and rejects other origins', async (t) => {
  const db = {};
  const allowed = await requestApi(
    t,
    db,
    '/api/health',
    {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://dictionary.example',
        'Access-Control-Request-Method': 'POST',
      },
    },
    ['https://dictionary.example'],
  );
  const rejected = await requestApi(t, db, '/api/users', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://untrusted.example',
      'Access-Control-Request-Method': 'POST',
    },
  });

  assert.equal(allowed.response.status, 204);
  assert.equal(
    allowed.response.headers.get('access-control-allow-origin'),
    'https://dictionary.example',
  );
  assert.equal(rejected.response.status, 403);
  assert.match(rejected.body.error, /CORS_ORIGINS/);
});

test('registers a user with a hashed password in the users collection', async (t) => {
  let insertedCollection;
  let insertedUser;
  const id = new ObjectId();
  const db = {
    collection(name) {
      insertedCollection = name;
      return {
        async insertOne(user) {
          insertedUser = user;
          return { insertedId: id };
        },
      };
    },
  };

  const { response, body } = await requestApi(
    t,
    db,
    '/api/users',
    registrationRequest({
      username: '  DictionaryFan ',
      email: '  USER@example.com ',
      password: 'a secure password',
    }),
  );

  assert.equal(response.status, 201);
  assert.equal(insertedCollection, 'users');
  assert.equal(insertedUser.username, 'DictionaryFan');
  assert.equal(insertedUser.usernameNormalized, 'dictionaryfan');
  assert.equal(insertedUser.email, 'user@example.com');
  assert.match(insertedUser.passwordHash, /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
  assert.equal('password' in insertedUser, false);
  assert.equal(body.user.id, id.toString());
  assert.equal(body.user.username, 'DictionaryFan');
  assert.equal(body.user.email, 'user@example.com');
  assert.equal('passwordHash' in body.user, false);
});

test('rejects invalid registration data without writing a user', async (t) => {
  const db = {
    collection() {
      return {
        insertOne() { throw new Error('Database should not be queried'); },
      };
    },
  };

  const { response, body } = await requestApi(
    t,
    db,
    '/api/users',
    registrationRequest({
      username: 'ab',
      email: 'not-an-email',
      password: 'short',
    }),
  );

  assert.equal(response.status, 400);
  assert.match(body.error, /Username must be/);
});

test('rejects invalid email addresses and passwords', async (t) => {
  const db = {
    collection() {
      return {
        insertOne() { throw new Error('Database should not be queried'); },
      };
    },
  };
  const invalidRegistrations = [
    {
      username: 'DictionaryFan',
      email: 'not-an-email',
      password: 'a secure password',
      expectedError: /valid email/,
    },
    {
      username: 'DictionaryFan',
      email: 'user@example.com',
      password: 'short',
      expectedError: /Password must be/,
    },
  ];

  for (const { expectedError, ...registration } of invalidRegistrations) {
    const { response, body } = await requestApi(
      t,
      db,
      '/api/users',
      registrationRequest(registration),
    );

    assert.equal(response.status, 400);
    assert.match(body.error, expectedError);
  }
});

test('returns a conflict when the username or email is already registered', async (t) => {
  const db = {
    collection() {
      return {
        async insertOne() {
          const error = new Error('Duplicate key');
          error.code = 11000;
          throw error;
        },
      };
    },
  };

  const { response, body } = await requestApi(
    t,
    db,
    '/api/users',
    registrationRequest({
      username: 'DictionaryFan',
      email: 'user@example.com',
      password: 'a secure password',
    }),
  );

  assert.equal(response.status, 409);
  assert.match(body.error, /already registered/);
});

test('lists single words from the matching collection with pagination', async (t) => {
  const documents = [
    { _id: new ObjectId(), kanji: '学生', meaning: 'student', content: 'long entry' },
    { _id: new ObjectId(), kanji: '学校', meaning: 'school', content: 'long entry' },
    { _id: new ObjectId(), kanji: '先生', meaning: 'teacher', content: 'long entry' },
  ];
  let queriedCollection;
  let projection;

  const db = {
    collection(name) {
      queriedCollection = name;
      return {
        find(filter, options) {
          projection = options.projection;
          return {
            sort() { return this; },
            skip() { return this; },
            limit() { return this; },
            async toArray() {
              return documents.map((document) => ({
                _id: document._id,
                ...Object.fromEntries(
                  Object.keys(projection)
                    .filter((field) => field in document)
                    .map((field) => [field, document[field]]),
                ),
              }));
            },
          };
        },
      };
    },
  };

  const { response, body } = await requestApi(t, db, '/api/words/single?limit=2&page=1');

  assert.equal(response.status, 200);
  assert.equal(queriedCollection, 'single_words');
  assert.deepEqual(projection, {
    unichar: 1,
    set: 1,
    kanji: 1,
    meaning: 1,
    dictionary: 1,
  });
  assert.equal(body.items.length, 2);
  assert.equal(body.items[0].id, documents[0]._id.toString());
  assert.equal(body.items[0].kanji, '学生');
  assert.equal('content' in body.items[0], false);
  assert.equal(body.hasMore, true);
});

test('escapes search text and searches only the selected word collection', async (t) => {
  let queriedCollection;
  let filter;

  const db = {
    collection(name) {
      queriedCollection = name;
      return {
        find(query) {
          filter = query;
          return {
            sort() { return this; },
            skip() { return this; },
            limit() { return this; },
            async toArray() { return []; },
          };
        },
      };
    },
  };

  const { response, body } = await requestApi(t, db, '/api/words/dual?q=abc.def');

  assert.equal(response.status, 200);
  assert.equal(queriedCollection, 'dual_words');
  assert.equal(filter.$or[0].kanji.$regex, 'abc\\.def');
  assert.equal(body.items.length, 0);
});

test('returns a full word document by MongoDB ObjectId', async (t) => {
  const id = new ObjectId();
  let queriedCollection;
  let queriedId;
  const db = {
    collection(name) {
      queriedCollection = name;
      return {
        async findOne(filter) {
          queriedId = filter._id;
          return { _id: id, wordid: '169003', kanji: '同年', content: 'entry' };
        },
      };
    },
  };

  const { response, body } = await requestApi(t, db, `/api/words/dual/${id}`);

  assert.equal(response.status, 200);
  assert.equal(queriedCollection, 'dual_words');
  assert.equal(queriedId.toString(), id.toString());
  assert.equal(body.item.id, id.toString());
  assert.equal(body.item.content, 'entry');
});

test('rejects invalid pagination and ObjectId input', async (t) => {
  const db = {
    collection() {
      return {
        find() { throw new Error('Database should not be queried'); },
        findOne() { throw new Error('Database should not be queried'); },
      };
    },
  };

  const invalidPage = await requestApi(t, db, '/api/words/single?page=0');
  const invalidId = await requestApi(t, db, '/api/words/single/not-an-object-id');

  assert.equal(invalidPage.response.status, 400);
  assert.match(invalidPage.body.error, /positive integer/);
  assert.equal(invalidId.response.status, 400);
});
