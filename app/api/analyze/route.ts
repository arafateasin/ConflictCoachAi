import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { transcript, scenarioContext } = await request.json();

    if (!transcript || !scenarioContext) {
      return NextResponse.json(
        { error: 'Missing transcript or scenarioContext' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GOOGLE_GEMINI_API_KEY not configured, using fallback analysis');
      return NextResponse.json(generateFallbackAnalysis(transcript, scenarioContext));
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Use Gemini 2.5 Flash - newest, fastest, most accurate
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192, // Increased for complete responses
          responseMimeType: "application/json", // Force JSON output
        }
      });

    const prompt = `You are an EXPERT Conflict Resolution Coach with 20+ years experience. You MUST be BRUTALLY HONEST and NEVER give false praise. Analyze this customer service call with ZERO tolerance for bad behavior.

**Scenario:** ${scenarioContext.title}
**Problem:** ${scenarioContext.description}
**Difficulty:** ${scenarioContext.difficulty}

**ACTUAL CONVERSATION:**
${transcript}

**CRITICAL: DETECT BAD BEHAVIOR IMMEDIATELY**
Before anything else, scan for these INSTANT FAILURES:

🚨 **AGGRESSIVE/SHOUTING BEHAVIOR** - If the USER (agent) uses:
   - ALL CAPS or EXCESSIVE CAPS
   - Multiple exclamation marks (!!!)
   - Aggressive language: "SHUT UP", "DEAL WITH IT", "I DON'T CARE"
   - Yelling, threatening, or hostile tone
   → AUTOMATIC SCORE: 0-20 (Complete failure - would be fired)

🚨 **UNPROFESSIONAL/RUDE** - If the USER shows:
   - Sarcasm, mockery, or condescension
   - Dismissive responses: "whatever", "not my problem", "that's too bad"
   - Blaming the customer
   - Making excuses or defensive behavior
   → SCORE: 10-35 (Unacceptable performance)

🚨 **MINIMAL EFFORT** - If the USER:
   - Gives 1-2 word responses only
   - Shows no empathy at all
   - Offers no real solution
   - Barely participates
   → SCORE: 20-45 (Inadequate)

**DETAILED ANALYSIS (if not instant failure):**

1. **Empathy & Listening** (Critical):
   - Did they say "I understand", "I'm sorry", "That's frustrating"?
   - Did they acknowledge feelings BEFORE offering solutions?
   - Did they listen or just talk?

2. **Professionalism** (Non-negotiable):
   - Calm, respectful tone throughout?
   - No ALL CAPS, no excessive punctuation?
   - No rude, sarcastic, or aggressive language?

3. **Problem-Solving**:
   - SPECIFIC solutions with details? ("I'll refund $50 now")
   - Or vague promises? ("I'll try", "maybe")
   - Clear action plan or just empty words?

4. **De-escalation**:
   - Did customer calm down OR get more upset?
   - Did agent stay calm when customer was angry?
   - Avoided making it worse?

**STRICT SCORING RULES - NO EXCEPTIONS:**

- **0-20**: FIRED - Shouting, aggressive, hostile, completely unprofessional
- **21-35**: TERRIBLE - Rude, dismissive, sarcastic, would fail any call center
- **36-50**: POOR - Unprofessional, weak effort, no real help, major problems
- **51-60**: BELOW AVERAGE - Got through it barely, multiple mistakes
- **61-70**: AVERAGE - Adequate but unremarkable, room for improvement
- **71-80**: GOOD - Solid performance, some good moments, minor issues
- **81-90**: VERY GOOD - Strong empathy, clear solutions, professional
- **91-100**: EXCELLENT - Perfect de-escalation, genuine care, expert-level

**ABSOLUTE REQUIREMENTS FOR HIGH SCORES (80+):**
✓ NO aggressive language, NO all caps, NO shouting
✓ Clear empathy shown in multiple responses
✓ Specific, actionable solution offered
✓ Professional and calm throughout
✓ Customer's problem actually resolved

**YOU MUST:**
- Quote EXACT phrases they said that were wrong
- Be HARSH if they were rude/aggressive - don't sugarcoat it
- Give LOW scores (0-35) for ANY unprofessional behavior
- NEVER give high scores to someone who shouted or was aggressive
- Return COMPLETE, VALID JSON with ALL fields filled

**CRITICAL: Return ONLY valid JSON with NO markdown, NO code blocks, NO extra text:**
{
  "score": <number between 0-100>,
  "feedbackTitle": "<one clear sentence>",
  "mistakes": ["<mistake 1>", "<mistake 2>", "<mistake 3>"],
  "tips": ["<tip 1>", "<tip 2>", "<tip 3>"],
  "stressGraph": [<exactly 10 numbers between 20-90>]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('=== GEMINI RAW RESPONSE ===');
    console.log(text);
    console.log('=== END GEMINI RESPONSE ===');

    // Extract JSON from response (handle markdown code blocks and extra text)
    let jsonText = text.trim();
    
    // Remove markdown code blocks
    jsonText = jsonText.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
    
    // Remove any trailing text after the closing brace
    const lastBrace = jsonText.lastIndexOf('}');
    if (lastBrace !== -1) {
      jsonText = jsonText.substring(0, lastBrace + 1);
    }
    
    // Extract JSON object if there's surrounding text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    let analysis: AnalysisResult;
    try {
      analysis = JSON.parse(jsonText);
      console.log('=== PARSED ANALYSIS ===');
      console.log('Score:', analysis.score);
      console.log('Title:', analysis.feedbackTitle);
      console.log('Mistakes:', analysis.mistakes?.length);
      console.log('Tips:', analysis.tips?.length);
      console.log('======================');
      
      // Trim arrays to exactly 3 items if they're longer
      if (analysis.mistakes && analysis.mistakes.length > 3) {
        analysis.mistakes = analysis.mistakes.slice(0, 3);
      }
      if (analysis.tips && analysis.tips.length > 3) {
        analysis.tips = analysis.tips.slice(0, 3);
      }
      
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Received text:', text ||
      analysis.mistakes.length === 0 ||
      analysis.tips.length === 0 ||
      analysis.stressGraph.length === 0);
      throw new Error('Failed to parse Gemini response as JSON');
    }

    // Validate the response structure
    if (
      typeof analysis.score !== 'number' ||
      !analysis.feedbackTitle ||
      !Array.isArray(analysis.mistakes) ||
      !Array.isArray(analysis.tips) ||
      !Array.isArray(analysis.stressGraph)
    ) {
      console.error('Invalid structure:', analysis);
      throw new Error('Invalid response structure from Gemini');
    }

    return NextResponse.json(analysis);
    } catch (geminiError) {
      // If Gemini API fails, use fallback analysis
      console.warn('Gemini API failed, using fallback analysis:', geminiError);
      return NextResponse.json(generateFallbackAnalysis(transcript, scenarioContext));
    }
  } catch (error) {
    console.error('Analysis error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      {
        error: 'Failed to analyze conversation',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Fallback analysis generator
function generateFallbackAnalysis(transcript: string, scenarioContext: any): AnalysisResult {
  const lines = transcript.split('\n').filter(line => line.trim());
  const userLines = lines.filter(line => line.startsWith('USER:') || line.startsWith('AGENT:'));
  const agentLines = lines.filter(line => line.startsWith('AGENT:'));
  
  const transcriptLower = transcript.toLowerCase();
  
  // Check if this is a real conversation
  const userWordCount = userLines.reduce((sum, line) => {
    const words = line.replace(/^(USER:|AGENT:)/i, '').trim().split(/\s+/);
    return sum + words.length;
  }, 0);
  
  // If very short or no real content, low score
  if (userLines.length < 2 || userWordCount < 10) {
    return {
      score: 25,
      feedbackTitle: 'Very brief interaction - needs more practice',
      mistakes: [
        'Conversation was too short to evaluate properly',
        'Did not engage enough with the customer',
        'Need to have a more substantial dialogue'
      ],
      tips: [
        'Have a longer conversation - ask questions, show empathy, offer solutions',
        'Make sure your microphone is working and you\'re speaking clearly',
        'Practice the full de-escalation process: acknowledge, empathize, solve'
      ],
      stressGraph: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60]
    };
  }
  
  // 🚨 CRITICAL: Check for aggressive/shouting behavior FIRST
  const userResponses = userLines.map(line => line.replace(/^(USER:|AGENT:)/i, '').trim()).join(' ');
  
  // Detect ALL CAPS (shouting) - if more than 30% of letters are caps in multi-word responses
  const letters = userResponses.replace(/[^a-zA-Z]/g, '');
  const capsLetters = userResponses.replace(/[^A-Z]/g, '');
  const capsPercentage = letters.length > 0 ? (capsLetters.length / letters.length) * 100 : 0;
  
  // Detect aggressive patterns
  const hasExcessiveCaps = capsPercentage > 30;
  const hasMultipleExclamations = /!{2,}/.test(transcript);
  const hasAggressiveLanguage = /shut up|don't care|deal with it|not my problem|screw you|go away|leave me alone|I DON'T|YOU'RE WRONG|STOP|LISTEN TO ME/i.test(transcript);
  const isYelling = /[A-Z]{4,}/.test(userResponses); // 4+ consecutive caps
  
  // INSTANT LOW SCORE for aggression/shouting
  if (hasExcessiveCaps || hasAggressiveLanguage || isYelling || hasMultipleExclamations) {
    const aggressionLevel = 
      (hasExcessiveCaps ? 1 : 0) + 
      (hasAggressiveLanguage ? 1 : 0) + 
      (isYelling ? 1 : 0) + 
      (hasMultipleExclamations ? 1 : 0);
    
    const score = Math.max(5, 25 - (aggressionLevel * 8)); // Max score 25, can go down to 5
    
    return {
      score,
      feedbackTitle: 'Completely unacceptable - aggressive and unprofessional',
      mistakes: [
        hasExcessiveCaps || isYelling ? 'You SHOUTED at the customer (using all caps/raised voice) - this is never acceptable' : 'You used aggressive language toward the customer',
        hasAggressiveLanguage ? 'You used hostile and dismissive language that made the situation worse' : 'Your tone was confrontational instead of helpful',
        'You failed to maintain basic professional standards in customer service'
      ],
      tips: [
        'NEVER shout, yell, or use aggressive language with customers - you would be fired immediately',
        'Stay calm and professional even when frustrated - take a breath before responding',
        'Remember: your job is to HELP customers, not fight with them'
      ],
      stressGraph: [60, 70, 75, 80, 85, 88, 90, 90, 90, 90] // Stress increases with aggression
    };
  }
  
  // Analyze conversation content for honest scoring
  let score = 50; // Start neutral
  const mistakes: string[] = [];
  const tips: string[] = [];
  
  // Check for positive indicators
  const hasEmpathy = /sorry|apologize|understand|frustrat|unfortunate|hear you|feel|empathize/i.test(transcript);
  const hasQuestions = userLines.some(line => line.includes('?'));
  const hasSpecificSolution = /will|can|let me|I'll|we can|option|solution|refund|replace|send|process|issue|fix/i.test(transcript);
  const isProfessional = !/what|huh|idk|dunno|whatever/i.test(transcriptLower);
  const hasTakeOwnership = /I will|I'll|let me|I can|I'm going to/i.test(transcript);
  
  // Check for STRONG negative indicators
  const isRude = /shut up|whatever|don't care|not my problem|deal with it|too bad|not happening/i.test(transcriptLower);
  const isSarcastic = /yeah right|sure thing|oh really|good luck with that|congratulations/i.test(transcriptLower);
  const tooShort = userLines.every(line => line.length < 50);
  const noSolution = userLines.length > 2 && !hasSpecificSolution;
  const defensive = /not my fault|can't help|policy says|nothing I can do|impossible|that's just how it is/i.test(transcriptLower);
  const blamingCustomer = /you should have|your fault|you didn't|why didn't you/i.test(transcriptLower);
  
  // SEVERE penalties for bad behavior
  if (isRude) {
    score = Math.min(score, 30); // Cap at 30 max
    score -= 25;
    mistakes.push(`You used rude or dismissive language toward the customer - this is unacceptable`);
    tips.push(`NEVER use dismissive phrases. Stay professional even when frustrated`);
  }
  
  if (isSarcastic) {
    score -= 20;
    mistakes.push(`Your sarcastic tone was inappropriate and made the customer feel mocked`);
    tips.push(`Avoid sarcasm completely in customer service - it damages trust`);
  }
  
  if (blamingCustomer) {
    score -= 15;
    mistakes.push(`You blamed the customer instead of focusing on solutions`);
    tips.push(`Never blame customers - focus on "how can we fix this" not "you should have..."`);
  }
  
  if (defensive) {
    score -= 12;
    mistakes.push(`You used defensive language or made excuses instead of helping`);
    tips.push(`Focus on what you CAN do, not policy limitations or excuses`);
  }
  
  // Calculate score based on actual content
  if (hasEmpathy) {
    score += 15;
  } else {
    if (mistakes.length < 3) {
      mistakes.push(`You didn't acknowledge the customer's frustration or show empathy in your responses`);
      tips.push(`Start with empathetic phrases like "I understand how frustrating this must be" or "I'm sorry you're experiencing this"`);
    }
  }
  
  if (hasQuestions) {
    score += 10;
  } else {
    if (mistakes.length < 3) {
      mistakes.push(`You didn't ask clarifying questions to better understand the customer's issue`);
      tips.push(`Ask specific questions like "Can you tell me more about what happened?" or "When did you first notice this?"`);
    }
  }
  
  if (hasSpecificSolution) {
    score += 15;
  } else {
    if (mistakes.length < 3) {
      mistakes.push(`You didn't offer a clear, specific solution or action plan to the customer`);
      tips.push(`Provide concrete next steps: "I'll process a full refund right now" or "I'm sending a replacement via overnight shipping"`);
    }
  }
  
  if (isProfessional) {
    score += 10;
  } else {
    if (mistakes.length < 3) {
      mistakes.push(`Your tone was unprofessional or too casual for a customer service interaction`);
      tips.push(`Maintain professional language even when the customer is upset - avoid slang and filler words`);
    }
  }
  
  if (hasTakeOwnership) {
    score += 5;
  } else {
    if (mistakes.length < 3) {
      mistakes.push(`You didn't take clear ownership of solving the customer's problem`);
      tips.push(`Use action-oriented language: "I will..." or "Let me..." to show you're taking charge of the solution`);
    }
  }
  
  // Additional penalties
  if (tooShort && mistakes.length < 3) {
    score -= 10;
    mistakes.push(`Your responses were too brief and didn't address the customer's concerns thoroughly`);
    tips.push(`Provide detailed, helpful responses that demonstrate you're taking the issue seriously`);
  }
  
  if (noSolution && mistakes.length < 3) {
    score -= 15;
    mistakes.push(`You engaged in conversation but never actually resolved the customer's problem`);
    tips.push(`Always end with a clear action plan: what you'll do, when, and how to follow up`);
  }
  
  // Engagement scoring based on conversation length
  if (userLines.length >= 5) score += 5;
  if (userLines.length >= 3) score += 5;
  if (userLines.length === 1) score -= 10;
  
  // Word count quality
  if (userWordCount > 100) score += 5;
  if (userWordCount < 30 && userLines.length > 1) score -= 5;
  
  // Ensure score doesn't go below minimum or above maximum
  score = Math.max(5, Math.min(100, score));
  
  // Fill in any missing feedback with relevant tips
  if (mistakes.length < 3) {
    const additionalMistakes = [
      'Could have been more proactive in anticipating customer needs',
      'Response timing could be improved to show urgency',
      'Missed opportunity to follow up and confirm satisfaction'
    ];
    while (mistakes.length < 3 && additionalMistakes.length > 0) {
      mistakes.push(additionalMistakes.shift()!);
    }
  }
  
  if (tips.length < 3) {
    const additionalTips = [
      'Practice the three-step approach: Acknowledge the problem, Apologize sincerely, Act with a solution',
      'Mirror the customer\'s language to show you\'re listening ("You mentioned X, let me help with that")',
      'Always end with clear next steps and confirm the customer understands the resolution'
    ];
    while (tips.length < 3 && additionalTips.length > 0) {
      tips.push(additionalTips.shift()!);
    }
  }
  
  // More honest feedback titles based on actual score
  const feedbackTitle = 
    score >= 90 ? 'Outstanding! Exceptional customer service' :
    score >= 80 ? 'Excellent work - professional and effective' :
    score >= 70 ? 'Good performance with minor improvements needed' :
    score >= 60 ? 'Adequate but needs development in key areas' :
    score >= 50 ? 'Below average - significant improvement required' :
    score >= 35 ? 'Poor performance - major issues to address' :
    score >= 20 ? 'Unacceptable - unprofessional behavior' :
    'Complete failure - would result in termination';

  // Stress graph should reflect performance quality
  const stressGraphPattern = score >= 70 
    ? [65, 60, 55, 50, 45, 42, 38, 35, 32, 30] // Good: stress decreases
    : score >= 50
    ? [60, 62, 58, 55, 52, 50, 48, 45, 43, 40] // Average: slight decrease
    : score >= 35
    ? [65, 68, 70, 68, 65, 63, 60, 58, 55, 53] // Poor: barely decreases
    : [60, 65, 72, 78, 82, 85, 87, 88, 90, 90]; // Terrible: stress increases

  return {
    score,
    feedbackTitle,
    mistakes: mistakes.slice(0, 3),
    tips: tips.slice(0, 3),
    stressGraph: stressGraphPattern
  };
}
