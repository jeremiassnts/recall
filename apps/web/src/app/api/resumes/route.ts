import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export async function GET() {
  try {
    const { accessToken } = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const res = await fetch(`${API_URL}/api/resumes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("Resumes list error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { accessToken } = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const body = new FormData();
    body.append("file", file);
    const res = await fetch(`${API_URL}/api/resumes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error("Resume upload error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
