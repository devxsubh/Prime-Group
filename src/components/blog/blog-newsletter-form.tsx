"use client";

import { useState } from "react";
import { Send, CheckCircle2, Star } from "lucide-react";

export function BlogNewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    // Simulate submit; replace with real API later
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
    setEmail("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-8 md:px-12 py-20 rounded-[3rem] bg-[#003366] text-white overflow-hidden relative shadow-[0_20px_50px_rgba(0,51,102,0.3)] border border-white/5 group">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E2C285]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 group-hover:bg-[#E2C285]/20 transition-colors duration-1000 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E2C285]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#E2C285 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 text-center">
        {/* Brand Icon */}
        <div className="mb-8 flex justify-center">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
            <Star className="text-[#E2C285] animate-pulse" size={24} fill="#E2C285" />
          </div>
        </div>

        <h3 className="font-playfair-display text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
          The <span className="text-gold-gradient bg-clip-text text-transparent">Prime Journal</span>
        </h3>
        
        <p className="text-white/60 text-lg mb-12 max-w-lg mx-auto leading-relaxed font-light">
          Be the first to read real love stories, expert relationship advice, and wedding guides. Join our community of <span className="text-white font-black border-b-2 border-[#E2C285]">50,000+</span> families.
        </p>

        {status === "success" ? (
          <div className="bg-white/5 border border-[#E2C285]/30 rounded-full py-6 px-10 animate-in zoom-in duration-500 max-w-md mx-auto flex items-center justify-center gap-4">
             <CheckCircle2 className="text-[#E2C285]" size={28} />
             <span className="text-lg font-bold tracking-widest uppercase">WELCOME TO THE FAMILY</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto group/form relative">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                disabled={status === "loading"}
                className="w-full px-8 py-5 rounded-full text-base bg-white/5 border border-white/10 text-white transition-all focus:outline-none focus:border-[#E2C285] focus:bg-white/10 placeholder:text-white/20 disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.4em] bg-gold-gradient text-[#003366] transition-all hover:scale-105 active:scale-95 disabled:opacity-60 whitespace-nowrap shadow-[0_10px_30px_rgba(226,194,133,0.3)] hover:shadow-[0_15px_40px_rgba(226,194,133,0.4)] flex items-center justify-center gap-3"
            >
              {status === "loading" ? (
                <div className="w-5 h-5 border-2 border-[#003366]/30 border-t-[#003366] rounded-full animate-spin" />
              ) : (
                <>
                  Get Stories
                  <Send size={14} className="group-hover/form:translate-x-1 group-hover/form:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}
        
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#E2C285]/30 to-transparent" />
          <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] font-black flex items-center gap-3">
             TRUSTED BY FAMILIES WORLDWIDE
          </p>
        </div>
      </div>
    </div>
  );
}
