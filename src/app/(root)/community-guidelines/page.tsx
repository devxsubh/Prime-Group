import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community Guidelines | Prime Group Matrimony",
  description:
    "Prime Group Matrimony Community Guidelines. Expected behaviour, safety, and standards for all members on our matrimonial platform.",
};

export default function CommunityGuidelinesPage() {
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
          Community Guidelines
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
            Prime Group Matrimony is a respectful space for people seeking life
            partners. These guidelines help keep our community safe, honest, and
            welcoming. By using our platform, you agree to follow these
            standards. Violations may result in warnings, suspension, or
            permanent removal.
          </p>

          <h2 className="text-xl font-semibold mt-8">Be Honest</h2>
          <p>
            Provide accurate information in your profile—including age, location,
            education, and occupation. Do not use outdated or misleading photos.
            Misrepresentation undermines trust and may lead to account action.
          </p>

          <h2 className="text-xl font-semibold mt-8">Be Respectful</h2>
          <p>
            Treat other members with respect in all interactions. Harassment,
            hate speech, bullying, or inappropriate advances are not tolerated.
            Respect others&apos; privacy and boundaries. Do not share someone
            else&apos;s contact details or personal information without their
            consent.
          </p>

          <h2 className="text-xl font-semibold mt-8">No Fraud or Scams</h2>
          <p>
            Do not use the platform for financial fraud, fake profiles, or
            solicitation. Do not ask for money or financial favours in exchange
            for marriage or relationship. Report suspicious behaviour so we
            can take action.
          </p>

          <h2 className="text-xl font-semibold mt-8">Appropriate Content</h2>
          <p>
            Profile photos and text must be suitable for a matrimonial context.
            Explicit, offensive, or illegal content is prohibited. We reserve the
            right to remove content and suspend accounts that violate these
            standards.
          </p>

          <h2 className="text-xl font-semibold mt-8">One Account, One Profile</h2>
          <p>
            Maintain a single account per person. Do not create fake or duplicate
            accounts. Profiles created for others (e.g. family members) must be
            clearly indicated and used with their consent.
          </p>

          <h2 className="text-xl font-semibold mt-8">Reporting</h2>
          <p>
            If you see behaviour that violates these guidelines or our Terms of
            Service, use the Report option on the profile or contact us. We
            review reports and take action where appropriate. False or abusive
            reporting may also result in action against your account.
          </p>

          <p className="mt-8">
            For questions about these guidelines, please{" "}
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
