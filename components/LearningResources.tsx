"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Lightbulb,
  MessageSquare,
  Heart,
  Shield,
  Sparkles,
  ExternalLink,
  Video,
  FileText,
  Headphones,
} from "lucide-react";

const TIPS_AND_TECHNIQUES = [
  {
    category: "Active Listening",
    icon: Headphones,
    color: "from-blue-400 to-blue-600",
    tips: [
      {
        title: "Give Full Attention",
        description:
          "Focus completely on what the customer is saying without planning your response.",
        example:
          "Instead of thinking ahead, listen to understand their complete concern first.",
      },
      {
        title: "Use Verbal Acknowledgments",
        description:
          'Let them know you\'re listening with phrases like "I see" or "I understand."',
        example: '"I hear what you\'re saying about the delayed delivery..."',
      },
      {
        title: "Paraphrase and Confirm",
        description: "Repeat back what you heard to ensure understanding.",
        example:
          '"So if I understand correctly, you ordered last week and it still hasn\'t arrived?"',
      },
    ],
  },
  {
    category: "Empathy & Emotional Intelligence",
    icon: Heart,
    color: "from-pink-400 to-rose-600",
    tips: [
      {
        title: "Acknowledge Their Feelings",
        description: "Validate emotions before jumping to solutions.",
        example:
          '"I completely understand how frustrating this situation must be for you."',
      },
      {
        title: "Use Empathy Statements",
        description: "Show you genuinely care about their experience.",
        example: '"I would feel the same way if I were in your situation."',
      },
      {
        title: "Apologize Sincerely",
        description: "A genuine apology can de-escalate tension immediately.",
        example:
          '"I\'m truly sorry for the inconvenience this has caused you."',
      },
    ],
  },
  {
    category: "De-escalation Tactics",
    icon: Shield,
    color: "from-purple-400 to-violet-600",
    tips: [
      {
        title: "Stay Calm and Patient",
        description: "Your calm demeanor can help lower their stress level.",
        example:
          "Take a deep breath and respond with a steady, reassuring tone.",
      },
      {
        title: "Never Take It Personally",
        description: "Remember they're upset about the situation, not you.",
        example: "Maintain professionalism even if they use harsh language.",
      },
      {
        title: "Lower Your Voice",
        description:
          "Speaking softly can encourage them to lower their voice too.",
        example: "Use a gentle, measured tone regardless of their volume.",
      },
      {
        title: "Give Them Control",
        description: "Offer choices to help them feel empowered.",
        example:
          '"Would you prefer a refund or a replacement? You decide what works best."',
      },
    ],
  },
  {
    category: "Problem Solving",
    icon: Lightbulb,
    color: "from-amber-400 to-yellow-600",
    tips: [
      {
        title: "Offer Specific Solutions",
        description: "Be clear and concrete about what you can do.",
        example:
          '"I can process a full refund within 3-5 business days" (not "I\'ll try to help")',
      },
      {
        title: "Set Clear Expectations",
        description: "Always be transparent about timelines and processes.",
        example:
          '"You\'ll receive an email confirmation within 1 hour, and the refund in 3-5 days."',
      },
      {
        title: "Go the Extra Mile",
        description: "Exceed expectations when possible.",
        example:
          '"I\'ve also added express shipping at no charge for your next order."',
      },
      {
        title: "Follow Up",
        description: "Check back to ensure the issue is fully resolved.",
        example:
          '"I\'ll personally follow up tomorrow to make sure everything is resolved."',
      },
    ],
  },
  {
    category: "Professional Communication",
    icon: MessageSquare,
    color: "from-green-400 to-emerald-600",
    tips: [
      {
        title: "Maintain Professional Language",
        description: "Stay courteous regardless of how they speak to you.",
        example:
          "Avoid slang, sarcasm, or casual language in professional contexts.",
      },
      {
        title: "Use Positive Language",
        description: "Frame responses constructively.",
        example:
          'Say "I can help you with that" instead of "I can\'t do that."',
      },
      {
        title: "Be Clear and Concise",
        description: "Avoid jargon and explain things simply.",
        example: "Use plain language that anyone can understand.",
      },
    ],
  },
];

const COMMON_SCENARIOS = [
  {
    situation: "Customer is shouting and angry",
    whatToDo: [
      "Let them vent initially - don't interrupt",
      "Lower your own voice to encourage them to do the same",
      'Acknowledge their frustration: "I can hear how upset you are"',
      "Focus on the solution, not the emotion",
    ],
    whatNotToDo: [
      "Don't match their energy or raise your voice",
      'Don\'t say "Calm down" - it usually makes things worse',
      "Don't be defensive or make excuses",
    ],
  },
  {
    situation: "Customer demands to speak to a manager",
    whatToDo: [
      "Acknowledge their request calmly",
      'Try to resolve first: "I understand. Let me see what I can do for you right now"',
      'If needed, escalate willingly: "I\'d be happy to connect you with my supervisor"',
    ],
    whatNotToDo: [
      "Don't take it as a personal insult",
      "Don't get defensive about your abilities",
      "Don't refuse or delay unnecessarily",
    ],
  },
  {
    situation: "You can't give them what they want",
    whatToDo: [
      "Explain why clearly and honestly",
      'Offer alternatives: "While I can\'t do X, I can offer Y"',
      'Show empathy: "I wish I could do more, but..."',
      "Escalate if there's any flexibility at a higher level",
    ],
    whatNotToDo: [
      "Don't give false hope or promises",
      "Don't blame company policy without explanation",
      "Don't leave them without options",
    ],
  },
];

const RECOMMENDED_RESOURCES = [
  {
    title: "FBI Hostage Negotiation Tactics",
    description: "Learn crisis de-escalation strategies from FBI experts",
    type: "video",
    icon: Video,
    url: "https://www.youtube.com/results?search_query=FBI+hostage+negotiation+tactics",
  },
  {
    title: "Never Split the Difference by Chris Voss",
    description: "Essential book on negotiation and conflict resolution",
    type: "book",
    icon: BookOpen,
    url: "https://www.goodreads.com/book/show/26156469-never-split-the-difference",
  },
  {
    title: "Crucial Conversations",
    description: "Master the art of difficult conversations",
    type: "book",
    icon: BookOpen,
    url: "https://www.goodreads.com/book/show/15014.Crucial_Conversations",
  },
  {
    title: "Customer Service Training Videos",
    description: "Professional training on handling difficult customers",
    type: "video",
    icon: Video,
    url: "https://www.youtube.com/results?search_query=customer+service+de-escalation",
  },
  {
    title: "Active Listening Skills",
    description: "Comprehensive guide to becoming a better listener",
    type: "article",
    icon: FileText,
    url: "https://www.mindtools.com/CommSkll/ActiveListening.htm",
  },
];

export function LearningResources() {
  const [selectedTab, setSelectedTab] = useState<
    "tips" | "scenarios" | "resources"
  >("tips");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Learning Resources</h2>
        </div>
        <p className="text-muted-foreground">
          Master conflict resolution with expert tips and proven techniques
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tips">
            <Sparkles className="w-4 h-4 mr-2" />
            Tips & Techniques
          </TabsTrigger>
          <TabsTrigger value="scenarios">
            <MessageSquare className="w-4 h-4 mr-2" />
            Common Scenarios
          </TabsTrigger>
          <TabsTrigger value="resources">
            <BookOpen className="w-4 h-4 mr-2" />
            External Resources
          </TabsTrigger>
        </TabsList>

        {/* Tips & Techniques */}
        <TabsContent value="tips" className="space-y-4 mt-6">
          {TIPS_AND_TECHNIQUES.map((category, catIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div
                    className={`p-4 bg-gradient-to-r ${category.color} text-white`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6" />
                      <h3 className="text-xl font-semibold">
                        {category.category}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {category.tips.map((tip, tipIndex) => (
                      <Card key={tipIndex} className="p-4 bg-accent/50">
                        <h4 className="font-semibold mb-2">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {tip.description}
                        </p>
                        <div className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
                          <p className="text-sm">
                            <span className="font-medium">Example:</span>{" "}
                            {tip.example}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        {/* Common Scenarios */}
        <TabsContent value="scenarios" className="space-y-4 mt-6">
          <Accordion type="single" collapsible className="space-y-4">
            {COMMON_SCENARIOS.map((scenario, index) => (
              <AccordionItem
                key={index}
                value={`scenario-${index}`}
                className="border rounded-lg"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-left">
                      {scenario.situation}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <Card className="p-4 bg-green-50 dark:bg-green-950">
                      <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                        <span className="text-2xl">✅</span>
                        What TO Do
                      </h4>
                      <ul className="space-y-2">
                        {scenario.whatToDo.map((item, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="text-green-600 dark:text-green-400">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                    <Card className="p-4 bg-red-50 dark:bg-red-950">
                      <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                        <span className="text-2xl">❌</span>
                        What NOT To Do
                      </h4>
                      <ul className="space-y-2">
                        {scenario.whatNotToDo.map((item, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="text-red-600 dark:text-red-400">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* External Resources */}
        <TabsContent value="resources" className="space-y-4 mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {RECOMMENDED_RESOURCES.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{resource.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {resource.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          asChild
                        >
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Learn More
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
