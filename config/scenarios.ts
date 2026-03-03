export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';

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
    id: 'wrong-delivery',
    title: 'Wrong Delivery',
    description: 'Customer received a brick instead of a laptop.',
    difficulty: 'Easy',
    themeColor: '#10b981', // Emerald
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_1 || 'REPLACE_WITH_AGENT_ID_1',
  },
  {
    id: 'billing-errors',
    title: 'Billing Errors',
    description: 'Customer charged $500 instead of $50.',
    difficulty: 'Medium',
    themeColor: '#f59e0b', // Amber
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_2 || 'REPLACE_WITH_AGENT_ID_2',
  },
  {
    id: 'technical-glitch',
    title: 'Technical Glitch',
    description: 'App keeps crashing during checkout.',
    difficulty: 'Medium',
    themeColor: '#3b82f6', // Blue
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_3 || 'REPLACE_WITH_AGENT_ID_3',
  },
  {
    id: 'delayed-shipment',
    title: 'Delayed Shipment',
    description: "Wedding gift won't arrive on time.",
    difficulty: 'Hard',
    themeColor: '#ec4899', // Pink
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_4 || 'REPLACE_WITH_AGENT_ID_4',
  },
  {
    id: 'refund-rejected',
    title: 'Refund Rejected',
    description: 'Refund denied due to policy violation.',
    difficulty: 'Hard',
    themeColor: '#ef4444', // Red
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_5 || 'REPLACE_WITH_AGENT_ID_5',
  },
  {
    id: 'support-runaround',
    title: 'Support Run-around',
    description: 'Customer transferred 5 times already.',
    difficulty: 'Extreme',
    themeColor: '#8b5cf6', // Violet
    agentId: process.env.NEXT_PUBLIC_AGENT_ID_6 || 'REPLACE_WITH_AGENT_ID_6',
  },
];
