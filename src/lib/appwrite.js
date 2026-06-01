import { Client, Account, OAuthProvider } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT ?? '';
const project = import.meta.env.VITE_APPWRITE_PROJECT ?? '';

export const client = new Client().setEndpoint(endpoint).setProject(project);

export const account = new Account(client);

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
