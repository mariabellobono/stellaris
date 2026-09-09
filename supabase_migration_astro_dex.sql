-- ==========================================================
-- Migrazione SQL: Astro-Dex (Collezionismo Eventi Astronomici)
-- Esegui questo script nel "SQL Editor" della dashboard Supabase
-- ==========================================================

-- 1. Tipo ENUM per la rarità delle carte Astro-Dex
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'card_rarity') THEN
    CREATE TYPE public.card_rarity AS ENUM ('COMMON', 'RARE', 'EPIC');
  END IF;
END $$;

-- 2. Tabella del Catalogo Carte (Astro-Dex)
CREATE TABLE IF NOT EXISTS public.dex_cards (
  id TEXT PRIMARY KEY, -- es. 'card_perseidi', 'card_iss_pass'
  title TEXT NOT NULL,
  description TEXT,
  rarity public.card_rarity NOT NULL DEFAULT 'COMMON',
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Abilita Row Level Security (RLS) su dex_cards
ALTER TABLE public.dex_cards ENABLE ROW LEVEL SECURITY;

-- Chiunque può consultare il catalogo delle carte
DROP POLICY IF EXISTS "Le carte Astro-Dex sono consultabili da tutti" ON public.dex_cards;
CREATE POLICY "Le carte Astro-Dex sono consultabili da tutti"
  ON public.dex_cards
  FOR SELECT
  USING (true);

-- 3. Tabella Pivot Sblocchi Utente (Collezione Personale)
CREATE TABLE IF NOT EXISTS public.user_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL REFERENCES public.dex_cards(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_card_unique UNIQUE (user_id, card_id)
);

-- Abilita RLS su user_unlocks
ALTER TABLE public.user_unlocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gli utenti possono visualizzare i propri sblocchi" ON public.user_unlocks;
CREATE POLICY "Gli utenti possono visualizzare i propri sblocchi"
  ON public.user_unlocks
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Gli utenti possono inserire i propri sblocchi" ON public.user_unlocks;
CREATE POLICY "Gli utenti possono inserire i propri sblocchi"
  ON public.user_unlocks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Gli utenti possono cancellare i propri sblocchi" ON public.user_unlocks;
CREATE POLICY "Gli utenti possono cancellare i propri sblocchi"
  ON public.user_unlocks
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Aggiunta colonna dex_card_id alla tabella esistente events
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'events' 
      AND column_name = 'dex_card_id'
  ) THEN
    ALTER TABLE public.events 
    ADD COLUMN dex_card_id TEXT NULL REFERENCES public.dex_cards(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 5. Seed Iniziale di Carte Astro-Dex (Collezione Fondamentale)
INSERT INTO public.dex_cards (id, title, description, rarity, icon_url)
VALUES
  (
    'card_perseidi',
    'Sciame delle Perseidi',
    'Le "Lacrime di San Lorenzo", generate dai detriti della cometa Swift-Tuttle che impattano l''atmosfera a 59 km/s.',
    'COMMON',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'card_iss_pass',
    'Transito Stazione ISS',
    'Avvistamento a occhio nudo della Stazione Spaziale Internazionale mentre brilla intensamente per riflessione solare a 400 km di quota.',
    'COMMON',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'card_supermoon',
    'Superluna al Perigeo',
    'Fase di Luna Piena in coincidenza con il perigeo orbitale: appare fino al 14% più grande e al 30% più luminosa.',
    'COMMON',
    'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'card_geminidi',
    'Sciame delle Geminidi',
    'Uno dei più ricchi e spettacolari sciami meteorici dell''anno, originato dal misterioso asteroide 3200 Phaethon.',
    'RARE',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'card_pleiadi',
    'Pleiadi (M45) e Toro',
    'Ammasso aperto composto da calde stelle giganti blu avvolte da una delicata nebulosa a riflessione.',
    'RARE',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'card_planetary_alignment',
    'Allineamento Planetario',
    'Rara configurazione in cui molteplici pianeti maggiori appaiono disposti lungo la linea dell''eclittica nel cielo notturno.',
    'RARE',
    'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'card_solar_eclipse',
    'Eclissi Solare Totale',
    'La Luna si interpone perfettamente tra la Terra e il Sole, svelando l''eterea corona solare in pieno giorno.',
    'EPIC',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'card_aurora_borealis',
    'Tempesta Geomagnetica & Aurora',
    'Le particelle cariche del vento solare si incanalano nel campo magnetico terrestre eccitando atomi di ossigeno e azoto.',
    'EPIC',
    'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=800&q=80'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  rarity = EXCLUDED.rarity,
  icon_url = EXCLUDED.icon_url;
