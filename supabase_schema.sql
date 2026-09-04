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
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
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


-- 3. Popolamento Dati Iniziali (Seed Events)
INSERT INTO public.events (id, title, category, event_date, instrument, direction, description_tips, image_url)
VALUES
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c61',
    'Sciame Meteorico delle Perseidi',
    'Sciami Meteorici',
    '2026-08-12 21:30:00+00',
    'Occhio nudo',
    'Nord-Est (Costellazione di Perseo)',
    'Fino a 100 meteore l''ora prodotte dalla cometa Swift-Tuttle. Sdraiarsi al buio e puntare lo sguardo verso lo zenit.',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c62',
    'Eclissi Lunare Totale ("Luna di Sangue")',
    'Eclissi',
    '2026-09-07 20:15:00+00',
    'Occhio nudo o Binocolo',
    'Sud-Est (Bassa sull''orizzonte)',
    'La Terra proietta il suo cono d''ombra sulla Luna, tingendola di un suggestivo rosso rame.',
    'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c63',
    'Congiunzione Stretta Giove-Saturno',
    'Congiunzioni',
    '2026-10-18 19:45:00+00',
    'Binocolo o Telescopio',
    'Sud-Ovest',
    'Distanza angolare inferiore a 0.5 gradi. Visibili insieme nel telescopio satelliti galileiani e anelli.',
    'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c64',
    'Superluna Piena al Perigeo',
    'Luna & Pianeti',
    '2026-11-24 22:00:00+00',
    'Occhio nudo',
    'Est / Zenit',
    'Distanza minima di 357.000 km. Appare il 14% più grande e il 30% più luminosa di una luna media.',
    'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c65',
    'Sciame Meteorico delle Geminidi',
    'Sciami Meteorici',
    '2026-12-14 23:00:00+00',
    'Occhio nudo',
    'Est / Nord-Est (Gemelli)',
    'Sciame generato dall''asteroide Phaethon con meteore vivide e persistenti.',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80'
  )
ON CONFLICT (id) DO NOTHING;
