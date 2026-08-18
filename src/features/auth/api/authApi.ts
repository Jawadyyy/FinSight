// Auth API calls: register(), login(), me(), logout() — all via lib/api.
import { api } from "@/lib/api";
import type { AuthResponse, User } from "@/types/auth";

// POST /auth/register -> { accessToken, user }  (also sets the refresh cookie)
export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/register", { name, email, password });
  return res.data;
}

// POST /auth/login -> { accessToken, user }  (also sets the refresh cookie)
export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/login", { email, password });
  return res.data;
}

// GET /auth/me -> the current user (needs the access token in the header)
export async function me(): Promise<User> {
  const res = await api.get<User>("/me");
  return res.data;
}

// POST /auth/refresh -> { accessToken }. The browser sends the refresh cookie
// automatically; we get a fresh access token back. Used to restore the session
// after a page reload.
export async function refresh(): Promise<{ accessToken: string }> {
  const res = await api.post<{ accessToken: string }>("/refresh");
  return res.data;
}

// POST /auth/logout -> clears the cookie + revokes server-side
export async function logout(): Promise<void> {
  await api.post("/logout");
}