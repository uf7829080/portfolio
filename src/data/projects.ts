export type ProjectVisual = 'detection' | 'railway';

export type Project = {
  id: string;
  index: string;
  title: string;
  category: string;
  status: string;
  period: string;
  summary: string;
  overview: string;
  /** Honest list — nothing here that has not been stated. */
  technologies: string[];
  contribution: string[];
  /** Stage labels used by the interactive visual. */
  stages: string[];
  visual: ProjectVisual;
  /**
   * Optional screenshot. Put files in /public/images and reference them
   * as '/images/deepfake.jpg'. Empty string keeps the generated visual.
   */
  image?: string;
  github?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    id: 'deepfake',
    index: '01',
    title: 'Deep fake detection system',
    category: 'AI · Computer vision · Research',
    status: 'In progress',
    period: 'April 2026 — Present',
    summary: 'An AI-based system to identify manipulated images and videos.',
    overview:
      'Developing a system that examines images and video for signs of manipulation. The work is as much research and evaluation as it is implementation — establishing how detection accuracy is measured before deciding what improves it.',
    technologies: ['AI / computer vision', 'Research & documentation', 'System evaluation'],
    contribution: [
      'Participating in research, testing and documentation',
      'Evaluating system behaviour against test material',
      'Working on detection accuracy through analytical approaches',
    ],
    stages: ['Image', 'Video', 'AI analysis', 'Detection', 'Result'],
    visual: 'detection',
    image: '',
    github: '#',
    demo: '#',
  },
  {
    id: 'railway',
    index: '02',
    title: 'Automatic railway gate operation system',
    category: 'Sensors · Automation · Embedded systems',
    status: 'Completed',
    period: 'July 2023',
    summary: 'A sensor-driven control system for automated railway gate operation.',
    overview:
      'A team project that automated the opening and closing of a railway gate using sensor input, removing the need for manual operation at the crossing. Presented at a college technical fest.',
    technologies: ['Sensor-based automation', 'Embedded control logic'],
    contribution: [
      'Collaborated on project planning, testing and implementation',
      'Presented the project at a college technical fest',
      'Strengthened problem solving, teamwork and project coordination',
    ],
    stages: ['Train approaches', 'Sensor detection', 'Control system', 'Gate operation'],
    visual: 'railway',
    image: '',
    github: '#',
    demo: '#',
  },
];
