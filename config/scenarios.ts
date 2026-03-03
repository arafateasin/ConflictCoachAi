export type Difficulty = "Easy" | "Medium" | "Hard" | "Extreme";

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  themeColor: string;
  agentId: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "wrong-delivery",
    title: "Wrong Delivery",
    description: "Customer received a brick instead of a laptop.",
    difficulty: "Easy",
    themeColor: "#10b981", // Emerald
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_1 || "REPLACE_WITH_AGENT_ID_1",
  },
  {
    id: "billing-errors",
    title: "Billing Errors",
    description: "Customer charged $500 instead of $50.",
    difficulty: "Medium",
    themeColor: "#f59e0b", // Amber
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_2 || "REPLACE_WITH_AGENT_ID_2",
  },
  {
    id: "technical-glitch",
    title: "Technical Glitch",
    description: "App keeps crashing during checkout.",
    difficulty: "Medium",
    themeColor: "#3b82f6", // Blue
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_3 || "REPLACE_WITH_AGENT_ID_3",
  },
  {
    id: "delayed-shipment",
    title: "Delayed Shipment",
    description: "Wedding gift won't arrive on time.",
    difficulty: "Hard",
    themeColor: "#ec4899", // Pink
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_4 || "REPLACE_WITH_AGENT_ID_4",
  },
  {
    id: "refund-rejected",
    title: "Refund Rejected",
    description: "Refund denied due to policy violation.",
    difficulty: "Hard",
    themeColor: "#ef4444", // Red
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_5 || "REPLACE_WITH_AGENT_ID_5",
  },
  {
    id: "support-runaround",
    title: "Support Run-around",
    description: "Customer transferred 5 times already.",
    difficulty: "Extreme",
    themeColor: "#8b5cf6", // Violet
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_6 || "REPLACE_WITH_AGENT_ID_6",
  },
  {
    id: "account-locked",
    title: "Account Locked",
    description: "Customer locked out of account, losing money.",
    difficulty: "Hard",
    themeColor: "#dc2626", // Red
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_7 || "REPLACE_WITH_AGENT_ID_7",
  },
  {
    id: "missing-features",
    title: "Missing Features",
    description: "Promised features not working as advertised.",
    difficulty: "Medium",
    themeColor: "#2563eb", // Blue
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_8 || "REPLACE_WITH_AGENT_ID_8",
  },
  {
    id: "damaged-product",
    title: "Damaged Product",
    description: "Product arrived broken, customer needs urgent replacement.",
    difficulty: "Easy",
    themeColor: "#059669", // Green
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_9 || "REPLACE_WITH_AGENT_ID_9",
  },
  {
    id: "subscription-cancellation",
    title: "Subscription Cancellation",
    description: "Customer wants to cancel but faces retention pressure.",
    difficulty: "Medium",
    themeColor: "#d97706", // Orange
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_10 || "REPLACE_WITH_AGENT_ID_10",
  },
  {
    id: "data-breach-concern",
    title: "Data Breach Concern",
    description: "Customer worried about security after breach notification.",
    difficulty: "Extreme",
    themeColor: "#7c3aed", // Purple
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_11 || "REPLACE_WITH_AGENT_ID_11",
  },
  {
    id: "warranty-dispute",
    title: "Warranty Dispute",
    description: "Product failed just after warranty expired.",
    difficulty: "Hard",
    themeColor: "#be123c", // Rose
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_12 || "REPLACE_WITH_AGENT_ID_12",
  },
];
