-- FAQs: public content, anyone can read
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faqs_sort ON public.faqs(sort_order);
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read faqs"
  ON public.faqs FOR SELECT
  USING (true);

-- Only admins can manage faqs (add later in admin if needed)
CREATE POLICY "Admins can manage faqs"
  ON public.faqs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin')
    )
  );

-- Profile favorites (wishlist): one row per user+profile
CREATE TABLE public.profile_favorites (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, profile_id)
);

CREATE INDEX idx_profile_favorites_user ON public.profile_favorites(user_id);
ALTER TABLE public.profile_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites"
  ON public.profile_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.profile_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.profile_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact submissions"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read contact submissions"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin')
    )
  );

-- Seed default FAQs (optional; can be managed via admin later)
INSERT INTO public.faqs (question, answer, sort_order) VALUES
  ('How do I create a profile on your platform?', 'Creating a profile is simple! Click on the ''Sign Up'' button, fill in your basic information, upload your photos, and complete your profile details. Our team will verify your profile within 24-48 hours to ensure authenticity and security.', 1),
  ('How does the matching algorithm work?', 'Our advanced matching algorithm considers multiple factors including preferences, values, lifestyle, education, profession, and family background. We use AI-powered technology to suggest the most compatible matches based on your profile and preferences.', 2),
  ('Is my personal information safe and secure?', 'Absolutely! We take your privacy and security very seriously. All profiles are verified, and we use advanced encryption to protect your personal information. You have full control over what information is visible to other members.', 3),
  ('Can I search for matches on my own?', 'Yes! You can browse through verified profiles, use our advanced search filters, and connect with potential matches. We also provide personalized match suggestions based on your preferences.', 4),
  ('What support services do you offer?', 'We offer comprehensive support including profile verification, personalized matchmaking assistance, family consultation services, and guidance throughout your matrimonial journey. Our relationship experts are available to help you at every step.', 5),
  ('How much does it cost to use your services?', 'We offer various membership plans to suit different needs. Basic profiles are free, while premium memberships provide access to advanced features, priority support, and personalized matchmaking services. Contact us for detailed pricing information.', 6),
  ('Can I contact matches directly?', 'Yes, once you find a compatible match, you can initiate contact through our secure messaging platform. Premium members have access to direct contact features and can schedule video calls through our platform.', 7);

-- Allow anyone to read profile_photos for active, visible profiles (for discover/listing)
CREATE POLICY "Anyone can read photos of active profiles"
  ON public.profile_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = profile_photos.profile_id
      AND profiles.profile_status = 'active'
      AND profiles.is_visible = true
      AND profiles.deleted_at IS NULL
    )
  );
