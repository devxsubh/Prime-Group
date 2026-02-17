import { createClient } from "@/lib/supabase/server";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export async function getFaqs(): Promise<FaqItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data ?? [];
}
