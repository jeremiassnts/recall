import { fetchApi } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetchApi("/api/dashboard");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("Dashboard metrics error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
