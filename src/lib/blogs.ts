import { createClient } from "@/lib/supabase/server";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Public: list published blogs for listing page */
export async function getPublishedBlogs(options?: { category?: string; limit?: number }) {
  const supabase = await createClient();
  let q = supabase
    .from("blogs")
    .select("id, title, slug, category, excerpt, cover_image_url, author_name, published_at, created_at")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  if (options?.category && options.category !== "All") {
    q = q.eq("category", options.category);
  }
  if (options?.limit) {
    q = q.limit(options.limit);
  }
  const { data, error } = await q;
  if (error) return [];
  return (data ?? []) as Pick<BlogPost, "id" | "title" | "slug" | "category" | "excerpt" | "cover_image_url" | "author_name" | "published_at" | "created_at">[];
}

/** Public: get single published blog by slug */
export async function getPublishedBlogBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .single();
  if (error || !data) return null;
  return data as BlogPost;
}

/** Admin: list all blogs (including drafts) */
export async function getAllBlogsAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, category, excerpt, cover_image_url, published_at, created_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as BlogPost[];
}

/** Admin: get one blog by id (for editing) */
export async function getBlogByIdAdmin(id: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("blogs").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as BlogPost;
}
