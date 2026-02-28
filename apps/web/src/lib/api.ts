import { getAccessToken } from "@auth0/nextjs-auth0";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export async function fetchApi(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const { accessToken } = await getAccessToken();
  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
