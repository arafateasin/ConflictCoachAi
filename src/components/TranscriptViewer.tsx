import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Message {
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

interface TranscriptViewerProps {
  messages: Message[];
}

export function TranscriptViewer({ messages }: TranscriptViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="transcript" className="border border-border rounded-2xl overflow-hidden bg-card">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-secondary rounded-lg">
                <Bot className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">Conversation Transcript</span>
              <span className="text-xs text-muted-foreground">({messages.length} messages)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {messages.map((message, index) => (
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
                  <div
                    className={`flex-1 rounded-2xl p-3 ${
                      message.role === "user"
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-secondary"
                    }`}
                  >
                    <p className="text-sm text-foreground">{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
