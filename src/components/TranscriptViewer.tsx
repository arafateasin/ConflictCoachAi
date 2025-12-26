import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Message {
  role: "user" | "agent";
  content: string;
  timestamp: string;
  sentiment?: "positive" | "negative" | "neutral";
}

interface TranscriptViewerProps {
  messages: Message[];
  showSentiment?: boolean;
}

// Simple sentiment analysis mock
const analyzeSentiment = (content: string): "positive" | "negative" | "neutral" => {
  const negativeWords = ["ridiculous", "furious", "angry", "terrible", "worst", "hate", "cancel", "frustrated", "unacceptable"];
  const positiveWords = ["understand", "thank", "appreciate", "great", "resolved", "help", "solution", "right"];
  
  const lowerContent = content.toLowerCase();
  const hasNegative = negativeWords.some(word => lowerContent.includes(word));
  const hasPositive = positiveWords.some(word => lowerContent.includes(word));
  
  if (hasNegative && !hasPositive) return "negative";
  if (hasPositive && !hasNegative) return "positive";
  return "neutral";
};

const getSentimentStyles = (sentiment: "positive" | "negative" | "neutral", role: "user" | "agent") => {
  if (sentiment === "negative") {
    return "bg-destructive/10 border border-destructive/30";
  }
  if (sentiment === "positive") {
    return "bg-success/10 border border-success/30";
  }
  // Neutral - use default styles
  return role === "user" 
    ? "bg-primary/10 border border-primary/20" 
    : "bg-secondary";
};

export function TranscriptViewer({ messages, showSentiment = false }: TranscriptViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="transcript" className="border border-foreground/10 rounded-2xl overflow-hidden bg-card/30 backdrop-blur-xl">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-foreground/5 transition-colors">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-secondary/50 rounded-lg backdrop-blur-sm">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">Conversation Transcript</span>
              <span className="text-xs text-muted-foreground">({messages.length} messages)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {messages.map((message, index) => {
                const sentiment = showSentiment ? analyzeSentiment(message.content) : "neutral";
                const messageStyles = showSentiment 
                  ? getSentimentStyles(sentiment, message.role)
                  : message.role === "user"
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-secondary";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: message.role === "user" ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-primary/20 text-primary"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`flex-1 rounded-2xl p-3 ${messageStyles}`}>
                      <p className="text-sm text-foreground">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                        {showSentiment && sentiment !== "neutral" && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            sentiment === "negative" 
                              ? "bg-destructive/20 text-destructive" 
                              : "bg-success/20 text-success"
                          }`}>
                            {sentiment === "negative" ? "Frustrated" : "Positive"}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
