import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Prime Group Matrimony",
  description:
    "Terms of Service for Prime Group Matrimony. Rules and conditions for using our matrimonial platform and services.",
};

export default function TermsPage() {
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
          Terms of Service
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
            Welcome to Prime Group Matrimony. By accessing or using our website
            and services, you agree to be bound by these Terms of Service. If you
            do not agree, please do not use our platform.
          </p>

          <h2 className="text-xl font-semibold mt-8">Eligibility</h2>
          <p>
            You must be at least 18 years of age and legally capable of entering
            into a binding contract to use our services. By registering, you
            represent that you meet these requirements and that the information
            you provide is accurate and complete.
          </p>

          <h2 className="text-xl font-semibold mt-8">Account and Profile</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity under your account. You must
            provide accurate profile information and keep it updated. False,
            misleading, or offensive content may result in suspension or
            termination of your account. Profiles are subject to our approval and
            community guidelines.
          </p>

          <h2 className="text-xl font-semibold mt-8">Use of Service</h2>
          <p>
            You agree to use the service only for lawful matrimonial purposes.
            You must not harass, abuse, spam, or misrepresent yourself. You must
            not scrape data, use automated tools to access the service without
            permission, or attempt to circumvent security or payment controls.
            Violation may result in immediate termination and legal action.
          </p>

          <h2 className="text-xl font-semibold mt-8">Payments and Refunds</h2>
          <p>
            Paid plans and contact unlocks are governed by the pricing and
            payment terms displayed at the time of purchase. Refunds are handled
            as per our{" "}
            <Link
              href="/refund"
              className="underline font-medium hover:opacity-80"
              style={{ color: "var(--accent-gold)" }}
            >
              Refund Policy
            </Link>
            . We reserve the right to change pricing with notice to existing
            subscribers as permitted by law.
          </p>

          <h2 className="text-xl font-semibold mt-8">Intellectual Property</h2>
          <p>
            The platform, including its design, content, and software, is owned by
            Prime Group Matrimony or its licensors. You may not copy, modify, or
            distribute our content or code without written permission. You retain
            ownership of content you submit but grant us a licence to use it to
            operate the service.
          </p>

          <h2 className="text-xl font-semibold mt-8">Disclaimer</h2>
          <p>
            Our service is provided &quot;as is&quot;. We do not guarantee specific
            outcomes, matches, or accuracy of third-party profiles. We are not
            responsible for the conduct of users offline or for decisions made
            based on information on the platform. You use the service at your
            own risk.
          </p>

          <h2 className="text-xl font-semibold mt-8">Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Prime Group Matrimony and its
            affiliates shall not be liable for any indirect, incidental, special,
            or consequential damages arising from your use of the service or
            inability to use it, including loss of data or business opportunity.
          </p>

          <h2 className="text-xl font-semibold mt-8">Changes and Termination</h2>
          <p>
            We may modify these terms at any time. Continued use after changes
            constitutes acceptance. We may suspend or terminate your account for
            breach of these terms or for any other reason with notice where
            practicable. You may close your account at any time via account
            settings or by contacting us.
          </p>

          <p className="mt-8">
            For questions about these Terms of Service, please{" "}
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
