-- Link blogs to a user account (optional). If the user is deleted, keep the blog but clear the reference.
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS author_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_blogs_author_user_id ON public.blogs(author_user_id);

