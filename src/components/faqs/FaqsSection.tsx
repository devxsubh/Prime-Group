"use client";

import { useMemo, useState } from "react";
import { Faq3, FAQ_FALLBACK_ITEMS } from "@/components/blocks/faq3";
import type { FaqItem } from "@/lib/faqs";
import FaqHero from "@/components/faqs/faq-hero";

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
  const [search, setSearch] = useState("");
  const baseItems = useMemo(() => {
    if (faqs.length) return faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }));
    return FAQ_FALLBACK_ITEMS;
  }, [faqs]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return baseItems;
    return baseItems.filter(
      (item) =>
        item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
    );
  }, [baseItems, search]);

  const itemsForAccordion = filteredItems;
  const totalCount = baseItems.length;

  return (
    <div className="min-h-screen">
      <FaqHero
        searchValue={search}
        onSearchChange={setSearch}
        visibleCount={filteredItems.length}
        totalCount={totalCount}
      />
      <Faq3
        hideIntro
        heading={defaultContent.heading}
        description={defaultContent.description}
        items={itemsForAccordion}
        supportHeading={defaultContent.supportHeading}
        supportDescription={defaultContent.supportDescription}
        supportButtonText={defaultContent.supportButtonText}
        supportButtonUrl={defaultContent.supportButtonUrl}
      />
    </div>
  );
}
