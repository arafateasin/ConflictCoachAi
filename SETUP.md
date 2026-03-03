# ConflictCoach AI - Voice Training Simulator

A fully functional Next.js 14 voice training simulator built with TypeScript, Google Gemini API, ElevenLabs React SDK, and Tailwind CSS.

## 🚀 Features

- **6 Training Scenarios**: From Easy to Extreme difficulty levels
- **AI-Powered Analysis**: Google Gemini analyzes conversation performance
- **Voice Integration**: ElevenLabs React SDK for realistic voice interactions
- **Real-time Stress Monitoring**: Dynamic stress level tracking
- **Performance Feedback**: Detailed analysis with mistakes, tips, and stress graphs
- **Local Authentication**: localStorage-based session management
- **Beautiful Dark UI**: Glassmorphism effects with Framer Motion animations

## 📋 Prerequisites

- Node.js 18+ or Bun
- Google Gemini API Key
- ElevenLabs Agent IDs (6 agents for 6 scenarios)

## 🛠️ Setup

1. **Clone and Install Dependencies**

```bash
npm install
# or
bun install
```

2. **Configure Environment Variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_AGENT_ID_1=your_agent_id_for_wrong_delivery
NEXT_PUBLIC_AGENT_ID_2=your_agent_id_for_billing_errors
NEXT_PUBLIC_AGENT_ID_3=your_agent_id_for_technical_glitch
NEXT_PUBLIC_AGENT_ID_4=your_agent_id_for_delayed_shipment
NEXT_PUBLIC_AGENT_ID_5=your_agent_id_for_refund_rejected
NEXT_PUBLIC_AGENT_ID_6=your_agent_id_for_support_runaround
```

3. **Run Development Server**

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Gemini API integration
│   ├── layout.tsx                # Root layout with AuthProvider
│   ├── page.tsx                  # Main page with 4 views
│   └── globals.css               # Global styles
├── components/
│   └── ui/                       # shadcn/ui components
├── config/
│   └── scenarios.ts              # 6 training scenarios
├── context/
│   └── AuthContext.tsx           # Authentication & session management
├── types/
│   └── index.ts                  # TypeScript interfaces
├── lib/
│   └── utils.ts                  # Utility functions
└── next.config.js                # Next.js configuration
```

## 🎯 The 6 Training Scenarios

1. **Wrong Delivery** (Easy) - Customer received a brick instead of a laptop
2. **Billing Errors** (Medium) - Customer charged $500 instead of $50
3. **Technical Glitch** (Medium) - App keeps crashing during checkout
4. **Delayed Shipment** (Hard) - Wedding gift won't arrive on time
5. **Refund Rejected** (Hard) - Refund denied due to policy violation
6. **Support Run-around** (Extreme) - Customer transferred 5 times already

## 🔄 App Flow

### View A: Login
- Enter agent name to create session
- Data stored in localStorage

### View B: Dashboard
- View total score and completed scenarios
- Select from 6 scenario cards
- Each card shows difficulty badge

### View C: Active Simulation
- Voice call with AI agent (ElevenLabs)
- Live stress meter visualization
- Real-time transcript display
- Beautiful animated background

### View D: Feedback Report
- Performance score (0-100)
- Areas to improve
- Pro tips
- Stress timeline graph

## 🧪 Backend Analysis

The `/api/analyze` endpoint uses Google Gemini to:
- Evaluate empathy and active listening
- Assess problem-solving approach
- Score communication clarity
- Analyze de-escalation techniques
- Rate resolution effectiveness

Returns JSON with:
```typescript
{
  score: number;           // 0-100
  feedbackTitle: string;   // Brief summary
  mistakes: string[];      // Areas to improve
  tips: string[];          // Actionable advice
  stressGraph: number[];   // 10-point stress timeline
}
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **UI Components**: shadcn/ui (Radix UI)
- **Backend AI**: Google Gemini API
- **Voice SDK**: ElevenLabs React SDK
- **State Management**: React Context API
- **Storage**: localStorage

## 📝 Notes

- Replace placeholder Agent IDs in `.env.local` with your actual ElevenLabs agent IDs
- The app currently uses a mock `useConversation` hook - integrate with actual `@elevenlabs/react` SDK
- User sessions persist in browser localStorage
- All UI styles from the original React app are preserved

## 🚢 Deployment

Build for production:

```bash
npm run build
npm start
```

Deploy to Vercel (recommended):

```bash
vercel
```

## 📄 License

MIT
