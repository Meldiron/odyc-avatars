import { Client, Account, OAuthProvider } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT ?? '';
const project = import.meta.env.VITE_APPWRITE_PROJECT ?? '';

export const client = new Client().setEndpoint(endpoint).setProject(project);

export const account = new Account(client);

const ODYC_API_BASE = 'https://odyc.appwrite.network';

/**
 * Fetch the currently logged-in user, or null if not authenticated.
 */
export async function getAccount() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

/**
 * Handle OAuth2 callback: read secret/userId from URL, create a session,
 * then strip the query params so the URL stays clean.
 * Returns the new session or null if no callback params were present.
 */
export async function handleOAuthCallback() {
  const url = new URL(window.location.href);
  const secret = url.searchParams.get('secret');
  const userId = url.searchParams.get('userId');

  if (!secret || !userId) return null;

  try {
    const session = await account.createSession(userId, secret);
    url.searchParams.delete('secret');
    url.searchParams.delete('userId');
    window.history.replaceState({}, '', url.toString());
    return session;
  } catch {
    return null;
  }
}

/**
 * Read an OAuth2 error returned in the URL (e.g. ?error=...) and strip it from
 * the address bar. Returns true if an error param was present, false otherwise.
 * We intentionally don't surface the raw provider message — see App.jsx.
 */
export function readOAuthError() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('error')) return false;

  url.searchParams.delete('error');
  window.history.replaceState({}, '', url.toString());
  return true;
}

/**
 * Sign out the current user by deleting the active session.
 */
export async function signOut() {
  try {
    await account.deleteSession('current');
  } catch {
    // ignore
  }
}

/**
 * Start "Sign in with Odyc.js" OAuth2 flow via Appwrite using the OIDC provider.
 * Redirects the browser to the identity provider.
 */
export function signInWithOdyc() {
  const success = window.location.href;
  const failure = window.location.href;

  account.createOAuth2Token({
    provider: OAuthProvider.Oidc,
    success,
    failure,
    scopes: ['openid', 'profile.read', 'profile.write'],
  });
}

/**
 * Get the OIDC provider access token from the current user's identities.
 * This token can be used to call the Odyc.js public API directly.
 */
export async function getOidcAccessToken() {
  try {
    const { identities } = await account.listIdentities();
    const oidc = identities?.find((i) => i.provider === 'oidc');
    return oidc?.providerAccessToken || null;
  } catch {
    return null;
  }
}

/**
 * Fetch the current avatar from the Odyc.js API.
 * Returns the avatar string or null if none is set.
 */
export async function fetchRemoteAvatar(token) {
  const res = await fetch(`${ODYC_API_BASE}/v1/profile/avatar`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch avatar');
  const data = await res.json();
  return data.avatar || null;
}

/**
 * Update the avatar on the Odyc.js API.
 * Returns the saved avatar string.
 */
export async function updateRemoteAvatar(token, avatar) {
  const res = await fetch(`${ODYC_API_BASE}/v1/profile/avatar`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ avatar }),
  });
  if (!res.ok) throw new Error('Failed to update avatar');
  const data = await res.json();
  return data.avatar;
}
