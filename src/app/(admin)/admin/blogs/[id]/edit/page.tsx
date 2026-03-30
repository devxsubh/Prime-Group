"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { BlogEditor, type BlogFormData } from "@/components/admin/blog-editor";
import { createAdminBrowserClient } from "@/lib/supabase/client-admin";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<Partial<BlogFormData> | null>(null);
  const [initialContent, setInitialContent] = useState("");
  const [previousPosts, setPreviousPosts] = useState<{ id: string; title: string; slug: string }[]>([]);

  useEffect(() => {
    if (!id) return;
    const supabase = createAdminBrowserClient();
    Promise.all([
      supabase.from("blogs").select("*").eq("id", id).single(),
      supabase.from("blogs").select("id, title, slug").order("updated_at", { ascending: false }).limit(10),
    ]).then(([postRes, listRes]) => {
      if (postRes.data) {
        const p = postRes.data as {
          title: string;
          slug: string;
          category: string;
          excerpt: string | null;
          content: string;
          cover_image_url: string | null;
          author_name: string | null;
          published_at: string | null;
        };
        setInitialData({
          title: p.title,
          slug: p.slug,
          category: p.category,
          excerpt: p.excerpt ?? "",
          cover_image_url: p.cover_image_url ?? "",
          author_name: p.author_name ?? "",
          publish: !!p.published_at,
        });
        setInitialContent(p.content || "");
      }
      setPreviousPosts((listRes.data as { id: string; title: string; slug: string }[]) ?? []);
      setLoading(false);
    });
  }, [id]);

  const handleSave = async (data: BlogFormData) => {
    setSaving(true);
    try {
      const supabase = createAdminBrowserClient();
      const { error } = await supabase
        .from("blogs")
        .update({
          title: data.title,
          slug: data.slug,
          category: data.category,
          excerpt: data.excerpt || null,
          content: data.content,
          cover_image_url: data.cover_image_url || null,
          author_name: data.author_name || null,
          published_at: data.publish ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
      router.push("/admin/blogs");
      router.refresh();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--primary-blue)" }} />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="space-y-4">
        <Link href="/admin/blogs" className="text-sm font-medium opacity-80 hover:opacity-100" style={{ color: "var(--primary-blue)" }}>
          ← Back to blogs
        </Link>
        <p className="text-gray-600">Post not found.</p>
      </div>
    );
  }

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
        Edit post
      </h1>
      <BlogEditor
        initialContent={initialContent}
        initialData={initialData}
        onSave={handleSave}
        saving={saving}
        previousPosts={previousPosts.filter((p) => p.id !== id)}
      />
    </div>
  );
}
