/**
 * ──────────────────────────────────────────────────────────────
 *  EDIT ME FIRST — every personal detail on the site comes from
 *  this file: name, contact, social links and hero copy.
 * ──────────────────────────────────────────────────────────────
 */

export const personal = {
  initials: 'UF',
  fullName: 'Umar Farooq',
  /** Positioning line used in the nav, hero label and meta description. */
  discipline: 'Computer Science & Design',
  location: 'Bangalore, India',
  email: 'uf7829080@gmail.com',
  phone: '+91 7829080323',

  hero: {
    label: 'Computer Science & Design',
    greeting: "Hi, I'm Umar Farooq.",
    statement: 'I turn data, technology and ideas into practical solutions.',
    support:
      'Computer Science & Design student with experience in business operations, data analysis and AI-driven projects.',
    /** Labels that orbit the 3D data core. */
    orbitLabels: ['DATA', 'AI', 'SQL', 'ANALYTICS', 'OPERATIONS'],
    scrollHint: 'Scroll to explore',
  },

  about: {
    heading: 'My journey',
    intro:
      'My path has run through two tracks at once: formal study in computer science, and day-to-day responsibility for how a real business operates. I am building a career where those two meet — analysis, data and technology applied to problems a business actually has.',
    interests: [
      'Business Analysis',
      'Data Analysis',
      'Business Operations',
      'Process Improvement',
      'Product Management',
    ],
    languages: ['English', 'Hindi', 'Kannada', 'Urdu'],
  },

  /**
   * REPLACE THESE. Placeholder URLs — swap in your real profiles.
   * Anything left as '#' is rendered as "coming soon" rather than a dead link.
   */
  socials: {
    linkedin: '#', // e.g. https://linkedin.com/in/your-handle
    github: '#', // e.g. https://github.com/your-username
  },

  copyrightYear: 2026,
} as const;

/** About / My Journey — scroll-driven timeline. Newest last so it reads forward. */
export type JourneyEntry = {
  year: string;
  title: string;
  detail: string;
  track: 'Education' | 'Work' | 'Project';
};

export const journey: JourneyEntry[] = [
  {
    year: '2019',
    title: 'Started a Diploma in Computer Science & Engineering',
    detail: 'Government Polytechnic. First formal grounding in computing fundamentals.',
    track: 'Education',
  },
  {
    year: '2022',
    title: 'Completed the diploma and joined Flair Hair Fixing',
    detail:
      'Stepped straight into an Operations Coordinator role in Bengaluru, working across two branches.',
    track: 'Work',
  },
  {
    year: '2023',
    title: 'Built an automatic railway gate operation system',
    detail:
      'A sensor-driven gate control project, presented at a college technical fest with my team.',
    track: 'Project',
  },
  {
    year: '2024',
    title: 'Began B.E. in Computer Science & Design',
    detail: 'Atria Institute of Technology, studying while continuing to work in operations.',
    track: 'Education',
  },
  {
    year: '2026',
    title: 'Working on a deep fake detection system',
    detail: 'An AI-based system for identifying manipulated images and video. In progress.',
    track: 'Project',
  },
  {
    year: '2027',
    title: 'Expected completion of the B.E.',
    detail: 'Targeting roles in business analysis, data analysis and operations.',
    track: 'Education',
  },
];
