import { fetchApi } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const res = await fetchApi(`/api/resumes/${id}/url`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch (e) {
    console.error("Resume URL error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
