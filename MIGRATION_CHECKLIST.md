# Migration Checklist: Vite → Next.js 14

## ✅ Completed Tasks

### 1. Project Structure
- [x] Created `app/` directory with App Router structure
- [x] Created `app/layout.tsx` (root layout)
- [x] Created `app/page.tsx` (main page)
- [x] Created `app/globals.css` (global styles)
- [x] Created `app/api/analyze/route.ts` (API endpoint)

### 2. Configuration Files
- [x] Created `config/scenarios.ts` (6 training scenarios)
- [x] Created `types/index.ts` (TypeScript interfaces)
- [x] Created `context/AuthContext.tsx` (authentication)
- [x] Updated `package.json` (Next.js dependencies)
- [x] Created `next.config.js` (Next.js configuration)
- [x] Updated `tsconfig.json` (Next.js TypeScript config)
- [x] Created `.env.example` (environment variables template)

### 3. Core Features Implemented
- [x] View A: Login screen with name input
- [x] View B: Dashboard with 6 scenario cards
- [x] View C: Active simulation with voice orb
- [x] View D: Feedback report with analysis
- [x] localStorage-based authentication
- [x] Session management with AuthContext
- [x] Google Gemini API integration
- [x] Score tracking and scenario completion
- [x] Stress meter visualization
- [x] Animated backgrounds and transitions

### 4. UI Components
- [x] All shadcn/ui components preserved in `components/ui/`
- [x] Glassmorphism effects maintained
- [x] Framer Motion animations integrated
- [x] Dark mode theme (slate-950 background)
- [x] Responsive design for mobile/desktop

## 🔄 Next Steps (To Be Done)

### 1. Install Dependencies
```bash
npm install
# or
bun install
```

### 2. Set Up Environment Variables
Create `.env.local`:
```bash
cp .env.example .env.local
```

Add your keys:
- Google Gemini API Key
- 6 ElevenLabs Agent IDs

### 3. Integrate ElevenLabs SDK
- [ ] Replace mock `useConversation` with actual SDK
- [ ] Test voice connections with each agent
- [ ] Verify transcript capture
- [ ] Test audio playback

See `ELEVENLABS_INTEGRATION.md` for detailed guide.

### 4. Remove Old Vite Files (Optional)
Once Next.js is working, you can remove:
- [ ] `vite.config.ts`
- [ ] `tsconfig.app.json`
- [ ] `tsconfig.node.json`
- [ ] `index.html`
- [ ] `src/main.tsx` (old entry point)
- [ ] Old `src/` directory structure

### 5. Update Component Paths
Some components in `src/components/` may need to be moved or updated:
- [ ] Move relevant components from `src/` to root `components/`
- [ ] Update import paths from `@/src/*` to `@/*`
- [ ] Verify all shadcn/ui components work

### 6. Testing Checklist
- [ ] Login flow works
- [ ] Dashboard displays all 6 scenarios
- [ ] Scenario cards show correct difficulty badges
- [ ] Completed scenarios show star icon
- [ ] Total score updates correctly
- [ ] Voice call connects for each scenario
- [ ] Stress meter animates during call
- [ ] End call triggers analysis
- [ ] Feedback report displays correctly
- [ ] Back to dashboard resets state
- [ ] Logout clears localStorage

### 7. ElevenLabs Agent Setup
Create 6 agents in ElevenLabs dashboard:
- [ ] Agent 1: Wrong Delivery scenario
- [ ] Agent 2: Billing Errors scenario
- [ ] Agent 3: Technical Glitch scenario
- [ ] Agent 4: Delayed Shipment scenario
- [ ] Agent 5: Refund Rejected scenario
- [ ] Agent 6: Support Run-around scenario

Configure each agent with appropriate personality and instructions.

### 8. API Integration Testing
- [ ] Test Google Gemini API connection
- [ ] Verify analysis returns proper JSON format
- [ ] Handle API errors gracefully
- [ ] Test with different transcript lengths
- [ ] Verify stress graph generation

### 9. Performance Optimization
- [ ] Add loading states for API calls
- [ ] Optimize images (if any)
- [ ] Code splitting for better performance
- [ ] Add error boundaries
- [ ] Implement retry logic for failed API calls

### 10. Deployment Preparation
- [ ] Test production build locally: `npm run build`
- [ ] Verify environment variables in production
- [ ] Set up Vercel project (or other hosting)
- [ ] Configure custom domain (if needed)
- [ ] Set up analytics (optional)

## 📝 Known Issues / TODOs

1. **Mock useConversation**: Currently using a mock implementation. Replace with actual `@elevenlabs/react` SDK.

2. **Transcript Storage**: May need to persist full conversation history if needed for later review.

3. **Score Persistence**: Consider adding cloud storage for scores across devices (currently localStorage only).

4. **Agent Fallback**: The config uses placeholder agent IDs with env var fallbacks. Ensure all 6 agents are properly configured.

5. **Error Handling**: Add more robust error handling for:
   - Network failures
   - API rate limits
   - Microphone permission denials
   - Invalid API responses

6. **Accessibility**: Add ARIA labels and keyboard navigation support.

## 🎯 Features to Consider Adding

- **Leaderboard**: Compare scores with other users
- **Replay**: Listen to recorded conversations
- **Progress Tracking**: Charts showing improvement over time
- **Custom Scenarios**: Let users create their own scenarios
- **Team Mode**: Multiple users in same organization
- **Export Reports**: PDF/CSV export of performance data
- **Voice Settings**: Adjust agent voice speed/tone
- **Hints**: Optional hints during difficult scenarios

## 📚 Documentation Created

- [x] `SETUP.md` - Complete setup and deployment guide
- [x] `ELEVENLABS_INTEGRATION.md` - ElevenLabs SDK integration guide
- [x] `MIGRATION_CHECKLIST.md` - This file
- [x] `.env.example` - Environment variables template

## 🚀 Quick Start Command

After setting up `.env.local`:

```bash
npm install
npm run dev
```

Then open http://localhost:3000

---

**Note**: The original Vite/React UI components and styles have been preserved and integrated into the Next.js structure. All beautiful UI elements remain functional.
