require('dotenv').config({ path: require('node:path').join(__dirname, '.env') });

const { randomBytes, scrypt, timingSafeEqual } = require('node:crypto');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { resolve } = require('node:dns');

const COLLECTIONS = {
  single: {
    name: 'single_words',
    searchFields: ['kanji', 'meaning', 'dictionary', 'unichar'],
    listFields: ['unichar', 'set', 'kanji', 'meaning', 'dictionary'],
  },
  dual: {
    name: 'dual_words',
    searchFields: ['kanji', 'meaning', 'wordid'],
    listFields: ['wordid', 'kanji', 'meaning'],
  },
};

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;
const MAX_QUERY_LENGTH = 100;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,32}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parsePositiveInteger(value, name, defaultValue, maximum = Number.MAX_SAFE_INTEGER) {
  if (value === undefined) return defaultValue;

  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    const error = new Error(`${name} must be a positive integer`);
    error.status = 400;
    throw error;
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed > maximum) {
    const error = new Error(`${name} must not exceed ${maximum}`);
    error.status = 400;
    throw error;
  }

  return parsed;
}

function serializeDocument(document) {
  const { _id, ...fields } = document;
  return { id: _id.toString(), ...fields };
}

function validateRegistration(body) {
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!USERNAME_PATTERN.test(username)) {
    const error = new Error('Username must be 3-32 characters using letters, numbers, ".", "_" or "-".');
    error.status = 400;
    throw error;
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    const error = new Error('Enter a valid email address.');
    error.status = 400;
    throw error;
  }

  if (password.length < 8 || password.length > 128) {
    const error = new Error('Password must be between 8 and 128 characters.');
    error.status = 400;
    throw error;
  }

  return { username, usernameNormalized: username.toLowerCase(), email, password };
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });

  // Keep the salt alongside the derived key so the password can be verified without storing it.
  return `scrypt$${salt.toString('hex')}$${derivedKey.toString('hex')}`;
}

function isLocalDevelopmentOrigin(origin) {
  try {
    const url = new URL(origin);
    return ['http:', 'https:'].includes(url.protocol)
      && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  } catch {
    return false;
  }
}

function createApp(db, allowedOrigins = []) {
  const app = express();

  app.use((req, res, next) => {
    const origin = req.get('Origin');
    if (!origin) return next();

    // Browsers require CORS headers for the JSON registration request's preflight.
    if (!allowedOrigins.includes(origin) && !isLocalDevelopmentOrigin(origin)) {
      return res.status(403).json({
        error: 'Web origin is not allowed. Add it to CORS_ORIGINS in server/.env.',
      });
    }

    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.vary('Origin');

    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  });

  app.use(express.json({ limit: '32kb' }));

  app.post('/api/users', async (req, res) => {
    const { username, usernameNormalized, email, password } = validateRegistration(req.body);
    const passwordHash = await hashPassword(password);
    const createdAt = new Date();
    const result = await db.collection('users').insertOne({
      username,
      usernameNormalized,
      email,
      passwordHash,
      createdAt,
    });

    res.status(201).json({
      user: {
        id: result.insertedId.toString(),
        username,
        email,
        createdAt: createdAt.toISOString(),
      },
    });
  });

  app.post('/api/login', async (req, res) => {
    const identifier = typeof req.body?.identifier === 'string' ? req.body.identifier.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Enter your usename or email and password.'})
    }

    const user = await db.collection('users').findOne({
      $or: [
        {
          email: identifier
        },
        {
          usernameNormalized: identifier
        }
      ]
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid username/email or password.'})
    }

    return res.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      }
    })
  })

  app.get('/api/health', async (req, res) => {
    await db.command({ ping: 1 });
    res.json({ ok: true, database: 'connected' });
  });

  app.get('/api/words/:kind', async (req, res) => {
    const collectionConfig = COLLECTIONS[req.params.kind];
    if (!collectionConfig) {
      return res.status(404).json({ error: 'Word collection not found' });
    }

    const { q } = req.query;
    if (q !== undefined && typeof q !== 'string') {
      return res.status(400).json({ error: 'q must be a single string' });
    }

    const searchTerm = q?.trim();
    if (searchTerm && searchTerm.length > MAX_QUERY_LENGTH) {
      return res.status(400).json({
        error: `q must be at most ${MAX_QUERY_LENGTH} characters`,
      });
    }

    const page = parsePositiveInteger(req.query.page, 'page', 1);
    const limit = parsePositiveInteger(req.query.limit, 'limit', DEFAULT_LIMIT, MAX_LIMIT);
    const offset = (page - 1) * limit;
    if (!Number.isSafeInteger(offset)) {
      return res.status(400).json({ error: 'page and limit result in an invalid offset' });
    }

    const filter = searchTerm
      ? {
          $or: collectionConfig.searchFields.map((field) => ({
            [field]: { $regex: escapeRegex(searchTerm), $options: 'i' },
          })),
        }
      : {};

    const documents = await db
      .collection(collectionConfig.name)
      .find(filter, {
        projection: Object.fromEntries(collectionConfig.listFields.map((field) => [field, 1])),
      })
      .sort({ _id: 1 })
      .skip(offset)
      .limit(limit + 1)
      .toArray();

    const hasMore = documents.length > limit;
    const items = documents.slice(0, limit).map(serializeDocument);

    res.json({ items, page, limit, hasMore });
  });

  app.get('/api/words/:kind/:id', async (req, res) => {
    const collectionConfig = COLLECTIONS[req.params.kind];
    if (!collectionConfig) {
      return res.status(404).json({ error: 'Word collection not found' });
    }

    if (!/^[\da-f]{24}$/i.test(req.params.id)) {
      return res.status(400).json({ error: 'id must be a MongoDB ObjectId' });
    }

    const document = await db
      .collection(collectionConfig.name)
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!document) {
      return res.status(404).json({ error: 'Word not found' });
    }

    res.json({ item: serializeDocument(document) });
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);

    const status = err.code === 11000
      ? 409
      : Number.isInteger(err.status) && err.status >= 400 && err.status < 500
        ? err.status
        : 500;

    if (status === 500) {
      console.error('API request failed:', err);
    }

    res.status(status).json({
      error: err.code === 11000
        ? 'Username or email is already registered.'
        : status === 500
          ? 'Internal server error'
          : err.message,
    });
  });

  return app;
}

async function start() {
  const { MONGODB_URI, MONGODB_DB = 'Dictionary', PORT = '3000' } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Set it in server/.env.');
  }

  const port = Number(PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  const db = client.db(MONGODB_DB);
  try {
    // Enforce uniqueness in MongoDB, including concurrent registrations.
    await db.collection('users').createIndexes([
      {
        key: { usernameNormalized: 1 },
        name: 'unique_user_username',
        unique: true,
        partialFilterExpression: { usernameNormalized: { $type: 'string' } },
      },
      {
        key: { email: 1 },
        name: 'unique_user_email',
        unique: true,
        partialFilterExpression: { email: { $type: 'string' } },
      },
    ]);
  } catch (error) {
    await client.close();
    throw error;
  }

  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const app = createApp(db, allowedOrigins);
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`API listening on port ${port}; database "${MONGODB_DB}" connected`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down`);
    server.close(async (error) => {
      if (error) {
        console.error('API shutdown failed:', error);
        process.exitCode = 1;
      }

      try {
        await client.close();
      } catch (closeError) {
        console.error('MongoDB shutdown failed:', closeError);
        process.exitCode = 1;
      }
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));

  return { app, server, client };
}

if (require.main === module) {
  start().catch((err) => {
    console.error('API startup failed:', err);
    process.exitCode = 1;
  });
}

async function verifyPassword(password, storedHash) {
  const match = /^scrypt\$([a-f0-9]{32})\$([a-f0-9]{128})$/.exec(storedHash || '');
  if (!match) return false;

  const [, saltHex, keyHex] = match;
  const salt = Buffer.from(saltHex, 'hex');
  const expectedKey = Buffer.from(keyHex, 'hex');

  const actualKey = await new Promise((resolve, reject) => {
    scrypt(password, salt, expectedKey.length, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    })
  });

  return timingSafeEqual(actualKey, expectedKey);
}

module.exports = { createApp, start };
