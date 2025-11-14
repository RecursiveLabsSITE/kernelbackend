# Kernel Studio - Complete Application

A sophisticated AI system for creating and interacting with digital personas ("Kernels") based on uploaded PDFs. The system extracts contradictions, scars, refusals, phases, and masks to build a clustered "graph brain" of value tensions.

## 🎯 Features

### 1. Settings Tab
- **Team Management**: Manage teams and collaborators
- **Model Configuration**: 
  - Embedding Model: BGE-M3
  - Language Model: GPT-4
- **Retrieval Weights**: Fine-tune contradiction-based reasoning weights
  - Pair: 0.32
  - Single: 0.12
  - Cluster: 0.16
  - Scar + Phase: 0.14
  - Bias: 0.10
  - Refusal: 0.10
  - Mask: 0.06
- **Safety Settings**: CLEAR strictness configuration

### 2. Kernels Tab
- **Grid View**: Browse all kernels with status and descriptions
- **Create Kernels**: Add new digital personas
- **Kernel Details**: Access 5 sub-tabs per kernel:
  - **Overview**: Stats dashboard (contradictions, deep memories, clusters)
  - **Ingest**: PDF upload and batch processing
  - **Data**: Contradictions explorer with detailed analysis
  - **Contradictions**: Value tensions with scar valence, phases, refusal flags
  - **Graph Brain**: Pole network visualization (force graph)
  - **Prompt**: System prompt editor with voice priority settings

### 3. Chat Tab
- **Kernel Selection**: Choose which kernel to chat with
- **Conversation Threads**: Create and manage multiple conversations
- **Real-time Messaging**: Live chat with contradiction-based reasoning
- **Collapse Traces**: Transparent reasoning paths showing how responses are generated

## 📊 Demo Data

Two pre-loaded kernels:

### Marcus Aurelius
- **Description**: Roman Emperor and Stoic Philosopher (121-180 AD)
- **Contradictions**: 2
  - Duty ↔ Desire (Scar Valence: 0.75, Phase: reign)
  - Reason ↔ Emotion (Scar Valence: 0.65, Phase: philosophy)

### Cleopatra VII
- **Description**: Last Active Pharaoh of Egypt (69-30 BC)
- **Contradictions**: 2
  - Power ↔ Love (Scar Valence: 0.82, Phase: reign, Refusal: Yes)
  - Ambition ↔ Survival (Scar Valence: 0.71, Phase: decline)

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Inline styles (minimal, clean design)
- **State Management**: React hooks (useState, useEffect)

### Backend
- **Database**: PostgreSQL (localhost:5432)
- **API Routes**: Next.js API routes with pg library
- **Authentication**: User context (ryan@datingappelites.com)

### Database Schema
```
- profiles: User profiles
- teams: Team management
- team_members: Team membership
- kernels: Digital personas
- kernel_settings: Model and weight configuration
- contradictions: Value tensions
- graph_edges: Pole network connections
- chat_threads: Conversation threads
- chat_messages: Chat messages
- deep_memories: Extracted memories
- clusters: Value tension clusters
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or bun

### Installation

```bash
cd /home/code/kernel-studio
npm install
```

### Environment Setup

```bash
export PGUSER=postgres
export PGPASSWORD=your_password
export PGDATABASE=kernel_studio
```

### Database Setup

```bash
createdb -h localhost kernel_studio
PGPASSWORD=$PGPASSWORD psql -h localhost -U $PGUSER -d kernel_studio -f schema.sql
PGPASSWORD=$PGPASSWORD psql -h localhost -U $PGUSER -d kernel_studio -f seed.sql
```

### Running the Application

```bash
npm run dev
```

The application will start on `http://localhost:3002`

## 📁 Project Structure

```
kernel-studio/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── settings/
│   │   └── page.tsx            # Settings page
│   ├── kernels/
│   │   ├── page.tsx            # Kernels list
│   │   └── [kernelId]/
│   │       ├── layout.tsx      # Kernel detail layout
│   │       ├── overview/
│   │       │   └── page.tsx    # Overview tab
│   │       ├── ingest/
│   │       │   └── page.tsx    # Ingest tab
│   │       ├── contradictions/
│   │       │   └── page.tsx    # Contradictions tab
│   │       ├── graph/
│   │       │   └── page.tsx    # Graph brain tab
│   │       └── prompt/
│   │           └── page.tsx    # Prompt tab
│   ├── chat/
│   │   └── page.tsx            # Chat page
│   └── api/
│       ├── kernels/
│       │   ├── route.ts        # GET/POST kernels
│       │   └── [id]/
│       │       ├── route.ts    # GET kernel by ID
│       │       └── contradictions/
│       │           └── route.ts # GET contradictions
│       └── teams/
│           └── route.ts        # GET teams
├── lib/
│   └── supabase.ts             # Supabase client (legacy)
├── public/
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🔌 API Endpoints

### Kernels
- `GET /api/kernels` - List all kernels
- `POST /api/kernels` - Create new kernel
- `GET /api/kernels/[id]` - Get kernel details
- `GET /api/kernels/[id]/contradictions` - Get kernel contradictions

### Teams
- `GET /api/teams` - List all teams

## 🎨 UI Components

All components use inline styles for simplicity and consistency:
- Clean, minimal design
- Responsive grid layouts
- Color-coded poles (red for pole_a, blue for pole_b)
- Status indicators
- Loading states

## 🔄 Data Flow

1. **User navigates to Kernels tab**
   - Frontend fetches `/api/kernels`
   - Displays grid of kernel cards

2. **User clicks on a kernel**
   - Navigates to `/kernels/[id]/overview`
   - Fetches kernel details from `/api/kernels/[id]`
   - Fetches contradictions from `/api/kernels/[id]/contradictions`
   - Displays overview with stats

3. **User switches tabs**
   - Client-side navigation (no page reload)
   - Fetches relevant data for each tab
   - Updates UI with new content

## 🛠️ Development

### Adding a New API Route

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'kernel_studio',
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query('SELECT * FROM table_name')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

### Adding a New Page

```typescript
// app/example/page.tsx
'use client'

import { useState, useEffect } from 'react'

export default function ExamplePage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const res = await fetch('/api/example')
      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return <div>{/* Your content */}</div>
}
```

## 📝 Notes

- All pages are client components (`'use client'`) for interactivity
- Layout files are server components for async params handling
- API routes use async params with `await params`
- Database values are parsed (e.g., `parseFloat()` for numeric strings)
- No external UI library - all styling is inline for simplicity

## 🚀 Next Steps

1. **Connect to FastAPI Backend**: Implement actual AI processing
2. **PDF Upload**: Implement file upload to Supabase Storage
3. **Real Chat**: Connect chat to actual LLM responses
4. **Graph Visualization**: Implement force graph for pole networks
5. **Authentication**: Add proper user authentication
6. **Deployment**: Deploy to production environment

## 📄 License

Proprietary - Dating App Elites

## 👤 Author

Ryan Angel (ryan@datingappelites.com)
