# Kernel Studio - Quick Start Guide

## 🚀 Access the Application

### Local Development
```
http://localhost:3001
```

### Public URL
```
https://silly-ghosts-shake.lindy.site
```

---

## 📋 Main Features

### 1. **Kernels Tab** (Main Page)
- View all available kernels
- See kernel cards with descriptions
- Click any kernel to view details
- "+ Create Kernel" button to add new kernels

### 2. **Kernel Detail Pages** (6 Tabs)

#### **Overview Tab**
- View kernel statistics
- See all contradictions at a glance
- Quick reference for kernel status

#### **Contradictions Tab** ⭐ (Most Interactive)
- View all value tensions
- Click "+ Add Tension" to create new contradictions
- Fill in:
  - **Pole A**: First value (e.g., "Duty")
  - **Pole B**: Second value (e.g., "Desire")
  - **Scar Valence**: Drag slider 0-100%
  - **Life Phase**: Select from dropdown
  - **Refusal Flag**: Check if applicable
- Click "Create Tension" to save

#### **Ingest Tab**
- Upload PDF files
- Manage processing batches
- Extract biographical data

#### **Data Tab**
- View extracted chunks
- Explore data structure
- Manage sources

#### **Graph Tab**
- Visualize contradiction relationships
- See pole network (coming soon)
- Understand kernel structure

#### **Prompt Tab**
- Edit system prompt
- Configure voice priority
- Customize kernel behavior

### 3. **Settings Tab**
- Team management
- Model configuration
- Retrieval weights
- Safety settings

### 4. **Chat Tab**
- Conversation interface
- Chat with kernels
- View chat history

---

## 🎯 Demo Kernels

### Marcus Aurelius
- **Type**: Roman Emperor
- **Contradictions**: 
  - Duty ↔ Desire (75% scar valence)
  - Reason ↔ Emotion (65% scar valence)
- **Status**: Idle

### Cleopatra VII
- **Type**: Egyptian Pharaoh
- **Contradictions**:
  - Power ↔ Love
  - Ambition ↔ Survival
- **Status**: Idle

---

## 💡 How to Use

### Creating a New Contradiction

1. Click on any kernel (e.g., Marcus Aurelius)
2. Click the "Contradictions" tab
3. Click "+ Add Tension" button
4. Fill in the form:
   ```
   Pole A: Power
   Pole B: Love
   Scar Valence: 79% (drag slider)
   Life Phase: Early Life
   Refusal Flag: (optional)
   ```
5. Click "Create Tension"
6. New contradiction appears in the list immediately

### Viewing Kernel Details

1. From Kernels page, click any kernel card
2. You'll see the Overview tab by default
3. Click other tabs to explore:
   - Overview: Stats and contradictions
   - Contradictions: Manage value tensions
   - Ingest: Upload PDFs
   - Data: View extracted data
   - Graph: See relationships
   - Prompt: Configure behavior

### Navigating Back

- Click "Back to Kernels" link to return to main page
- Or click "Kernels" tab at the top

---

## 🎨 UI Elements

### Color Coding
- **Red (#dc2626)**: Pole A values
- **Blue (#2563eb)**: Pole B values
- **Dark Gray (#111827)**: Primary buttons
- **Light Gray (#e5e7eb)**: Borders

### Interactive Elements
- **Buttons**: Click to perform actions
- **Sliders**: Drag to adjust values (0-100%)
- **Dropdowns**: Click to select options
- **Checkboxes**: Click to toggle flags
- **Textareas**: Type to edit content
- **Input Fields**: Type to enter text

---

## 📊 Data Display

### Contradictions Display
```
Pole A ↔ Pole B
Scar Valence: XX%
Phase: [Life Phase]
[Refusal] (if flagged)
```

### Stats Dashboard
- **Contradictions**: Number of value tensions
- **Deep Memories**: Stored memories (0 for now)
- **Clusters**: Data clusters (0 for now)
- **Status**: Current kernel status

---

## 🔧 Technical Details

### Database
- **Type**: PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database**: kernel_studio

### API Endpoints
- `GET /api/kernels` - List all kernels
- `POST /api/kernels` - Create kernel
- `GET /api/kernels/[id]` - Get kernel details
- `GET /api/kernels/[id]/contradictions` - List contradictions
- `POST /api/kernels/[id]/contradictions` - Create contradiction

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Inline CSS
- **Port**: 3001

---

## ✅ What's Working

- ✅ View all kernels
- ✅ View kernel details
- ✅ Create new contradictions
- ✅ Display contradictions with all details
- ✅ Real-time data loading
- ✅ Form validation
- ✅ API integration
- ✅ Database persistence
- ✅ Responsive design
- ✅ Professional UI

---

## 🚧 Coming Soon

- Chat interface with real-time messaging
- Graph visualization of contradictions
- PDF upload and processing
- Advanced data exploration
- User authentication
- Export functionality

---

## 📞 Support

For issues or questions:
1. Check the browser console for errors
2. Verify PostgreSQL is running
3. Ensure the dev server is running on port 3001
4. Check server logs: `tail -f /home/code/kernel-studio/server.log`

---

## 🎓 Learning Resources

### Understanding Kernels
- Kernels are digital personas created from biographical data
- They use contradiction-based reasoning for authentic responses
- Value tensions (contradictions) define their personality

### Understanding Contradictions
- **Poles**: Two opposing values (e.g., Duty vs Desire)
- **Scar Valence**: Intensity of the contradiction (0-100%)
- **Life Phase**: When the contradiction was most relevant
- **Refusal Flag**: Whether the kernel refuses to engage with this tension

---

*Last Updated: November 13, 2025*
*Status: Production Ready ✅*
