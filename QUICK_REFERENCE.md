# 🚀 Quick Reference Card

## Essential Commands

```bash
# Install
npm install

# Development
npm run dev              # Start dev server (localhost:3000)

# Production
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
```

## File Locations

| What | Where |
|------|-------|
| Main Page | `app/page.tsx` |
| API Endpoint | `app/api/analyze/route.ts` |
| Scenarios | `config/scenarios.ts` |
| Auth Logic | `context/AuthContext.tsx` |
| Types | `types/index.ts` |
| Utils | `lib/conversation-utils.ts` |
| Env Vars | `.env.local` |

## Environment Variables

```env
GOOGLE_GEMINI_API_KEY=...
NEXT_PUBLIC_AGENT_ID_1=...
NEXT_PUBLIC_AGENT_ID_2=...
# ... (6 agent IDs total)
```

## Key Imports

```typescript
// Auth
import { useAuth } from '@/context/AuthContext';

// Scenarios
import { SCENARIOS } from '@/config/scenarios';

// Types
import { User, Scenario, AnalysisResult } from '@/types';

// Utils
import { formatTranscriptForAnalysis } from '@/lib/conversation-utils';

// ElevenLabs (when integrated)
import { useConversation } from '@elevenlabs/react';
```

## Auth Context API

```typescript
const {
  user,                    // Current user or null
  login,                   // (name: string) => void
  logout,                  // () => void
  completeScenario,        // (score, scenarioId) => void
  activeScenario,          // Current scenario or null
  setActiveScenario,       // (scenario) => void
} = useAuth();
```

## API Endpoint Usage

```typescript
// POST /api/analyze
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transcript: 'AGENT: ... CUSTOMER: ...',
    scenarioContext: scenario,
  }),
});

const result: AnalysisResult = await response.json();
```

## Component Structure

```typescript
// app/page.tsx structure
export default function HomePage() {
  const { user, activeScenario } = useAuth();
  const [view, setView] = useState('login');
  
  // Auto-sync view with state
  useEffect(() => {
    if (!user) setView('login');
    else if (analysisResult) setView('feedback');
    else if (activeScenario) setView('simulation');
    else setView('dashboard');
  }, [user, activeScenario, analysisResult]);
  
  // Render based on view
  if (view === 'login') return <LoginView />;
  if (view === 'dashboard') return <DashboardView />;
  if (view === 'simulation') return <SimulationView />;
  if (view === 'feedback') return <FeedbackView />;
}
```

## Common Tasks

### Add a New Scenario

1. Edit `config/scenarios.ts`
2. Add new scenario object
3. Create ElevenLabs agent
4. Add agent ID to `.env.local`

### Customize Analysis Prompt

Edit `app/api/analyze/route.ts`:
```typescript
const prompt = `Your custom prompt here...`;
```

### Change Theme Colors

Edit `app/globals.css`:
```css
:root {
  --background: 222.2 84% 4.9%;
  --primary: 217.2 91.2% 59.8%;
  /* ... */
}
```

### Add New View

1. Add state: `const [view, setView] = useState()`
2. Add condition in useEffect
3. Add render condition
4. Create component JSX

## Debugging Tips

```typescript
// Check user state
console.log('User:', user);

// Check active scenario
console.log('Scenario:', activeScenario);

// Check transcript
console.log('Transcript:', transcript);

// Test API locally
fetch('/api/analyze', { /* ... */ })
  .then(r => r.json())
  .then(console.log);
```

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "use client" missing | Add `'use client';` at top of file |
| localStorage undefined | Wrap in `useEffect` or check `typeof window` |
| API key not found | Check `.env.local` and restart server |
| Gemini returns text | Extract JSON from markdown (already handled) |
| Import path error | Use `@/` alias, not relative paths |

## Styling Quick Reference

```tsx
// Glassmorphism card
<Card className="glassmorphism p-6 border-white/10">

// Gradient button
<Button className="bg-gradient-to-r from-blue-500 to-violet-500">

// Difficulty badge colors
Easy: 'bg-emerald-500'
Medium: 'bg-amber-500'
Hard: 'bg-red-500'
Extreme: 'bg-violet-500'

// Animated component
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
```

## Data Flow Diagram

```
User Input
    ↓
AuthContext (login/logout/setActiveScenario)
    ↓
localStorage (persist user data)
    ↓
View Logic (4 conditional renders)
    ↓
ElevenLabs SDK (voice I/O)
    ↓
Transcript Collection
    ↓
API Call (/api/analyze)
    ↓
Google Gemini (AI analysis)
    ↓
AnalysisResult (display feedback)
    ↓
completeScenario (update user stats)
    ↓
Back to Dashboard
```

## Testing Checklist

- [ ] Login creates user in localStorage
- [ ] Dashboard shows 6 scenarios
- [ ] Clicking scenario starts simulation
- [ ] Voice orb animates
- [ ] End call triggers analysis
- [ ] Feedback displays correctly
- [ ] Score updates in dashboard
- [ ] Logout clears session
- [ ] Refresh preserves session

## Performance Tips

- Keep components client-side only when needed
- Use `React.memo` for expensive components
- Lazy load heavy dependencies
- Optimize images with Next.js Image
- Use dynamic imports for large components

## Security Notes

- ✅ API keys in .env.local (not committed)
- ✅ Server-side API key (GOOGLE_GEMINI_API_KEY)
- ✅ Public keys prefixed NEXT_PUBLIC_
- ⚠️  localStorage is not encrypted
- ⚠️  No CSRF protection (add if needed)

## Deployment Checklist

- [ ] Set environment variables in hosting platform
- [ ] Test production build locally
- [ ] Verify API routes work in production
- [ ] Check all 6 agent IDs are valid
- [ ] Test on mobile devices
- [ ] Monitor API usage limits
- [ ] Set up error tracking (Sentry)
- [ ] Configure custom domain

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [ElevenLabs API](https://elevenlabs.io/docs)
- [Google AI Studio](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Pro Tip**: Bookmark this file for quick reference during development! 🔖
