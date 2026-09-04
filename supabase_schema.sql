-- ==========================================================
-- Schema Database Supabase per Stellaris (Osservatorio Mobile)
-- Esegui questo script nel "SQL Editor" della dashboard Supabase
-- ==========================================================

-- 1. Tabella Eventi Astronomici
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  instrument TEXT NOT NULL,
  direction TEXT NOT NULL,
  description_tips TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Abilita Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Chiunque (anon o autenticato) può leggere gli eventi
CREATE POLICY "Gli eventi sono pubblici e consultabili da tutti"
  ON public.events
  FOR SELECT
  USING (true);


-- 2. Tabella Pivot Utente - Eventi (Preferiti & Passaporto Osservati)
CREATE TABLE IF NOT EXISTS public.user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  is_observed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_event_unique UNIQUE (user_id, event_id)
);

-- Abilita RLS su user_events
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gli utenti possono leggere i propri preferiti e osservazioni"
  ON public.user_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Gli utenti possono inserire i propri eventi"
  ON public.user_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Gli utenti possono aggiornare i propri eventi"
  ON public.user_events
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Gli utenti possono eliminare i propri eventi"
  ON public.user_events
  FOR DELETE
  USING (auth.uid() = user_id);

-- Nota: I vecchi eventi statici di test (seed) sono stati rimossi.
-- Gli eventi astronomici vengono ora generati in tempo reale tramite le API live
-- (NASA JPL Asteroid CAD e Open-Meteo per le fasi lunari).
-- La tabella "public.events" può essere utilizzata liberamente per aggiungere
-- eventi editoriali o speciali direttamente dalla dashboard Supabase.
