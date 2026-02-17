import { getFaqs } from "@/lib/faqs";
import FaqsSection from "@/components/faqs/FaqsSection";

export default async function FAQsPage() {
  const faqs = await getFaqs();

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: "var(--pure-white)" }}>
      <FaqsSection faqs={faqs} />
    </div>
  );
}
