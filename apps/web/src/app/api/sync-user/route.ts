import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export async function POST() {
  try {
    const { accessToken } = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    const res = await fetch(`${API_URL}/api/users/sync`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Sync user failed:", res.status, text);
      return NextResponse.json(
        { error: "Failed to sync user" },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Sync user error:", e);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
