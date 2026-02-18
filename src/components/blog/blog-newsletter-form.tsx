"use client";

import { useState } from "react";

export function BlogNewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    // Simulate submit; replace with real API later
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        disabled={status === "loading"}
        className="flex-1 min-w-0 px-4 py-3 rounded-lg text-sm bg-white border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/50 placeholder:text-gray-400 disabled:opacity-60"
        style={{ borderColor: "var(--accent-gold)" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
        style={{ backgroundColor: "var(--primary-blue)" }}
      >
        {status === "loading" ? "Subscribing…" : status === "success" ? "Subscribed" : "Subscribe"}
      </button>
    </form>
  );
}
