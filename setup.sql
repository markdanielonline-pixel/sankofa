-- ═══════════════════════════════════════════════════════════
--  SANKOFA PUBLISHERS — SUPABASE DATABASE SETUP
--  Run this in the Supabase SQL Editor (Project > SQL Editor)
-- ═══════════════════════════════════════════════════════════

-- 1. profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email      TEXT,
  full_name  TEXT,
  role       TEXT NOT NULL DEFAULT 'author'
                  CHECK (role IN ('super_admin','editor','support','author')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_email TEXT,
  author_name  TEXT,
  title        TEXT NOT NULL DEFAULT 'Untitled Submission',
  synopsis     TEXT,
  path         TEXT CHECK (path IN ('A','B')) DEFAULT 'A',
  status       TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','accepted','rejected','conditional')),
  ai_disclosed BOOLEAN DEFAULT FALSE,
  notes        TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 3. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'author')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Row Level Security
ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 5. RLS: profiles
CREATE POLICY "own profile read"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "admin read all profiles"
  ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor','support'))
  );
CREATE POLICY "super_admin update profiles"
  ON public.profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'super_admin')
  );
CREATE POLICY "own profile update"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6. RLS: submissions
CREATE POLICY "authors read own"
  ON public.submissions FOR SELECT USING (author_id = auth.uid());
CREATE POLICY "authors insert own"
  ON public.submissions FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "admin read all submissions"
  ON public.submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor','support'))
  );
CREATE POLICY "editors update submissions"
  ON public.submissions FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor'))
  );

-- 7. Promote first super admin
-- Replace the email below with your own, then run this line separately.
-- UPDATE public.profiles SET role = 'super_admin' WHERE email = 'your@email.com';