import { fetchApi } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await fetchApi("/api/users/sync", {
      method: "POST",
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
