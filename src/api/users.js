const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '');

export async function registerUser({ username, email, password }) {
  // This public app setting contains only the API address, never MongoDB credentials.
  if (!API_BASE_URL) {
    throw new Error('Registration is not configured. Set EXPO_PUBLIC_API_URL and restart the app.');
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
  } catch (error) {
    const reason = error instanceof Error ? ` ${error.message}` : '';
    throw new Error(
      `Could not connect to the registration API at ${API_BASE_URL}. ` +
      `Make sure the server is running and this address is reachable from your device.${reason}`,
    );
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('The registration service returned an invalid response.');
  }

  if (!response.ok) {
    throw new Error(
      typeof result?.error === 'string' ? result.error : 'Unable to create your account.',
    );
  }

  if (typeof result?.user?.id !== 'string') {
    throw new Error('The registration service returned an invalid response.');
  }

  return result.user;
}
