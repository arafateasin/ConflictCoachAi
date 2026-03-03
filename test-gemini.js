// Quick test script to verify Gemini is giving honest feedback
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyDQmRGmcvgMHuadNWTrgNEk-Rn9SL_pkf4';

async function testGemini() {
  console.log('🧪 Testing Gemini Feedback System...\n');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  });

  // Test Case 1: Shouting/Aggressive behavior
  const aggressiveTranscript = `AGENT: WHERE IS MY PACKAGE?!
USER: LISTEN, I DON'T CARE ABOUT YOUR EXCUSES! JUST GET IT DONE!
AGENT: This is unacceptable!
USER: STOP WASTING MY TIME!!!`;

  // Test Case 2: Professional behavior  
  const professionalTranscript = `AGENT: I'm very upset about my delayed order.
USER: I completely understand your frustration, and I sincerely apologize for this delay. Let me help you right away.
AGENT: This is the third time this happened!
USER: You're absolutely right to be concerned. I'm looking at your account now, and I can see the pattern. I'm going to process a full refund immediately and send a replacement with overnight shipping at no charge. I'll also add a $50 credit to your account as an apology. Is there anything else I can help you with today?`;

  const scenarios = [
    {
      title: 'Delayed Shipment',
      description: 'Customer angry about late delivery',
      difficulty: 'Medium',
      transcript: aggressiveTranscript,
      expected: 'LOW SCORE (0-30)'
    },
    {
      title: 'Delayed Shipment',
      description: 'Customer angry about late delivery',
      difficulty: 'Medium',
      transcript: professionalTranscript,
      expected: 'HIGH SCORE (80-95)'
    }
  ];

  for (let i = 0; i < scenarios.length; i++) {
    const test = scenarios[i];
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TEST ${i + 1}: ${test.expected}`);
    console.log('='.repeat(60));
    console.log('TRANSCRIPT:');
    console.log(test.transcript);
    console.log('\n' + '-'.repeat(60));

    const prompt = `You are an EXPERT Conflict Resolution Coach with 20+ years experience. You MUST be BRUTALLY HONEST and NEVER give false praise. Analyze this customer service call with ZERO tolerance for bad behavior.

**Scenario:** ${test.title}
**Problem:** ${test.description}
**Difficulty:** ${test.difficulty}

**ACTUAL CONVERSATION:**
${test.transcript}

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

Return ONLY valid JSON:
{
  "score": <0-100: BE STRICT! Aggression=0-20, Rude=10-35, Weak=20-50, Average=51-70, Good=71-85, Excellent=86-100>,
  "feedbackTitle": "<HONEST: 'Completely unacceptable - shouting at customer', 'Unprofessional and rude', 'Poor performance', 'Below average', 'Average', 'Good work', 'Excellent job'>",
  "mistakes": ["<EXACT quote of what they said wrong>", "<Another specific mistake with their words>", "<Third specific issue>"],
  "tips": ["<Specific fix for their mistake>", "<Another actionable tip>", "<Third concrete suggestion>"],
  "stressGraph": [<10 numbers: if agent was aggressive, stress should INCREASE (start 60, end 85+)>]
}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON
      let jsonText = text.trim()
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/g, '');
      
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
      
      const analysis = JSON.parse(jsonText);
      
      console.log('\n✅ GEMINI RESPONSE:');
      console.log(`   Score: ${analysis.score}/100`);
      console.log(`   Feedback: ${analysis.feedbackTitle}`);
      console.log(`   Mistakes:`);
      analysis.mistakes.forEach((m, idx) => console.log(`     ${idx + 1}. ${m}`));
      
      // Validate expectations
      if (test.expected.includes('LOW') && analysis.score <= 35) {
        console.log('\n✅ CORRECT: Low score for aggressive behavior');
      } else if (test.expected.includes('HIGH') && analysis.score >= 80) {
        console.log('\n✅ CORRECT: High score for professional behavior');
      } else {
        console.log(`\n❌ INCORRECT: Expected ${test.expected}, got ${analysis.score}`);
      }
      
    } catch (error) {
      console.error('❌ ERROR:', error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 Test Complete!');
  console.log('='.repeat(60) + '\n');
}

testGemini().catch(console.error);
