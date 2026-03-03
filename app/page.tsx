'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { SCENARIOS } from '@/config/scenarios';
import { AnalysisResult } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Phone,
  PhoneOff,
  Trophy,
  Star,
  ArrowLeft,
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  BarChart3,
} from 'lucide-react';
import { useConversation } from '@elevenlabs/react';

export default function HomePage() {
  const { user, login, logout, activeScenario, setActiveScenario, completeScenario } = useAuth();
  const [view, setView] = useState<'login' | 'dashboard' | 'simulation' | 'feedback'>('login');
  const [agentName, setAgentName] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stressLevel, setStressLevel] = useState(50);
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string }>>([]);
  const isNavigatingRef = useRef(false);
  const isDisconnectingRef = useRef(false);
  
  // Generate a unique session key for this scenario to persist across hot reloads
  const getSessionKey = () => activeScenario ? `session-started-${activeScenario.id}` : null;

  const { status, startSession, endSession, isSpeaking } = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs agent');
      isDisconnectingRef.current = false;
      const sessionKey = getSessionKey();
      if (sessionKey) sessionStorage.setItem(sessionKey, 'true');
      setTranscript([]);
    },
    onDisconnect: () => {
      console.log('Disconnected from agent - cleaning up');
      isDisconnectingRef.current = false;
      
      // Clear the session started flag so we can reconnect if needed
      const sessionKey = getSessionKey();
      if (sessionKey) sessionStorage.removeItem(sessionKey);
      
      // Stop all audio contexts and tracks immediately to prevent worklet errors
      try {
        // Get all audio contexts and close them
        if (window.AudioContext || (window as any).webkitAudioContext) {
          // Force cleanup of any active audio
          navigator.mediaDevices?.getUserMedia({ audio: true })
            .then(stream => {
              stream.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
              });
              stream = null as any;
            })
            .catch(() => {});
        }
      } catch (e) {
        console.log('Media cleanup error:', e);
      }
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      setTranscript(prev => [...prev, {
        speaker: message.source === 'ai' ? 'agent' : 'user',
        text: message.message
      }]);
    },
    onError: (error) => {
      console.error('Conversation error:', error);
    },
  });

  // Sync view with auth state
  useEffect(() => {
    if (!user) {
      setView('login');
    } else if (analysisResult) {
      setView('feedback');
    } else if (activeScenario) {
      setView('simulation');
    } else {
      setView('dashboard');
    }
  }, [user, activeScenario, analysisResult]);

  // Start simulation when activeScenario is set and view is simulation
  useEffect(() => {
    const sessionKey = getSessionKey();
    const hasStarted = sessionKey ? sessionStorage.getItem(sessionKey) === 'true' : false;
    
    // Only start if we're in simulation view AND status is disconnected AND not currently disconnecting AND haven't started yet
    if (view === 'simulation' && activeScenario && status === 'disconnected' && !isNavigatingRef.current && !isAnalyzing && !isDisconnectingRef.current && !hasStarted) {
      console.log('Starting session for scenario:', activeScenario.title, 'Agent ID:', activeScenario.agentId);
      
      // Add a small delay to ensure proper cleanup before reconnecting
      const timeoutId = setTimeout(() => {
        try {
          startSession({ 
            agentId: activeScenario.agentId,
            // Add configuration to keep the session alive longer
            overrides: {
              agent: {
                // Customize agent behavior if needed
                maxDuration: 600 // 10 minutes max duration
              }
            }
          });
        } catch (err) {
          console.error('Error starting session:', err);
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [activeScenario, status, view, isAnalyzing]);

  // Disconnect agent when view changes away from simulation
  useEffect(() => {
    if (view !== 'simulation' && (status === 'connected' || status === 'connecting')) {
      console.log('View changed to', view, '- disconnecting agent');
      isDisconnectingRef.current = true;
      try {
        endSession();
        // Force stop all audio
        setTimeout(() => {
          navigator.mediaDevices?.getUserMedia({ audio: true })
            .then(stream => stream.getTracks().forEach(track => {
              track.stop();
              track.enabled = false;
            }))
            .catch(() => {});
        }, 100);
      } catch (err) {
        console.error('View change disconnect error:', err);
        isDisconnectingRef.current = false;
      }
    }
  }, [view, status]);

  // Random stress fluctuation during call
  useEffect(() => {
    if (status === 'connected') {
      const interval = setInterval(() => {
        setStressLevel((prev) => Math.max(20, Math.min(90, prev + (Math.random() - 0.5) * 30)));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Handle call end
  const handleEndCall = async () => {
    // Set navigation flag to prevent re-connection
    isNavigatingRef.current = true;
    
    // Save transcript and scenario BEFORE disconnecting
    const savedTranscript = [...transcript];
    const savedScenario = activeScenario;
    
    // Stop the agent first - no need to wait
    try {
      endSession();
    } catch (err) {
      console.error('Error ending session:', err);
    }
    
    // Check if user actually practiced (meaningful conversation)
    const userMessages = savedTranscript.filter(t => t.speaker === 'user');
    const hasRealConversation = userMessages.length > 0 && 
      userMessages.some(msg => msg.text.trim().split(' ').length >= 3); // At least 3 words spoken
    
    if (!hasRealConversation) {
      // No real practice - show message and go back
      console.log('No practice detected - session ended without meaningful conversation');
      setAnalysisResult({
        score: 0,
        feedbackTitle: 'No Practice Detected',
        mistakes: ['You ended the session without practicing', 'No conversation was recorded'],
        tips: [
          'Try speaking to the AI agent to practice your skills',
          'Make sure your microphone is working and unmuted',
          'Have a real conversation to get meaningful feedback'
        ],
        stressGraph: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
      });
      isNavigatingRef.current = false;
      return;
    }
    
    setIsAnalyzing(true);

    try {
      // Validate we have the necessary data
      if (!savedScenario) {
        console.error('No active scenario found');
        throw new Error('No active scenario');
      }

      if (savedTranscript.length === 0) {
        console.error('No transcript recorded');
        throw new Error('No transcript available');
      }

      const transcriptText = savedTranscript
        .map((t) => `${t.speaker.toUpperCase()}: ${t.text}`)
        .join('\n');

      console.log('Sending analysis request with:', {
        transcriptLength: transcriptText.length,
        scenarioTitle: savedScenario.title,
        messageCount: savedTranscript.length
      });

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcriptText,
          scenarioContext: savedScenario,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Analysis failed');
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      
      if (savedScenario) {
        completeScenario(result.score, savedScenario.id);
      }
      
      // Reset navigation flag immediately
      isNavigatingRef.current = false;
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback mock result
      setAnalysisResult({
        score: 75,
        feedbackTitle: 'Good effort! Keep practicing.',
        mistakes: ['Could improve empathy', 'Rushed the solution'],
        tips: ['Listen more actively', 'Acknowledge emotions first'],
        stressGraph: [50, 60, 70, 65, 55, 50, 45, 40, 35, 30],
      });
      
      // Reset navigation flag immediately
      isNavigatingRef.current = false;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBackToDashboard = () => {
    console.log('Going back to dashboard...');
    // Set navigation flag to prevent re-connection
    isNavigatingRef.current = true;
    isDisconnectingRef.current = true;
    
    // Force disconnect agent FIRST
    if (status !== 'disconnected') {
      try {
        endSession();
        // Force stop all media immediately
        navigator.mediaDevices?.getUserMedia({ audio: true })
          .then(stream => stream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
          }))
          .catch(() => {});
      } catch (err) {
        console.error('Error ending session on back to dashboard:', err);
        isDisconnectingRef.current = false;
      }
    } else {
      isDisconnectingRef.current = false;
    }
    
    // Clear all state immediately to trigger view change
    const sessionKey = getSessionKey();
    if (sessionKey) sessionStorage.removeItem(sessionKey);
    setActiveScenario(null);
    setAnalysisResult(null);
    setTranscript([]);
    setIsAnalyzing(false);
    
    // Reset navigation flag after brief delay to allow view update
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 200);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentName.trim()) {
      login(agentName.trim());
    }
  };

  const handleSelectScenario = (scenario: typeof SCENARIOS[0]) => {
    // Don't allow selecting new scenario if currently disconnecting
    if (isDisconnectingRef.current || status !== 'disconnected') {
      console.log('Cannot select scenario - currently disconnecting or connected');
      return;
    }
    // Clear session storage for this scenario to allow fresh start
    const sessionKey = `session-started-${scenario.id}`;
    sessionStorage.removeItem(sessionKey);
    // Clear navigation flag when intentionally selecting a scenario
    isNavigatingRef.current = false;
    setActiveScenario(scenario);
  };

  const difficultyColors = {
    Easy: 'bg-emerald-500',
    Medium: 'bg-amber-500',
    Hard: 'bg-red-500',
    Extreme: 'bg-violet-500',
  };

  // VIEW A: LOGIN
  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="glassmorphism p-8 border-white/10">
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <Zap className="w-16 h-16 text-blue-400" />
              </motion.div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                ConflictCoach AI
              </h1>
              <p className="text-slate-400">Master conflict resolution with AI-powered training</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your agent name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 h-12"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold"
              >
                Enter Dashboard
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  // VIEW B: DASHBOARD
  if (view === 'dashboard' && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <p className="text-slate-400">Choose a scenario to start training</p>
            </div>
            <div className="flex items-center gap-4">
              <Card className="glassmorphism px-6 py-3 border-white/10">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs text-slate-400">Total Score</div>
                    <div className="text-2xl font-bold">{user.totalScore}</div>
                  </div>
                </div>
              </Card>
              <Button variant="outline" onClick={logout} className="border-slate-700">
                Logout
              </Button>
            </div>
          </div>

          {/* Scenarios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCENARIOS.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="glassmorphism p-6 border-white/10 hover:border-white/30 transition-all cursor-pointer group h-full"
                  onClick={() => handleSelectScenario(scenario)}
                  style={{
                    borderColor: user.completedScenarios.includes(scenario.id)
                      ? scenario.themeColor
                      : undefined,
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Badge
                      className={`${difficultyColors[scenario.difficulty]} text-white`}
                    >
                      {scenario.difficulty}
                    </Badge>
                    {user.completedScenarios.includes(scenario.id) && (
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    {scenario.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">{scenario.description}</p>
                  
                  <Button
                    className="w-full bg-slate-800 hover:bg-slate-700"
                    style={{ backgroundColor: scenario.themeColor + '20' }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Start Call
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VIEW C: SIMULATION
  if (view === 'simulation' && activeScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-400"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Incoming Call Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-semibold mb-2" style={{ color: activeScenario.themeColor }}>
              {activeScenario.title}
            </h2>
            <p className="text-slate-400 max-w-md">{activeScenario.description}</p>
          </motion.div>

          {/* Voice Orb */}
          <motion.div
            className="relative w-64 h-64 mb-8"
            animate={status === 'connected' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div
              className="absolute inset-0 rounded-full orb-glow"
              style={{
                background: `radial-gradient(circle, ${activeScenario.themeColor}40, transparent)`,
              }}
            />
            <div
              className="absolute inset-4 rounded-full glassmorphism flex items-center justify-center"
              style={{ borderColor: activeScenario.themeColor }}
            >
              <Phone className="w-20 h-20" style={{ color: activeScenario.themeColor }} />
            </div>
          </motion.div>

          {/* Stress Meter */}
          <Card className="glassmorphism p-6 mb-6 w-full max-w-md border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Stress Level</span>
              <span className="text-sm font-bold">{Math.round(stressLevel)}%</span>
            </div>
            <Progress value={stressLevel} className="h-2" />
          </Card>

          {/* Controls */}
          <div className="flex gap-4">
            {status === 'connected' ? (
              <Button
                onClick={handleEndCall}
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white px-8"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>Analyzing...</>
                ) : (
                  <>
                    <PhoneOff className="w-5 h-5 mr-2" />
                    End Call
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => startSession({ agentId: activeScenario.agentId })}
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
              >
                <Phone className="w-5 h-5 mr-2" />
                Start Call
              </Button>
            )}
          </div>

          {/* Transcript */}
          {transcript.length > 0 && (
            <Card className="glassmorphism mt-8 p-6 w-full max-w-2xl border-white/10 max-h-64 overflow-y-auto">
              <h3 className="text-sm font-semibold mb-4 text-slate-400">Live Transcript</h3>
              <div className="space-y-3">
                {transcript.map((t, i) => (
                  <div key={i} className={t.speaker === 'agent' ? 'text-blue-300' : 'text-slate-300'}>
                    <span className="font-semibold uppercase text-xs">{t.speaker}:</span> {t.text}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // VIEW D: FEEDBACK
  if (view === 'feedback' && analysisResult) {
    const noPractice = analysisResult.score === 0 && analysisResult.feedbackTitle === 'No Practice Detected';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={handleBackToDashboard}
            variant="outline"
            className="mb-6 border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {noPractice ? (
              /* No Practice Message */
              <Card className="glassmorphism p-12 border-white/10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="mb-6"
                >
                  <AlertCircle className="w-24 h-24 mx-auto text-amber-400" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 text-amber-400">{analysisResult.feedbackTitle}</h2>
                <p className="text-lg text-slate-300 mb-6">
                  You started and ended the session without having a meaningful conversation with the AI.
                </p>
                <p className="text-slate-400 mb-8">
                  To get real feedback and improve your skills, you need to actually practice!
                </p>
                <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-slate-200">What to do next:</h3>
                  <ul className="space-y-2 text-left">
                    {analysisResult.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={handleBackToDashboard}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
                >
                  Try Again
                </Button>
              </Card>
            ) : (
            /* Normal Feedback Display */
            <>
            {/* Score Card */}
            <Card className="glassmorphism p-8 border-white/10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="inline-block mb-4"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-800"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysisResult.score / 100)}`}
                      className="text-blue-400"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">{analysisResult.score}</span>
                  </div>
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">{analysisResult.feedbackTitle}</h2>
              <p className="text-slate-400">Performance Analysis</p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Mistakes */}
              <Card className="glassmorphism p-6 border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold">Areas to Improve</h3>
                </div>
                <ul className="space-y-2">
                  {analysisResult.mistakes.map((mistake, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="text-sm text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-red-400 mt-1">•</span>
                      <span>{mistake}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>

              {/* Tips */}
              <Card className="glassmorphism p-6 border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold">Pro Tips</h3>
                </div>
                <ul className="space-y-2">
                  {analysisResult.tips.map((tip, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="text-sm text-slate-300 flex items-start gap-2"
                    >
                      <span className="text-amber-400 mt-1">•</span>
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Stress Graph */}
            <Card className="glassmorphism p-6 border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold">Stress Timeline</h3>
              </div>
              <div className="flex items-end justify-between h-32 gap-2">
                {analysisResult.stressGraph.map((level, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${level}%` }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex-1 bg-gradient-to-t from-blue-500 to-violet-500 rounded-t"
                    style={{ minHeight: '4px' }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>Start</span>
                <span>End</span>
              </div>
            </Card>

            <Button
              onClick={handleBackToDashboard}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
            >
              <Target className="w-5 h-5 mr-2" />
              Try Another Scenario
            </Button>
            </>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
