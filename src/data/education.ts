export type EducationEntry = {
  qualification: string;
  field: string;
  institution: string;
  period: string;
  /** Optional one-liner. Leave empty to hide. */
  note?: string;
};

/** Most recent first. */
export const education: EducationEntry[] = [
  {
    qualification: 'Bachelor of Engineering',
    field: 'Computer Science & Design',
    institution: 'Atria Institute of Technology',
    period: '2024 — 2027',
    note: 'Currently studying, alongside full-time operations work.',
  },
  {
    qualification: 'Diploma',
    field: 'Computer Science & Engineering',
    institution: 'Government Polytechnic',
    period: '2019 — 2022',
  },
  {
    qualification: 'Secondary school',
    field: 'Karnataka State Board',
    institution: 'Karnataka State Board',
    period: '2019',
  },
];

export type Strength = {
  index: string;
  title: string;
  description: string;
  /** Grounded in something on the resume — no invented claims. */
  evidence: string;
};

export const strengths: Strength[] = [
  {
    index: '01',
    title: 'Analytical thinking',
    description:
      'I work from records rather than impressions — inventory, appointments, operational logs — and look for what the numbers are actually saying.',
    evidence: 'Applied to inventory and operational records across two branches.',
  },
  {
    index: '02',
    title: 'Business understanding',
    description:
      'I have seen how a small business runs from the inside: what a delay costs, why stock matters, and where a process quietly breaks.',
    evidence: 'Three years coordinating a two-branch operation.',
  },
  {
    index: '03',
    title: 'Technical problem solving',
    description:
      'A diploma and an ongoing degree in computer science, currently applied to an AI detection project and earlier to sensor-based automation.',
    evidence: 'Deep fake detection system; automatic railway gate system.',
  },
  {
    index: '04',
    title: 'Team & operations experience',
    description:
      'Coordinating people, schedules and records day to day — and communicating across four languages while doing it.',
    evidence: 'Team coordination, salary records and customer service in an active business.',
  },
];
