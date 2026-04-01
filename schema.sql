-- Enterprise Backend - PostgreSQL Schema
-- Compatible with PostgreSQL 14+

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metadata    JSONB NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BEHAVIOR LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS behavior_logs (
    id          BIGSERIAL PRIMARY KEY,
    session_id  UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    event_type  VARCHAR(100) NOT NULL,
    page_url    TEXT NOT NULL,
    metadata    JSONB NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_behavior_logs_session_id ON behavior_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_behavior_logs_created_at ON behavior_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_behavior_logs_event_type ON behavior_logs(event_type);

-- ============================================================
-- INDUSTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS industries (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url    TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_industries_slug ON industries(slug);

-- ============================================================
-- SOLUTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS solutions (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    description     TEXT,
    features        JSONB NOT NULL DEFAULT '[]',
    industry_id     INTEGER REFERENCES industries(id) ON DELETE SET NULL,
    industry_slug   VARCHAR(255),
    pricing_tier    VARCHAR(50),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_solutions_slug ON solutions(slug);
CREATE INDEX IF NOT EXISTS idx_solutions_industry_id ON solutions(industry_id);
CREATE INDEX IF NOT EXISTS idx_solutions_industry_slug ON solutions(industry_slug);

-- ============================================================
-- CASE STUDIES
-- ============================================================
CREATE TABLE IF NOT EXISTS case_studies (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    summary         TEXT,
    content         TEXT,
    client_name     VARCHAR(255),
    industry_id     INTEGER REFERENCES industries(id) ON DELETE SET NULL,
    solution_id     INTEGER REFERENCES solutions(id) ON DELETE SET NULL,
    results         JSONB NOT NULL DEFAULT '{}',
    is_published    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_industry_id ON case_studies(industry_id);

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    company         VARCHAR(255),
    phone           VARCHAR(50),
    message         TEXT,
    session_id      UUID REFERENCES sessions(id) ON DELETE SET NULL,
    consent_given   BOOLEAN NOT NULL DEFAULT FALSE,
    status          VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- ============================================================
-- SEED: Sample Industries (idempotent)
-- ============================================================
INSERT INTO industries (name, slug, description) VALUES
  ('Finance', 'finance', 'Financial services and banking sector'),
  ('Healthcare', 'healthcare', 'Healthcare and medical industry'),
  ('Retail', 'retail', 'Retail and e-commerce sector'),
  ('Manufacturing', 'manufacturing', 'Manufacturing and industrial sector'),
  ('Technology', 'technology', 'Technology and software sector')
ON CONFLICT (slug) DO NOTHING;
