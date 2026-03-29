import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Prime Group Matrimony",
  description:
    "Prime Group Matrimony Privacy Policy. How we collect, use, and protect your personal data. GDPR and data protection compliant.",
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--pure-white)" }}
    >
      <div className="container mx-auto max-w-3xl">
        <p className="font-general text-sm mb-4" style={{ color: "var(--primary-blue)" }}>
          Last updated: February 2025
        </p>
        <h1
          className="font-playfair-display text-4xl font-bold mb-4"
          style={{ color: "var(--primary-blue)" }}
        >
          Privacy Policy
        </h1>
        <div
          className="w-16 h-1 rounded-full mb-8"
          style={{ backgroundColor: "var(--accent-gold)" }}
        />
        <div
          className="font-general space-y-6 text-base leading-relaxed"
          style={{ color: "var(--primary-blue)" }}
        >
          <p>
            Prime Group Matrimony (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to
            protecting your privacy. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our
            matrimonial platform and related services.
          </p>

          <h2 className="text-xl font-semibold mt-8" id="information-we-collect">
            Information We Collect
          </h2>
          <p>
            We may collect information you provide directly (e.g. name, email,
            phone, date of birth, profile details, preferences) and information
            collected automatically (e.g. device information, IP address, usage
            data) to operate the service, personalise your experience, and
            improve our platform.
          </p>

          <h2 className="text-xl font-semibold mt-8" id="how-we-use">
            How We Use Your Information
          </h2>
          <p>
            We use your information to create and manage your account, display
            your profile to other users in accordance with your settings, process
            payments, send service-related communications, enforce our terms,
            and comply with legal obligations. We do not sell your personal data
            to third parties for marketing.
          </p>

          <h2 className="text-xl font-semibold mt-8" id="data-sharing">
            Sharing and Disclosure
          </h2>
          <p>
            Contact details (e.g. phone, email) are only shared with other
            users when you have chosen to unlock contact through our paid
            features or when you have mutually accepted interest, as per our
            product design. We may share data with service providers (hosting,
            payments, email) under strict agreements, and where required by law.
          </p>

          <h2 className="text-xl font-semibold mt-8" id="cookies">
            Cookies and Similar Technologies
          </h2>
          <p>
            We use cookies and similar technologies for authentication, session
            management, security, and analytics. You can manage cookie preferences
            in your browser or via our Cookie Settings where available.
          </p>

          <h2 className="text-xl font-semibold mt-8" id="your-rights">
            Your Rights
          </h2>
          <p>
            Depending on your location, you may have the right to access, correct,
            delete, or port your data, and to object to or restrict certain
            processing. You may also have the right to withdraw consent. To
            exercise these rights or request a copy of your data, contact us via
            the details on our Contact Us page. We will respond within the time
            frames required by applicable law (e.g. 30 days under GDPR). Data
            may be retained for up to 30 days after account deletion for
            recovery and legal purposes, after which it is purged.
          </p>

          <h2 className="text-xl font-semibold mt-8">Security</h2>
          <p>
            We use industry-standard measures to protect your data, including
            encryption in transit and at rest, secure authentication, and access
            controls. Despite our efforts, no method of transmission over the
            internet is 100% secure.
          </p>

          <h2 className="text-xl font-semibold mt-8">Changes</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of material changes by posting the updated policy on this page
            and updating the &quot;Last updated&quot; date. Continued use of the service
            after changes constitutes acceptance.
          </p>

          <p className="mt-8">
            For questions about this Privacy Policy, please{" "}
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
