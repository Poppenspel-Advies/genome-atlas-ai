# 🧬 Genomi Atlas AI — Evolutionary Time Machine

**Genomi Atlas AI** is an AI-powered evolutionary biology platform that lets you upload any biological specimen (photo, video, voice note, or text description) and explore **two alternate evolutionary futures** — Quantum (radiation-induced mutation) and Natural Selection (classical evolutionary pressures).

Built with React, TypeScript, TailwindCSS v4, Supabase, Gemini AI, and free-tier image generation models.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧬 **Specimen Analysis** | Upload photos, videos, voice notes, or text descriptions of biological specimens |
| 🔬 **Dual Evolution Paths** | Each analysis generates Quantum + Natural Selection futures |
| 🎨 **AI-Generated Images** | Pollinations.ai + Hugging Face free models render evolved species visuals |
| 🎧 **Voice Narration** | ElevenLabs-powered narration for each evolutionary outcome |
| 📊 **Weekly Reports** | Auto-generated summaries of your analysis history |
| 🕰️ **Time Machine** | Weekly trend charts, analysis maps, and future projections |
| 👤 **User Profiles** | Supabase auth with magic link, profile page with stats |
| 🎓 **3 User Levels** | Beginner (free), Researcher ($12/mo), Scientist ($29/mo) |
| 💬 **AI Chat** | Level-aware conversational assistant |
| 📋 **Analysis History** | Full history with delete, export, and weekly reports |
| 🦕 **Dino Archive** | 12 prehistoric species with detailed profile cards |
| 🔗 **Integrations Hub** | Supabase, Gemini, Hugging Face, Pollinations, Speechmatics, ElevenLabs, Bright Data |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Client (React SPA)                    │
│  ┌─────────────┐ ┌────────────┐ ┌──────────────────┐  │
│  │  UploadArea  │ │ ResultView │ │ Evolution Views  │  │
│  │  + Samples   │ │ + Choose   │ │ Cube / Narration │  │
│  └──────┬──────┘ └─────┬──────┘ └────────┬─────────┘  │
│         │              │                 │             │
│  ┌──────┴──────────────┴─────────────────┴──────────┐  │
│  │              App.tsx (State Machine)              │  │
│  │  input → generating → choose → cube (or error)   │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                              │
│  ┌──────────────────────┴───────────────────────────┐  │
│  │         Sidebar Views (15 navigation views)      │  │
│  │  Workspace · Projects · AI Tools · Integrations  │  │
│  │  Dino Archive · Fossil Library · Timeline Exp.   │  │
│  │  Genome Scanner · Compare Species · Evolve Sim.  │  │
│  │  Mutation Map · History · Time Machine · Profile │  │
│  │  Subscription · Settings                          │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                              │
│  ┌──────────────────────┴───────────────────────────┐  │
│  │     Stores: analysisStore, toastStore, userLevel │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────┴─────────────────────────────┐
│              Supabase Backend (Edge Functions)         │
│  ┌───────────┐ ┌──────────┐ ┌───────────┐ ┌────────┐ │
│  │ gemini-   │ │brightdata│ │speechmatics│ │ elevenl│ │
│  │ analyze   │ │-scrape   │ │-token     │ │ -narate│ │
│  └───────────┘ └──────────┘ └───────────┘ └────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Supabase Auth (Magic Link) + Storage (images)   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

External APIs:
  · Gemini 2.0 (AI analysis)
  · Pollinations.ai (free image gen)
  · Hugging Face (free image gen fallback)
  · ElevenLabs (voice narration)
  · Speechmatics (transcription)
  · Bright Data (web scraping reference data)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 + TypeScript |
| **Build** | Vite 5 |
| **Styling** | TailwindCSS v4 + CSS theme tokens |
| **Icons** | Lucide React |
| **Auth & Backend** | Supabase (Auth, Edge Functions, Storage) |
| **AI Analysis** | Google Gemini 2.0 (via Supabase Edge Function) |
| **Image Generation** | Pollinations.ai + Hugging Face free inference |
| **Voice** | ElevenLabs TTS, Speechmatics STT |
| **State** | React useState + useCallback + localStorage |
| **Routing** | SPA with sidebar-driven view switching |
| **Deployment** | Vite build → static hosting |

---

## 📁 Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Main state machine + layout
├── index.css                   # Tailwind + theme tokens
├── constants/
│   └── config.ts               # API config
├── lib/
│   ├── api.ts                  # Edge function wrappers
│   ├── supabase.ts             # Supabase client init
│   ├── analysisStore.ts        # Local storage analysis history
│   ├── userLevels.ts           # User tier system
│   ├── toastStore.ts           # Toast notification store
│   ├── hugginface.ts           # HF image generation
│   └── imageGeneration.ts      # Pollinations image generation
└── components/
    ├── UploadArea.tsx           # File upload with 4 modes
    ├── ResultView.tsx           # Analysis results display
    ├── OutcomeCard.tsx          # Evolution outcome card
    ├── NarrationPlayer.tsx      # TTS narration player
    ├── SampleSpecimens.tsx      # Sample data
    ├── SampleSpecimenGrid.tsx   # Sample grid
    ├── DinosaurSpecimens.tsx    # Dino data
    ├── InstructionGuide.tsx     # How-to guide modal
    ├── ToastContainer.tsx       # Toast notifications
    └── views/
        ├── WorkspaceView.tsx    # Dashboard with stats
        ├── ProjectsView.tsx     # Saved projects
        ├── AIToolsView.tsx      # AI analysis tools
        ├── IntegrationsView.tsx # External integrations
        ├── DinoArchiveView.tsx  # 12 dino species
        ├── FossilLibraryView.tsx# Fossil database
        ├── TimelineExplorerView.tsx # Timeline
        ├── GenomeScannerView.tsx# Genome scanning
        ├── CompareSpeciesView.tsx   # Species comparison
        ├── EvolutionSimulatorView.tsx # Simulator
        ├── MutationMapView.tsx  # Mutation visualization
        ├── HistoryView.tsx      # Analysis history
        ├── TimeMachineView.tsx  # Trend chart + projections
        ├── SubscriptionView.tsx # Pricing plans
        ├── SettingsView.tsx     # User preferences
        └── ProfileView.tsx      # User profile page
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ / npm 9+
- A Supabase account (free tier works)
- A Google Gemini API key

### Installation

```bash
# 1. Clone repository
git clone <repo-url>
cd genomi-atlas-ai

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

### Supabase Setup

1. Create a Supabase project
2. Enable Auth with Magic Link (email OTP)
3. Create Storage bucket `specimens`
4. Deploy Edge Functions:
   - `gemini-analyze` — AI analysis
   - `speechmatics-token` — Speechmatics JWT
   - `brightdata-scrape` — Web scraping

### Edge Function Secrets

| Secret | Description |
|--------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `SPEECHMATICS_API_KEY` | Speechmatics API key |
| `BRIGHT_DATA_TOKEN` | Bright Data token |
| `ELEVENLABS_API_KEY` | ElevenLabs API key |

---

## 🔌 API Reference

### `POST gemini-analyze`
Analyze a biological specimen.

```json
// Request
{ "imageBase64": "...", "transcription": "...", "textDescription": "..." }

// Response  
{ "speciesName": "T-Rex", "confidence": 0.95, "outcomes": [...] }
```

### Client Library

```typescript
import { analyzeSpecimen } from './lib/api';
import { getSpecimenImageUrl } from './lib/imageGeneration';
import { addAnalysisRecord, getAnalysisRecords } from './lib/analysisStore';
import { toast } from './components/ToastContainer';

// Analyze a specimen
const result = await analyzeSpecimen({ textDescription: "A large dinosaur" });

// Generate image
const { url } = getSpecimenImageUrl("Evolved T-Rex with wings");

// Save to history
addAnalysisRecord({ speciesName: "T-Rex", confidence: 0.95, ... });

// Toast notifications
toast.success('Done!', 'Analysis complete');
```

---

## 🎨 UI Screenshots / Screens

| Screen | Description |
|--------|-------------|
| **Analyze Species** | 4 input modes + sample specimens grid |
| **Generating** | Animated 5-step progress sequence |
| **Choose Outcome** | Dual-path comparison cards |
| **Time Machine Cube** | Narration player with AI-generated image |
| **Workspace** | Stats dashboard + recent activity |
| **Dino Archive** | 12 dino species with detail cards |
| **History** | Full analysis log with weekly reports |
| **Time Machine** | Trend charts + timeline projections |
| **Subscription** | 3-tier pricing comparison |
| **Settings** | Level selector, notifications, data |
| **Profile** | User avatar, stats, activity, preferences |
| **AI Chat** | Level-aware conversational assistant |

---

## 🤝 Integrations

- **Supabase** — Auth, Storage, Edge Functions
- **Google Gemini 2.0** — AI analysis engine
- **Pollinations.ai** — Free image generation
- **Hugging Face** — Free fallback image gen
- **ElevenLabs** — TTS narration
- **Speechmatics** — Voice transcription
- **Bright Data** — Web scraping reference data

---

## 📝 License

MIT

---

## 🙏 Acknowledgments

Built on NativelyAI, powered by Gemini, images by Pollinations.ai, voice by ElevenLabs.
