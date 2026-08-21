// Shared types: User, AuthResponse, Tokens.
// The safe, public shape of a user — exactly what the backend returns.
// No password, no refresh token.
export interface User {
  id: string;
  email: string;
  name?: string;
  /** Which plan the account is on, so the UI can gate Pro features. */
  tier?: 'free' | 'pro';
}

// The body returned by POST /auth/register and POST /auth/login.
// (The refresh token is NOT here — it rides in the httpOnly cookie.)
export interface AuthResponse {
  accessToken: string;
  user: User;
}