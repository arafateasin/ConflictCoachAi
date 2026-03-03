# ElevenLabs SDK Integration Guide

This guide explains how to replace the mock `useConversation` hook with the actual ElevenLabs React SDK.

## 1. Install Dependencies

Already included in package.json:
```bash
npm install @elevenlabs/react
```

## 2. Set Up ConversationConfig

In `app/page.tsx`, replace the mock `useConversation` import:

```typescript
// Remove this mock:
// function useConversation() { ... }

// Add this import:
import { useConversation } from '@elevenlabs/react';
```

## 3. Configure the Hook

Update the hook usage in the component:

```typescript
const conversation = useConversation({
  onConnect: () => {
    console.log('Connected to agent');
  },
  onDisconnect: () => {
    console.log('Disconnected from agent');
  },
  onMessage: (message) => {
    console.log('Message received:', message);
  },
  onError: (error) => {
    console.error('Conversation error:', error);
  },
});

// Access properties
const { status, startSession, endSession, isSpeaking } = conversation;
```

## 4. Start Session with Agent ID

When activeScenario is set, start with the correct agent:

```typescript
useEffect(() => {
  if (activeScenario && status === 'idle') {
    startSession({
      agentId: activeScenario.agentId,
      // Optional configuration:
      clientTools: {},
      overrides: {},
    });
  }
}, [activeScenario, status]);
```

## 5. Access Transcript

The ElevenLabs SDK provides transcript access. Update transcript handling:

```typescript
// Get transcript from conversation object
const transcriptItems = conversation.transcript || [];

// Map to our format
const transcript = transcriptItems.map(item => ({
  speaker: item.role === 'agent' ? 'agent' : 'user',
  text: item.message,
  timestamp: item.timestamp,
}));
```

## 6. Handle End Call

Update the `handleEndCall` function:

```typescript
const handleEndCall = async () => {
  // End the session
  await endSession();
  
  setIsAnalyzing(true);

  // Get full transcript
  const transcriptText = transcript
    .map((t) => `${t.speaker.toUpperCase()}: ${t.text}`)
    .join('\n');

  // Send to analysis API...
  // (rest of the code remains the same)
};
```

## 7. Environment Variables

Ensure you have set up your .env.local:

```env
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
NEXT_PUBLIC_AGENT_ID_1=your_agent_id_1
# ... etc for all 6 agents
```

## 8. Optional: Audio Visualization

You can add audio visualization using the SDK's built-in features:

```typescript
import { useConversation } from '@elevenlabs/react';

// In your component
const { isSpeaking, volume } = conversation;

// Use isSpeaking to animate the voice orb
<motion.div
  animate={isSpeaking ? { scale: [1, 1.2, 1] } : { scale: 1 }}
  transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
>
  {/* Voice orb UI */}
</motion.div>
```

## 9. Error Handling

Add proper error handling:

```typescript
const conversation = useConversation({
  onError: (error) => {
    console.error('Conversation error:', error);
    toast({
      title: 'Connection Error',
      description: 'Failed to connect to voice agent. Please try again.',
      variant: 'destructive',
    });
  },
});
```

## 10. TypeScript Types

If needed, import types from the SDK:

```typescript
import type { 
  ConversationConfig, 
  ConversationStatus,
  TranscriptItem 
} from '@elevenlabs/react';
```

## Testing

1. Make sure your ElevenLabs agents are configured in the dashboard
2. Set the correct agent IDs in your .env.local
3. Test each scenario individually
4. Verify transcript capture works correctly
5. Ensure analysis receives proper transcript data

## Troubleshooting

- **No audio**: Check microphone permissions in browser
- **Connection fails**: Verify API key and agent IDs
- **Transcript empty**: Ensure onMessage handler is capturing data
- **Agent not responding**: Check ElevenLabs dashboard for agent status

## Resources

- [ElevenLabs React SDK Docs](https://elevenlabs.io/docs/api-reference/react-sdk)
- [ElevenLabs Dashboard](https://elevenlabs.io/app)
- [Conversation API Reference](https://elevenlabs.io/docs/api-reference/conversational-ai)
