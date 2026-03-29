import { getFaqs } from "@/lib/faqs";
import FaqsSection from "@/components/faqs/FaqsSection";

export default async function FAQsPage() {
  const faqs = await getFaqs();

  return <FaqsSection faqs={faqs} />;
}
