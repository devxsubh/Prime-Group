import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userRow, error } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (error || !userRow) {
      return NextResponse.json({ credits: 0 });
    }

    return NextResponse.json({
      credits: Number((userRow as { credits?: number }).credits) || 0,
    });
  } catch (e) {
    console.error("credits/balance error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
