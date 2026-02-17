import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Prime Group Matrimony",
  description:
    "Learn about Prime Group Matrimony—our mission, values, and commitment to helping you find your perfect life partner through trust and verification.",
};

export default function AboutPage() {
  return (
    <div
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--pure-white)" }}
    >
      <div className="container mx-auto max-w-3xl">
        <h1
          className="font-playfair-display text-4xl font-bold mb-4"
          style={{ color: "var(--primary-blue)" }}
        >
          About Prime Group Matrimony
        </h1>
        <div
          className="w-16 h-1 rounded-full mb-8"
          style={{ backgroundColor: "var(--accent-gold)" }}
        />
        <div
          className="font-montserrat space-y-6 text-base leading-relaxed"
          style={{ color: "var(--primary-blue)" }}
        >
          <p>
            Prime Group Matrimony is a modern matrimonial platform built to
            connect individuals seeking life partners in a secure,
            privacy-focused environment. We combine traditional values with
            contemporary technology to make the search for a life partner
            respectful, efficient, and trustworthy.
          </p>
          <h2 className="text-xl font-semibold mt-8">Our Mission</h2>
          <p>
            To become the most trusted and efficient matrimonial platform by
            enabling meaningful connections through verified profiles, clear
            privacy controls, and a professional experience that families and
            individuals can rely on.
          </p>
          <h2 className="text-xl font-semibold mt-8">Trust & Safety</h2>
          <p>
            We are committed to your safety and privacy. Profiles can be
            verified, contact details are shared only with your consent and
            within the bounds of our subscription model, and we maintain clear
            community guidelines and support for reporting or blocking
            inappropriate behaviour.
          </p>
          <h2 className="text-xl font-semibold mt-8">Contact</h2>
          <p>
            For any questions about our services or this platform, please visit
            our{" "}
            <Link
              href="/contact-us"
              className="underline font-medium hover:opacity-80"
              style={{ color: "var(--accent-gold)" }}
            >
              Contact Us
            </Link>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}
