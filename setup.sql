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

-- ═══════════════════════════════════════════════════════════
--  AUTHOR MINISITES
-- ═══════════════════════════════════════════════════════════

-- 8. authors table
CREATE TABLE IF NOT EXISTS public.authors (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  slug         TEXT UNIQUE,
  name         TEXT NOT NULL,
  bio          TEXT,
  tagline      TEXT,
  photo_url    TEXT,
  social_links JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 9. books table
CREATE TABLE IF NOT EXISTS public.books (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id    UUID REFERENCES public.authors(id) ON DELETE CASCADE NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  cover_url    TEXT,
  genre        TEXT,
  buy_link     TEXT,
  published_at DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 10. RLS
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books   ENABLE ROW LEVEL SECURITY;

-- Authors: anyone can read published
CREATE POLICY "public read published authors"
  ON public.authors FOR SELECT USING (is_published = TRUE);

-- Authors: admin can read all
CREATE POLICY "admin read all authors"
  ON public.authors FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor','support'))
  );

-- Authors: owner can update own profile fields (not slug, not is_published)
CREATE POLICY "author update own profile"
  ON public.authors FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Authors: admin can insert
CREATE POLICY "admin insert authors"
  ON public.authors FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor'))
  );

-- Authors: admin can update all
CREATE POLICY "admin update all authors"
  ON public.authors FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor'))
  );

-- Authors: admin can delete
CREATE POLICY "admin delete authors"
  ON public.authors FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor'))
  );

-- Books: public can read books for published authors
CREATE POLICY "public read published books"
  ON public.books FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.authors a WHERE a.id = author_id AND a.is_published = TRUE)
  );

-- Books: admin can read all books
CREATE POLICY "admin read all books"
  ON public.books FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor','support'))
  );

-- Books: only admin can insert/update/delete (authors cannot touch books)
CREATE POLICY "admin manage books"
  ON public.books FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('super_admin','editor'))
  );

-- 11. Supabase Storage bucket for author photos
-- Run in SQL Editor: INSERT INTO storage.buckets (id, name, public) VALUES ('author-photos', 'author-photos', true) ON CONFLICT DO NOTHING;
-- Also add storage policy: allow authenticated users to upload to their own folder.