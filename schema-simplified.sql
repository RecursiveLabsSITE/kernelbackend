-- Kernel Studio Schema (Simplified - no vector extension)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles & Teams
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- Kernels
CREATE TABLE IF NOT EXISTS kernels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  era TEXT,
  status TEXT DEFAULT 'idle',
  last_built_at TIMESTAMP WITH TIME ZONE,
  stats JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kernel_settings (
  kernel_id UUID PRIMARY KEY REFERENCES kernels(id) ON DELETE CASCADE,
  models JSONB DEFAULT '{"embed":"bge-m3","llm":"gpt-4"}',
  weights JSONB DEFAULT '{"pair":0.32,"single":0.12,"cluster":0.16,"scar_phase":0.14,"bias":0.10,"refusal":0.10,"mask":0.06}',
  safety JSONB DEFAULT '{"clear_strictness":0.8}'
);

CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  system_text TEXT NOT NULL,
  voice_priority TEXT[] DEFAULT ARRAY['aphorism','counsel','edict'],
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingest
CREATE TABLE IF NOT EXISTS ingest_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'queued',
  step JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES ingest_batches(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  content_type TEXT,
  ocr BOOLEAN DEFAULT TRUE,
  parse_status TEXT DEFAULT 'queued',
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge
CREATE TABLE IF NOT EXISTS contradictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  pole_a TEXT NOT NULL,
  pole_b TEXT NOT NULL,
  collapse_direction TEXT,
  scar_valence NUMERIC,
  refusal BOOLEAN DEFAULT FALSE,
  life_phase TEXT,
  life_phase_weight NUMERIC,
  event TEXT,
  quote_ref TEXT[],
  cluster_id UUID,
  mask_inner TEXT,
  mask_outer TEXT,
  mask_polarity TEXT,
  mask_loop_hint TEXT,
  mask_signals TEXT[],
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deep_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  source_label TEXT,
  text TEXT,
  tags TEXT[],
  life_phase TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  label_tokens TEXT[],
  member_ids UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS graph_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  pole_a TEXT NOT NULL,
  pole_b TEXT NOT NULL,
  frequency INT,
  direction_bias NUMERIC,
  scar_sum NUMERIC,
  refusal_present BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat
CREATE TABLE IF NOT EXISTS chat_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  title TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  trace JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_kernels_team_id ON kernels(team_id);
CREATE INDEX idx_ingest_batches_kernel_id ON ingest_batches(kernel_id);
CREATE INDEX idx_sources_kernel_id ON sources(kernel_id);
CREATE INDEX idx_contradictions_kernel_id ON contradictions(kernel_id);
CREATE INDEX idx_deep_memories_kernel_id ON deep_memories(kernel_id);
CREATE INDEX idx_clusters_kernel_id ON clusters(kernel_id);
CREATE INDEX idx_graph_edges_kernel_id ON graph_edges(kernel_id);
CREATE INDEX idx_chat_threads_kernel_id ON chat_threads(kernel_id);
CREATE INDEX idx_chat_messages_thread_id ON chat_messages(thread_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
