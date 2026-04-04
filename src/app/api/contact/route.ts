import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server-service";

/**
 * Access: **public** — no auth. Inserts use the service role so behavior does not depend on member
 * cookies or anon RLS context; see `@/lib/api-route-access`.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as { name?: string; email?: string; subject?: string; message?: string };

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim().slice(0, 500),
      email: email.trim().slice(0, 255),
      subject: subject != null ? String(subject).trim().slice(0, 500) : null,
      message: message.trim().slice(0, 5000),
    });

    if (error) {
      console.error("[contact-submit]", error);
      return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[contact-submit]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
