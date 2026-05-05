
-- Enums
CREATE TYPE public.plan_type AS ENUM ('free', 'pro');
CREATE TYPE public.content_type AS ENUM ('photo', 'video', 'text', 'link');
CREATE TYPE public.verdict_type AS ENUM ('likely_ai', 'likely_human', 'uncertain');

-- Profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  plan public.plan_type NOT NULL DEFAULT 'free',
  credits_remaining INTEGER NOT NULL DEFAULT 30,
  credits_reset_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Analyses
CREATE TABLE public.analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type public.content_type NOT NULL,
  input_preview TEXT,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  verdict public.verdict_type NOT NULL,
  suspected_model TEXT NOT NULL,
  credits_spent INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analyses_user_created ON public.analyses(user_id, created_at DESC);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own analyses" ON public.analyses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own analyses" ON public.analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_touch_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Reset credits if month has passed (called from server)
CREATE OR REPLACE FUNCTION public.maybe_reset_credits(_user_id UUID)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  p public.profiles;
BEGIN
  SELECT * INTO p FROM public.profiles WHERE id = _user_id;
  IF p IS NULL THEN
    RETURN NULL;
  END IF;
  IF p.credits_reset_at <= now() THEN
    UPDATE public.profiles
      SET credits_remaining = CASE WHEN plan = 'pro' THEN 300 ELSE 30 END,
          credits_reset_at = now() + INTERVAL '30 days'
      WHERE id = _user_id
      RETURNING * INTO p;
  END IF;
  RETURN p;
END;
$$;

-- Atomic credit spend
CREATE OR REPLACE FUNCTION public.spend_credits(_user_id UUID, _amount INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  PERFORM public.maybe_reset_credits(_user_id);
  UPDATE public.profiles
    SET credits_remaining = credits_remaining - _amount
    WHERE id = _user_id AND credits_remaining >= _amount;
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count > 0;
END;
$$;
