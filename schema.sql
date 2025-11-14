-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Teams table (multi-tenant support)
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Kernels (digital personas)
CREATE TABLE IF NOT EXISTS kernels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'processing', 'ready', 'error'
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingest jobs (PDF uploads and processing)
CREATE TABLE IF NOT EXISTS ingest_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  progress INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contradictions (extracted value tensions)
CREATE TABLE IF NOT EXISTS contradictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  pole_a TEXT NOT NULL,
  pole_b TEXT NOT NULL,
  description TEXT,
  evidence TEXT,
  embedding vector(1536),
  cluster_id UUID,
  weight FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clusters (grouped contradictions)
CREATE TABLE IF NOT EXISTS clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update contradictions to reference clusters
ALTER TABLE contradictions ADD CONSTRAINT fk_cluster 
  FOREIGN KEY (cluster_id) REFERENCES clusters(id) ON DELETE SET NULL;

-- Deep memories (chunked text with embeddings)
CREATE TABLE IF NOT EXISTS deep_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  ingest_job_id UUID REFERENCES ingest_jobs(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Graph edges (pole relationships)
CREATE TABLE IF NOT EXISTS graph_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  source_contradiction_id UUID NOT NULL REFERENCES contradictions(id) ON DELETE CASCADE,
  target_contradiction_id UUID NOT NULL REFERENCES contradictions(id) ON DELETE CASCADE,
  weight FLOAT DEFAULT 1.0,
  relationship_type TEXT, -- 'reinforces', 'opposes', 'mediates'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System prompts
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat threads
CREATE TABLE IF NOT EXISTS chat_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kernel_id UUID NOT NULL REFERENCES kernels(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  collapse_trace JSONB, -- Reasoning path for transparency
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  key TEXT NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id, key)
);

-- Create indexes for performance
CREATE INDEX idx_kernels_team_id ON kernels(team_id);
CREATE INDEX idx_ingest_jobs_kernel_id ON ingest_jobs(kernel_id);
CREATE INDEX idx_contradictions_kernel_id ON contradictions(kernel_id);
CREATE INDEX idx_contradictions_cluster_id ON contradictions(cluster_id);
CREATE INDEX idx_deep_memories_kernel_id ON deep_memories(kernel_id);
CREATE INDEX idx_graph_edges_kernel_id ON graph_edges(kernel_id);
CREATE INDEX idx_chat_threads_kernel_id ON chat_threads(kernel_id);
CREATE INDEX idx_chat_messages_thread_id ON chat_messages(thread_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- Vector search indexes
CREATE INDEX idx_contradictions_embedding ON contradictions USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_deep_memories_embedding ON deep_memories USING ivfflat (embedding vector_cosine_ops);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE kernels ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingest_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contradictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE deep_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
CREATE POLICY "Users can view teams they're members of"
  ON teams FOR SELECT
  USING (
    id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
    OR owner_id = auth.uid()
  );

CREATE POLICY "Users can update teams they own"
  ON teams FOR UPDATE
  USING (owner_id = auth.uid());

-- RLS Policies for team_members
CREATE POLICY "Users can view team members of their teams"
  ON team_members FOR SELECT
  USING (
    team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
      UNION
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for kernels
CREATE POLICY "Users can view kernels in their teams"
  ON kernels FOR SELECT
  USING (
    team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
      UNION
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create kernels in their teams"
  ON kernels FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
      UNION
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update kernels in their teams"
  ON kernels FOR UPDATE
  USING (
    team_id IN (
      SELECT id FROM teams WHERE owner_id = auth.uid()
      UNION
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for ingest_jobs
CREATE POLICY "Users can view ingest jobs for their kernels"
  ON ingest_jobs FOR SELECT
  USING (
    kernel_id IN (
      SELECT id FROM kernels WHERE team_id IN (
        SELECT id FROM teams WHERE owner_id = auth.uid()
        UNION
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for contradictions
CREATE POLICY "Users can view contradictions for their kernels"
  ON contradictions FOR SELECT
  USING (
    kernel_id IN (
      SELECT id FROM kernels WHERE team_id IN (
        SELECT id FROM teams WHERE owner_id = auth.uid()
        UNION
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for deep_memories
CREATE POLICY "Users can view deep memories for their kernels"
  ON deep_memories FOR SELECT
  USING (
    kernel_id IN (
      SELECT id FROM kernels WHERE team_id IN (
        SELECT id FROM teams WHERE owner_id = auth.uid()
        UNION
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

-- RLS Policies for chat_threads
CREATE POLICY "Users can view their chat threads"
  ON chat_threads FOR SELECT
  USING (
    user_id = auth.uid()
    OR kernel_id IN (
      SELECT id FROM kernels WHERE team_id IN (
        SELECT id FROM teams WHERE owner_id = auth.uid()
        UNION
        SELECT team_id FROM team_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create chat threads"
  ON chat_threads FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in their threads"
  ON chat_messages FOR SELECT
  USING (
    thread_id IN (
      SELECT id FROM chat_threads WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their threads"
  ON chat_messages FOR INSERT
  WITH CHECK (
    thread_id IN (
      SELECT id FROM chat_threads WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for settings
CREATE POLICY "Users can view their settings"
  ON settings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their settings"
  ON settings FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their settings"
  ON settings FOR INSERT
  WITH CHECK (user_id = auth.uid());
