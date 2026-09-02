export type OperationsNode = {
  id: string;
  label: string;
  /** One line describing what this area involves in the role. */
  detail: string;
  /** Position on the dashboard diagram, as a percentage of the container. */
  x: number;
  y: number;
};

export type Experience = {
  company: string;
  role: string;
  location: string;
  period: string;
  summary: string;
  responsibilities: string[];
  nodes: OperationsNode[];
  /** Pairs of node ids to connect with an animated line. */
  connections: [string, string][];
};

export const experience: Experience = {
  company: 'Flair Hair Fixing',
  role: 'Operations Coordinator',
  location: 'Bengaluru, India',
  period: 'June 2022 — Present',
  summary:
    'Coordinating the daily running of two branches — the appointments that fill the day, the stock behind them, and the records that keep both branches accountable.',
  responsibilities: [
    'Coordinating daily operations across two business branches',
    'Managing customer appointments and client interactions',
    'Maintaining inventory records and monitoring stock',
    'Assisting with salary coordination and operational records',
    'Working with team members to improve operations and customer service',
    'Resolving operational issues to support efficient branch management',
  ],
  nodes: [
    { id: 'ops', label: 'Operations', detail: 'Daily coordination across two branches', x: 50, y: 50 },
    { id: 'appointments', label: 'Appointments', detail: 'Scheduling and client interactions', x: 16, y: 20 },
    { id: 'inventory', label: 'Inventory', detail: 'Stock records and monitoring', x: 84, y: 22 },
    { id: 'team', label: 'Team', detail: 'Coordination and salary records', x: 14, y: 80 },
    { id: 'service', label: 'Customer service', detail: 'Resolving issues, improving experience', x: 86, y: 78 },
  ],
  connections: [
    ['ops', 'appointments'],
    ['ops', 'inventory'],
    ['ops', 'team'],
    ['ops', 'service'],
    ['appointments', 'service'],
    ['inventory', 'team'],
  ],
};

/** Extra-curricular involvement, shown as a short note under the role. */
export const extraCurricular = {
  title: 'College Social Media Team',
  points: [
    'Created and managed social media content',
    'Promoted college events including the ISTE Symposium',
    'Coordinated with organising teams to plan and publish event content',
  ],
};
