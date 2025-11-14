# Kernel Studio - API Documentation

## Base URL

```
http://localhost:3000/api
https://kernel-studio.lindy.site/api
```

## Authentication

Currently, the API uses a simple user context. Future versions will implement JWT authentication.

```typescript
// User context (ryan@datingappelites.com)
const userId = 'ryan@datingappelites.com'
```

## Response Format

All responses are JSON with the following structure:

### Success Response
```json
{
  "data": { /* response data */ },
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400
}
```

---

## Endpoints

### Teams

#### GET /api/teams
Fetch all teams for the current user.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Ryan's Team",
    "description": "Main team",
    "created_at": "2025-11-12T00:00:00Z"
  }
]
```

**Example:**
```bash
curl http://localhost:3000/api/teams
```

---

### Kernels

#### GET /api/kernels
Fetch all kernels.

**Query Parameters:**
- `team_id` (optional): Filter by team ID
- `status` (optional): Filter by status (idle, processing, active)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Marcus Aurelius",
    "description": "Roman Emperor and Stoic Philosopher (121-180 AD)",
    "status": "idle",
    "team_id": "uuid",
    "created_at": "2025-11-12T00:00:00Z",
    "updated_at": "2025-11-12T00:00:00Z"
  },
  {
    "id": "uuid",
    "name": "Cleopatra VII",
    "description": "Last Active Pharaoh of Egypt (69-30 BC)",
    "status": "idle",
    "team_id": "uuid",
    "created_at": "2025-11-12T00:00:00Z",
    "updated_at": "2025-11-12T00:00:00Z"
  }
]
```

**Example:**
```bash
curl http://localhost:3000/api/kernels
curl http://localhost:3000/api/kernels?status=idle
```

---

#### POST /api/kernels
Create a new kernel.

**Request Body:**
```json
{
  "name": "Leonardo da Vinci",
  "description": "Renaissance polymath (1452-1519)",
  "team_id": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Leonardo da Vinci",
  "description": "Renaissance polymath (1452-1519)",
  "status": "idle",
  "team_id": "uuid",
  "created_at": "2025-11-12T00:00:00Z",
  "updated_at": "2025-11-12T00:00:00Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/kernels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Leonardo da Vinci",
    "description": "Renaissance polymath (1452-1519)",
    "team_id": "uuid"
  }'
```

---

#### GET /api/kernels/[id]
Fetch a specific kernel by ID.

**Response:**
```json
{
  "id": "uuid",
  "name": "Marcus Aurelius",
  "description": "Roman Emperor and Stoic Philosopher (121-180 AD)",
  "status": "idle",
  "team_id": "uuid",
  "created_at": "2025-11-12T00:00:00Z",
  "updated_at": "2025-11-12T00:00:00Z"
}
```

**Example:**
```bash
curl http://localhost:3000/api/kernels/550e8400-e29b-41d4-a716-446655440000
```

---

#### GET /api/kernels/[id]/contradictions
Fetch all contradictions for a specific kernel.

**Response:**
```json
[
  {
    "id": "uuid",
    "kernel_id": "uuid",
    "pole_a": "Duty",
    "pole_b": "Desire",
    "scar_valence": 0.75,
    "life_phase": "reign",
    "refusal_flag": false,
    "created_at": "2025-11-12T00:00:00Z"
  },
  {
    "id": "uuid",
    "kernel_id": "uuid",
    "pole_a": "Reason",
    "pole_b": "Emotion",
    "scar_valence": 0.65,
    "life_phase": "philosophy",
    "refusal_flag": false,
    "created_at": "2025-11-12T00:00:00Z"
  }
]
```

**Example:**
```bash
curl http://localhost:3000/api/kernels/550e8400-e29b-41d4-a716-446655440000/contradictions
```

---

### Contradictions

#### GET /api/contradictions
Fetch all contradictions (global).

**Query Parameters:**
- `kernel_id` (optional): Filter by kernel ID
- `pole_a` (optional): Filter by pole A value
- `pole_b` (optional): Filter by pole B value

**Response:**
```json
[
  {
    "id": "uuid",
    "kernel_id": "uuid",
    "pole_a": "Duty",
    "pole_b": "Desire",
    "scar_valence": 0.75,
    "life_phase": "reign",
    "refusal_flag": false,
    "created_at": "2025-11-12T00:00:00Z"
  }
]
```

---

#### POST /api/contradictions
Create a new contradiction.

**Request Body:**
```json
{
  "kernel_id": "uuid",
  "pole_a": "Ambition",
  "pole_b": "Humility",
  "scar_valence": 0.68,
  "life_phase": "early_life",
  "refusal_flag": false
}
```

**Response:**
```json
{
  "id": "uuid",
  "kernel_id": "uuid",
  "pole_a": "Ambition",
  "pole_b": "Humility",
  "scar_valence": 0.68,
  "life_phase": "early_life",
  "refusal_flag": false,
  "created_at": "2025-11-12T00:00:00Z"
}
```

---

### Chat

#### GET /api/chat/threads
Fetch all chat threads.

**Query Parameters:**
- `kernel_id` (optional): Filter by kernel ID

**Response:**
```json
[
  {
    "id": "uuid",
    "kernel_id": "uuid",
    "title": "Philosophy Discussion",
    "created_at": "2025-11-12T00:00:00Z",
    "updated_at": "2025-11-12T00:00:00Z"
  }
]
```

---

#### POST /api/chat/threads
Create a new chat thread.

**Request Body:**
```json
{
  "kernel_id": "uuid",
  "title": "Stoic Philosophy"
}
```

**Response:**
```json
{
  "id": "uuid",
  "kernel_id": "uuid",
  "title": "Stoic Philosophy",
  "created_at": "2025-11-12T00:00:00Z",
  "updated_at": "2025-11-12T00:00:00Z"
}
```

---

#### GET /api/chat/threads/[id]/messages
Fetch all messages in a chat thread.

**Query Parameters:**
- `limit` (optional, default: 50): Number of messages to fetch
- `offset` (optional, default: 0): Pagination offset

**Response:**
```json
[
  {
    "id": "uuid",
    "thread_id": "uuid",
    "role": "user",
    "content": "What is your philosophy on duty?",
    "created_at": "2025-11-12T00:00:00Z"
  },
  {
    "id": "uuid",
    "thread_id": "uuid",
    "role": "assistant",
    "content": "Duty is the foundation of virtue...",
    "created_at": "2025-11-12T00:00:00Z"
  }
]
```

---

#### POST /api/chat/threads/[id]/messages
Send a message in a chat thread.

**Request Body:**
```json
{
  "content": "What is your philosophy on duty?"
}
```

**Response:**
```json
{
  "id": "uuid",
  "thread_id": "uuid",
  "role": "user",
  "content": "What is your philosophy on duty?",
  "created_at": "2025-11-12T00:00:00Z"
}
```

---

### Settings

#### GET /api/settings
Fetch application settings.

**Response:**
```json
{
  "embedding_model": "BGE-M3",
  "language_model": "GPT-4",
  "retrieval_weights": {
    "pair": 0.32,
    "single": 0.12,
    "cluster": 0.16,
    "scar_phase": 0.14,
    "bias": 0.10,
    "refusal": 0.10,
    "mask": 0.06
  },
  "safety_level": "CLEAR"
}
```

---

#### PUT /api/settings
Update application settings.

**Request Body:**
```json
{
  "embedding_model": "BGE-M3",
  "language_model": "GPT-4",
  "retrieval_weights": {
    "pair": 0.35,
    "single": 0.12,
    "cluster": 0.16,
    "scar_phase": 0.14,
    "bias": 0.10,
    "refusal": 0.10,
    "mask": 0.03
  },
  "safety_level": "CLEAR"
}
```

**Response:**
```json
{
  "embedding_model": "BGE-M3",
  "language_model": "GPT-4",
  "retrieval_weights": {
    "pair": 0.35,
    "single": 0.12,
    "cluster": 0.16,
    "scar_phase": 0.14,
    "bias": 0.10,
    "refusal": 0.10,
    "mask": 0.03
  },
  "safety_level": "CLEAR"
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

Currently, there is no rate limiting. Future versions will implement:
- 100 requests per minute per user
- 1000 requests per hour per user

---

## Pagination

For endpoints that return lists, pagination is supported:

**Query Parameters:**
- `limit` (optional, default: 50, max: 100): Number of items per page
- `offset` (optional, default: 0): Number of items to skip

**Response:**
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 150,
    "has_more": true
  }
}
```

---

## Filtering

Most list endpoints support filtering:

**Query Parameters:**
- `filter[field]`: Filter by field value
- `sort`: Sort by field (prefix with `-` for descending)

**Example:**
```bash
curl "http://localhost:3000/api/kernels?filter[status]=idle&sort=-created_at"
```

---

## Webhooks (Future)

Webhooks will be available for:
- `kernel.created`
- `kernel.updated`
- `contradiction.created`
- `chat.message_received`

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import fetch from 'node-fetch'

const API_BASE = 'http://localhost:3000/api'

// Fetch kernels
async function getKernels() {
  const response = await fetch(`${API_BASE}/kernels`)
  return response.json()
}

// Create kernel
async function createKernel(name: string, description: string) {
  const response = await fetch(`${API_BASE}/kernels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description })
  })
  return response.json()
}

// Send chat message
async function sendMessage(threadId: string, content: string) {
  const response = await fetch(`${API_BASE}/chat/threads/${threadId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  return response.json()
}
```

### Python

```python
import requests

API_BASE = 'http://localhost:3000/api'

def get_kernels():
    response = requests.get(f'{API_BASE}/kernels')
    return response.json()

def create_kernel(name, description):
    response = requests.post(
        f'{API_BASE}/kernels',
        json={'name': name, 'description': description}
    )
    return response.json()

def send_message(thread_id, content):
    response = requests.post(
        f'{API_BASE}/chat/threads/{thread_id}/messages',
        json={'content': content}
    )
    return response.json()
```

### cURL

```bash
# Get kernels
curl http://localhost:3000/api/kernels

# Create kernel
curl -X POST http://localhost:3000/api/kernels \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Test kernel"}'

# Send message
curl -X POST http://localhost:3000/api/chat/threads/UUID/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello"}'
```

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Teams, Kernels, Contradictions endpoints
- Chat threads and messages
- Settings management

### v1.1.0 (Planned)
- JWT authentication
- Rate limiting
- Webhooks
- Advanced filtering
- Batch operations

---

## Support

For API issues or questions:
- Email: ryan@datingappelites.com
- Documentation: [kernel-studio.lindy.site](https://kernel-studio.lindy.site)
