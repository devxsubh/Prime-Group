"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorText("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject: subject || undefined, message }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorText(data.error || "Something went wrong.");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorText("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border-2 p-8 text-center" style={{ borderColor: "var(--accent-gold)" }}>
        <p className="text-xl font-playfair-display font-bold mb-2" style={{ color: "var(--primary-blue)" }}>
          Thank you for your message
        </p>
        <p className="font-montserrat" style={{ color: "var(--primary-blue)" }}>
          We&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border-2 p-6 sm:p-8 space-y-6" style={{ borderColor: "var(--accent-gold)" }}>
      <div className="space-y-2">
        <Label htmlFor="name" className="font-montserrat font-medium" style={{ color: "var(--primary-blue)" }}>
          Name *
        </Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-montserrat"
          placeholder="Your name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="font-montserrat font-medium" style={{ color: "var(--primary-blue)" }}>
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="font-montserrat"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="font-montserrat font-medium" style={{ color: "var(--primary-blue)" }}>
          Subject
        </Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="font-montserrat"
          placeholder="Brief subject"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="font-montserrat font-medium" style={{ color: "var(--primary-blue)" }}>
          Message *
        </Label>
        <Textarea
          id="message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="font-montserrat min-h-[140px]"
          placeholder="Your message..."
        />
      </div>
      {errorText && (
        <p className="text-sm font-montserrat text-red-600">{errorText}</p>
      )}
      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full font-montserrat font-semibold py-6"
        style={{ backgroundColor: "var(--primary-blue)" }}
      >
        {status === "loading" ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
