-- ============================================================
-- APZ Paintball — Supabase Database Setup
-- Pegar en: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. TABLES
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.cockpits (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  is_active   BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.session_types (
  id               SERIAL PRIMARY KEY,
  name             TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price            NUMERIC(8,2) NOT NULL DEFAULT 0,
  max_people       INTEGER NOT NULL DEFAULT 30,
  color            TEXT NOT NULL DEFAULT '#FFD000',
  is_active        BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cockpit_ids     INTEGER[] NOT NULL DEFAULT '{}',
  session_type_id INTEGER REFERENCES public.session_types(id),
  customer_name   TEXT NOT NULL,
  customer_email  TEXT NOT NULL DEFAULT '',
  customer_phone  TEXT NOT NULL DEFAULT '',
  num_people      INTEGER NOT NULL DEFAULT 1,
  date            DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  status          TEXT NOT NULL DEFAULT 'confirmed'
                  CHECK (status IN ('confirmed', 'cancelled', 'blocked', 'no_show')),
  checked_in      BOOLEAN DEFAULT NULL,
  reference       TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blocked_slots (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cockpit_id INTEGER REFERENCES public.cockpits(id),
  date       DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time   TIME NOT NULL,
  reason     TEXT NOT NULL DEFAULT ''
);

-- 2. INDEXES
-- ─────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON public.bookings(date, status);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON public.blocked_slots(date);

-- 3. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.cockpits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- cockpits: anyone can read, only authenticated can modify
CREATE POLICY "cockpits_select" ON public.cockpits FOR SELECT USING (true);
CREATE POLICY "cockpits_insert" ON public.cockpits FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "cockpits_update" ON public.cockpits FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "cockpits_delete" ON public.cockpits FOR DELETE USING (auth.role() = 'authenticated');

-- session_types: anyone can read, only authenticated can modify
CREATE POLICY "session_types_select" ON public.session_types FOR SELECT USING (true);
CREATE POLICY "session_types_insert" ON public.session_types FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "session_types_update" ON public.session_types FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "session_types_delete" ON public.session_types FOR DELETE USING (auth.role() = 'authenticated');

-- bookings: anyone can read and insert (public booking form), only authenticated can update/delete
CREATE POLICY "bookings_select" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "bookings_insert" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings_update" ON public.bookings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "bookings_delete" ON public.bookings FOR DELETE USING (auth.role() = 'authenticated');

-- blocked_slots: anyone can read, only authenticated can modify
CREATE POLICY "blocked_slots_select" ON public.blocked_slots FOR SELECT USING (true);
CREATE POLICY "blocked_slots_insert" ON public.blocked_slots FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "blocked_slots_update" ON public.blocked_slots FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "blocked_slots_delete" ON public.blocked_slots FOR DELETE USING (auth.role() = 'authenticated');

-- 4. SEED DATA — Campos y tipos de sesión de APZ Paintball
-- ─────────────────────────────────────────────────────────────

-- Campos / escenarios (equivalente a "cockpits" en GZ Simlab)
INSERT INTO public.cockpits (name, description, is_active) VALUES
  ('Campo Bosque',      'Escenario principal — 20.000m² de bosque natural',  true),
  ('Campo Contenedor',  'Zona de estructuras y cobertura urbana',            true)
ON CONFLICT DO NOTHING;

-- Tipos de sesión
INSERT INTO public.session_types (name, duration_minutes, price, max_people, color, is_active) VALUES
  ('Entre Semana',       120, 15.00, 30, '#FFD000', true),
  ('Fin de Semana',      120, 20.00, 30, '#FF9900', true),
  ('Super Pack',         180, 35.00, 30, '#FF3333', true),
  ('Paintball Nocturno', 120, 25.00, 30, '#8B5CF6', true),
  ('Paintball Infantil', 90,  12.00, 30, '#00FF88', true)
ON CONFLICT DO NOTHING;

-- 5. AUTH — Crear usuario admin (opcional, hazlo desde Supabase Auth UI si prefieres)
-- ─────────────────────────────────────────────────────────────
-- Ve a Supabase Dashboard → Authentication → Users → Invite user
-- Email: tu email de admin
-- Esto creará el usuario autenticado que puede acceder al panel /admin
