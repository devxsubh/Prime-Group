import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | Prime Group Matrimony",
  description:
    "Prime Group Matrimony Refund Policy. Eligibility, process, and conditions for refunds on subscriptions and contact unlocks.",
};

export default function RefundPage() {
  return (
    <div
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--pure-white)" }}
    >
      <div className="container mx-auto max-w-3xl">
        <p className="font-montserrat text-sm mb-4" style={{ color: "var(--primary-blue)" }}>
          Last updated: February 2025
        </p>
        <h1
          className="font-playfair-display text-4xl font-bold mb-4"
          style={{ color: "var(--primary-blue)" }}
        >
          Refund Policy
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
            At Prime Group Matrimony, we want you to be satisfied with your
            purchase. This Refund Policy explains when and how you may be
            eligible for a refund on subscription plans and related services.
          </p>

          <h2 className="text-xl font-semibold mt-8">Eligibility</h2>
          <p>
            Refund requests may be considered when: (1) the request is made
            within 7 days of the original purchase date; (2) no contact unlocks
            have been used under the subscription, or a pro-rata refund may be
            offered if some credits remain unused; (3) the reason for the
            request is valid (e.g. accidental purchase, technical issues
            preventing use, or unsatisfactory service as determined by us).
          </p>

          <h2 className="text-xl font-semibold mt-8">Process</h2>
          <p>
            To request a refund, contact us via the support option on our Contact
            Us page or through the help section in your account. Please include
            your registered email, order or transaction reference, and a brief
            reason for the request. Our team will review your request and
            respond within a few business days. If approved, the refund will be
            processed to the original payment method within 5–10 business days,
            depending on your bank or card issuer.
          </p>

          <h2 className="text-xl font-semibold mt-8">Non-Refundable Cases</h2>
          <p>
            Refunds may not be granted where contact unlocks or other paid
            features have been fully or substantially used, where the request
            is made after the eligibility period, or where we detect abuse or
            violation of our Terms of Service. Partial or pro-rata refunds are
            at our discretion.
          </p>

          <h2 className="text-xl font-semibold mt-8">Contact</h2>
          <p>
            For refund requests or questions about this policy, please{" "}
            <Link
              href="/contact-us"
              className="underline font-medium hover:opacity-80"
              style={{ color: "var(--accent-gold)" }}
            >
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
