import { NextResponse } from "next/server";
import { requireUserWithBasicProfile } from "@/lib/api-require-basic-profile";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const gate = await requireUserWithBasicProfile();
    if (!gate.ok) return gate.response;
    const { user, supabase } = gate;

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
