import { fetchApi } from "@/lib/api";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const res = await fetchApi("/api/applications/reorder", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("Reorder applications error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
