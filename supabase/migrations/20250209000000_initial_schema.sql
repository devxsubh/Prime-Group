-- Phase 2: Auth + profiles. Run in Supabase SQL Editor (Dashboard > SQL Editor).
-- Requires Supabase Auth enabled (default). Uses auth.uid() for RLS.

-- Enable UUID extension if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Public users table (synced from auth.users for role/status)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  last_login_ip INET
);

-- Trigger: create public.users row when auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles table (one per user)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,

  full_name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  date_of_birth DATE NOT NULL,
  marital_status VARCHAR(20),
  height_cm INT,
  religion VARCHAR(50),
  mother_tongue VARCHAR(50),
  profile_for VARCHAR(20),

  country VARCHAR(50),
  state VARCHAR(50),
  city VARCHAR(50),
  citizenship VARCHAR(50),
  grew_up_in VARCHAR(100),
  residing_in VARCHAR(100),
  willing_to_relocate VARCHAR(10),

  highest_education VARCHAR(100),
  college_university VARCHAR(150),
  field_of_study VARCHAR(100),
  employed_in VARCHAR(50),
  occupation VARCHAR(100),
  organization VARCHAR(150),
  annual_income_min INT,
  annual_income_max INT,

  father_name VARCHAR(100),
  father_occupation VARCHAR(100),
  mother_name VARCHAR(100),
  mother_occupation VARCHAR(100),
  siblings_count INT,
  family_type VARCHAR(20),
  family_values VARCHAR(20),
  family_status VARCHAR(30),

  profile_status VARCHAR(20) DEFAULT 'pending' CHECK (profile_status IN ('pending', 'active', 'rejected', 'suspended')),
  verification_status VARCHAR(20) DEFAULT 'unverified',
  profile_completion_pct INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  rejection_reason TEXT,
  admin_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_status ON public.profiles(profile_status);
CREATE INDEX idx_profiles_gender ON public.profiles(gender);
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_profiles_religion ON public.profiles(religion);

-- Profile photos
CREATE TABLE public.profile_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending',
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_profile_photos_profile_id ON public.profile_photos(profile_id);

-- Partner preferences (one per profile)
CREATE TABLE public.partner_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  age_min INT,
  age_max INT,
  height_min_cm INT,
  height_max_cm INT,
  marital_status VARCHAR(100),
  religion VARCHAR(100),
  education VARCHAR(200),
  location VARCHAR(200),
  occupation VARCHAR(200),
  income_min INT,
  income_max INT,
  additional_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: enable on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_preferences ENABLE ROW LEVEL SECURITY;

-- users: trigger inserts new rows (trigger runs as postgres); users read/update own row
CREATE POLICY "Allow trigger to insert user row"
  ON public.users FOR INSERT
  TO postgres
  WITH CHECK (true);

CREATE POLICY "Users can read own user row"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own user row"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- profiles: read active for discovery; full CRUD own
CREATE POLICY "Anyone can read active profiles"
  ON public.profiles FOR SELECT
  USING (profile_status = 'active' AND is_visible = TRUE AND deleted_at IS NULL);

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- profile_photos: own only for now
CREATE POLICY "Users can manage own profile photos"
  ON public.profile_photos FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- partner_preferences: own only
CREATE POLICY "Users can manage own partner preferences"
  ON public.partner_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow anon to read active profiles (for logged-out browse if desired). Optional: restrict to authenticated.
-- Already covered by "Anyone can read active profiles" (anon has no uid so that policy doesn't apply; authenticated users get "Users can read own profile" for own and "Anyone can read active" for others).
-- Authenticated users can read active profiles (for discovery)
-- Anon: no SELECT policy by default; add one if you want logged-out browsing.
