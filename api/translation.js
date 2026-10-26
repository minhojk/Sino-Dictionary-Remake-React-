const TRANSLATION_URL = 'https://hvdic.thivien.net/transcript-query.json.php';

export async function translateText(input, lang = 1) {
  if (typeof input !== 'string' || input.trim().length === 0) {
    throw new TypeError('input must be a non-empty string');
  }

  const body = new URLSearchParams({
    mode: 'trans',
    lang: String(lang),
    input,
  });

  const response = await fetch(TRANSLATION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Translation request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.result)) {
    throw new Error('Translation response did not contain a result array');
  }

  return data.result
    .map((entry) => entry?.o?.[0])
    .filter((reading) => typeof reading === 'string')
    .join(' ');
}