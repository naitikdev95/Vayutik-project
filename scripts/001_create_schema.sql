-- Vayutik App Marketplace Database Schema
-- This schema includes tables for profiles, apps, categories, reviews, and saved apps

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table for organizing apps
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Apps table for software/products
CREATE TABLE IF NOT EXISTS public.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  icon_url TEXT,
  cover_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  website_url TEXT,
  pricing_type TEXT CHECK (pricing_type IN ('free', 'freemium', 'paid', 'subscription')) DEFAULT 'free',
  price DECIMAL(10, 2),
  developer_name TEXT,
  developer_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  total_installs INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  is_developer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(app_id, user_id)
);

-- Saved/Installed apps
CREATE TABLE IF NOT EXISTS public.saved_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_apps ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);

-- Apps policies (public read)
CREATE POLICY "apps_public_read" ON public.apps FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Reviews policies
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Saved apps policies
CREATE POLICY "saved_apps_select_own" ON public.saved_apps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_apps_insert_own" ON public.saved_apps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_apps_delete_own" ON public.saved_apps FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update app statistics when a review is added
CREATE OR REPLACE FUNCTION public.update_app_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.apps
    SET 
      average_rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM public.reviews WHERE app_id = NEW.app_id),
      review_count = (SELECT COUNT(*) FROM public.reviews WHERE app_id = NEW.app_id),
      updated_at = NOW()
    WHERE id = NEW.app_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.apps
    SET 
      average_rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM public.reviews WHERE app_id = OLD.app_id), 0),
      review_count = (SELECT COUNT(*) FROM public.reviews WHERE app_id = OLD.app_id),
      updated_at = NOW()
    WHERE id = OLD.app_id;
    RETURN OLD;
  END IF;
END;
$$;

-- Trigger to update app stats on review changes
DROP TRIGGER IF EXISTS on_review_change ON public.reviews;
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_app_stats();

-- Function to increment install count
CREATE OR REPLACE FUNCTION public.increment_install_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.apps
  SET total_installs = total_installs + 1
  WHERE id = NEW.app_id;
  RETURN NEW;
END;
$$;

-- Trigger for install count
DROP TRIGGER IF EXISTS on_app_saved ON public.saved_apps;
CREATE TRIGGER on_app_saved
  AFTER INSERT ON public.saved_apps
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_install_count();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_apps_category ON public.apps(category_id);
CREATE INDEX IF NOT EXISTS idx_apps_featured ON public.apps(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_apps_rating ON public.apps(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_app ON public.reviews(app_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_apps_user ON public.saved_apps(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_apps_app ON public.saved_apps(app_id);
