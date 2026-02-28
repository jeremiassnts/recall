import { fetchApi } from "@/lib/api";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const res = await fetchApi(`/api/resumes/${id}`, { method: "DELETE" });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Resume delete error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
