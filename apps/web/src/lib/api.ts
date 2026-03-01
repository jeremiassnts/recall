import { auth0 } from "./auth0";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export async function fetchApi(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const { token } = await auth0.getAccessToken();
  if (!token) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
