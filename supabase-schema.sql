-- ============================================
-- SCRIPT SQL SUPABASE - RestoSocial
-- Copie-colle tout ce script dans :
-- Supabase → SQL Editor → New Query → Run
-- ============================================

-- Table des profils utilisateurs (liée à auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  restaurant_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table des abonnements Stripe
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT CHECK (plan IN ('starter', 'pro')) DEFAULT 'starter',
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')) DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Table des générations de contenu
CREATE TABLE public.generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  restaurant_name TEXT NOT NULL,
  cuisine_type TEXT NOT NULL,
  post_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  tone TEXT NOT NULL,
  details TEXT,
  generated_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour accélérer les requêtes par utilisateur
CREATE INDEX idx_generations_user_id ON public.generations(user_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);

-- Compteur mensuel de générations (vue)
CREATE OR REPLACE VIEW public.monthly_generation_count AS
SELECT
  user_id,
  COUNT(*) as count,
  DATE_TRUNC('month', NOW()) as month_start
FROM public.generations
WHERE created_at >= DATE_TRUNC('month', NOW())
GROUP BY user_id;

-- Active Row Level Security (RLS) - sécurité obligatoire
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Politiques : chaque utilisateur ne voit que SES données
CREATE POLICY "Les utilisateurs voient leur profil"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs modifient leur profil"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs voient leur abonnement"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs voient leurs générations"
  ON public.generations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs créent des générations"
  ON public.generations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour le service role (webhooks Stripe)
CREATE POLICY "Service role gère les abonnements"
  ON public.subscriptions FOR ALL USING (true);

CREATE POLICY "Service role gère les profils"
  ON public.profiles FOR INSERT WITH CHECK (true);

-- Fonction trigger : crée un profil automatiquement à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger : se déclenche à chaque nouvelle inscription
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
