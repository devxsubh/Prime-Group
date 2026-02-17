import { Faq3 } from "@/components/blocks/faq3";
import type { FaqItem } from "@/lib/faqs";

const defaultContent = {
  heading: "Frequently Asked Questions",
  description:
    "Find answers to common questions about our matrimonial services. Can't find what you're looking for? Our support team is here to help you.",
  supportHeading: "Still have questions?",
  supportDescription:
    "Our dedicated support team is here to help you with any questions or concerns about finding your perfect match. Get in touch with us for personalized assistance.",
  supportButtonText: "Contact Us",
  supportButtonUrl: "/contact-us",
};

interface FaqsSectionProps {
  faqs: FaqItem[];
}

export default function FaqsSection({ faqs }: FaqsSectionProps) {
  const items = faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }));
  return (
    <Faq3
      heading={defaultContent.heading}
      description={defaultContent.description}
      items={items.length ? items : undefined}
      supportHeading={defaultContent.supportHeading}
      supportDescription={defaultContent.supportDescription}
      supportButtonText={defaultContent.supportButtonText}
      supportButtonUrl={defaultContent.supportButtonUrl}
    />
  );
}
