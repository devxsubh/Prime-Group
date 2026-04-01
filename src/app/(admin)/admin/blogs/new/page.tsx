"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { BlogEditor, type BlogFormData } from "@/components/admin/blog-editor";
import { createAdminBrowserClient } from "@/lib/supabase/client-admin";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [previousPosts, setPreviousPosts] = useState<{ id: string; title: string; slug: string }[]>([]);

  useEffect(() => {
    const supabase = createAdminBrowserClient();
    supabase
      .from("blogs")
      .select("id, title, slug")
      .order("updated_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setPreviousPosts((data as { id: string; title: string; slug: string }[]) ?? []));
  }, []);

  const handleSave = async (data: BlogFormData) => {
    setSaving(true);
    try {
      const supabase = createAdminBrowserClient();
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("blogs").insert({
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
        category: data.category,
        excerpt: data.excerpt || null,
        content: data.content,
        cover_image_url: data.cover_image_url || null,
        author_name: data.author_name || null,
        author_user_id: auth?.user?.id ?? null,
        published_at: data.publish ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      router.push("/admin/blogs");
      router.refresh();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blogs"
          className="flex items-center gap-2 text-sm font-medium opacity-80 hover:opacity-100"
          style={{ color: "var(--primary-blue)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blogs
        </Link>
      </div>
      <h1 className="text-2xl font-bold font-playfair-display" style={{ color: "var(--primary-blue)" }}>
        New post
      </h1>
      <BlogEditor onSave={handleSave} saving={saving} previousPosts={previousPosts} />
    </div>
  );
}
