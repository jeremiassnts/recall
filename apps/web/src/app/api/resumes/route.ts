import { fetchApi } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetchApi("/api/resumes");
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
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const body = new FormData();
    body.append("file", file);
    const res = await fetchApi("/api/resumes", {
      method: "POST",
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
