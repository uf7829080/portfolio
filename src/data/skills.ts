export type SkillGroupId = 'data' | 'business' | 'technology' | 'core';

export type Skill = {
  id: string;
  name: string;
  group: SkillGroupId;
  /** Short, factual description shown on hover / tap. */
  note: string;
  /** Other skill ids that light up alongside this one. */
  related: string[];
};

export type SkillGroup = {
  id: SkillGroupId;
  label: string;
  accent: string;
  /** Angle in degrees on the ecosystem ring. */
  angle: number;
};

export const skillGroups: SkillGroup[] = [
  { id: 'data', label: 'Data & analytics', accent: '#22D3EE', angle: 225 },
  { id: 'business', label: 'Business', accent: '#4DA6FF', angle: 315 },
  { id: 'technology', label: 'Technology', accent: '#7C6CFF', angle: 135 },
  { id: 'core', label: 'Core strengths', accent: '#8CC6FF', angle: 45 },
];

export const skills: Skill[] = [
  // Data & analytics
  {
    id: 'excel',
    name: 'MS Excel',
    group: 'data',
    note: 'Day-to-day tool for operational records, inventory tracking and working through numbers.',
    related: ['sheets', 'data-analysis', 'office'],
  },
  {
    id: 'sql',
    name: 'SQL',
    group: 'data',
    note: 'Querying and structuring data to answer questions rather than eyeballing a sheet.',
    related: ['data-analysis', 'business-analysis'],
  },
  {
    id: 'data-analysis',
    name: 'Data analysis',
    group: 'data',
    note: 'Turning raw records into something a decision can be based on.',
    related: ['sql', 'excel', 'analytical', 'business-analysis'],
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    group: 'data',
    note: 'Shared, live tracking that a whole team can update at once.',
    related: ['excel', 'operations'],
  },

  // Business
  {
    id: 'business-analysis',
    name: 'Business analysis',
    group: 'business',
    note: 'Reading how a business actually works, then finding where the friction sits.',
    related: ['data-analysis', 'process', 'business-management'],
  },
  {
    id: 'business-management',
    name: 'Business management',
    group: 'business',
    note: 'Keeping records, resources and people aligned to what the branch needs that week.',
    related: ['operations', 'team', 'business-analysis'],
  },
  {
    id: 'operations',
    name: 'Business operations',
    group: 'business',
    note: 'Three years of running daily operations across two branches, not theory.',
    related: ['business-management', 'process', 'sheets', 'team'],
  },
  {
    id: 'process',
    name: 'Process improvement',
    group: 'business',
    note: 'Small changes to how work flows, judged by whether the day actually got easier.',
    related: ['operations', 'business-analysis', 'problem-solving'],
  },

  // Technology
  {
    id: 'cs',
    name: 'Computer science',
    group: 'technology',
    note: 'Diploma plus an ongoing B.E. in Computer Science & Design.',
    related: ['genai', 'sql', 'problem-solving'],
  },
  {
    id: 'genai',
    name: 'Generative AI tools',
    group: 'technology',
    note: 'Using current AI tooling for research, drafting and testing ideas quickly.',
    related: ['cs', 'data-analysis'],
  },
  {
    id: 'office',
    name: 'MS Office',
    group: 'technology',
    note: 'Documentation and reporting that other people have to read and use.',
    related: ['excel', 'communication'],
  },

  // Core strengths
  {
    id: 'analytical',
    name: 'Analytical thinking',
    group: 'core',
    note: 'Breaking a messy situation down until the actual question is visible.',
    related: ['data-analysis', 'problem-solving', 'business-analysis'],
  },
  {
    id: 'problem-solving',
    name: 'Problem solving',
    group: 'core',
    note: 'Resolving operational issues as they land, with the branch still running.',
    related: ['analytical', 'operations', 'process'],
  },
  {
    id: 'communication',
    name: 'Communication',
    group: 'core',
    note: 'Clients, team and coordination across two branches, in four languages.',
    related: ['team', 'office'],
  },
  {
    id: 'team',
    name: 'Team management',
    group: 'core',
    note: 'Working with the team on scheduling, records and service quality.',
    related: ['communication', 'operations', 'business-management'],
  },
];

export const skillsByGroup = (group: SkillGroupId) => skills.filter((skill) => skill.group === group);
