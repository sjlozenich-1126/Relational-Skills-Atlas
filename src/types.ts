/**
 * Data models for Relational Skills Atlas
 */

export type DomainCategory =
  | 'Legal & Governance'
  | 'Forensic Audit'
  | 'Defense & Security'
  | 'Urban & Real Estate'
  | 'Biocultural & Ecology'
  | 'Digital & Systems';

export const DOMAIN_CATEGORIES: DomainCategory[] = [
  'Legal & Governance',
  'Forensic Audit',
  'Defense & Security',
  'Urban & Real Estate',
  'Biocultural & Ecology',
  'Digital & Systems',
];

export type AcquisitionType = 'Learned' | 'Used' | 'Applied';

export type SpiralPhase = 'Initiation' | 'Descent' | 'Reconfiguration' | 'Ascent';

export type SyllabusStatus = 'Active' | 'Paused' | 'Completed';

export type CoursePublishStatus = 'Draft' | 'Published' | 'Exported';

export type ModuleCompletionStatus = 'Not Started' | 'In Progress' | 'Completed';

export type REPDimension =
  | 'Meaningful engagement'
  | 'Interpretation of signs'
  | 'Relational reasoning'
  | 'Use of feedback'
  | 'Adaptive revision'
  | 'Multimodal representation'
  | 'Generative artifact'
  | 'Reflective recursion'
  | 'Transfer and application'
  | 'Ethical and contextual awareness';

export const REP_DIMENSIONS: { id: REPDimension; label: string; description: string }[] = [
  {
    id: 'Meaningful engagement',
    label: 'Meaningful Engagement',
    description: 'Sustained inquiry, situational investment, and epistemic curiosity.',
  },
  {
    id: 'Interpretation of signs',
    label: 'Interpretation of Signs',
    description: 'Discerning non-obvious signals, evidentiary traces, and contextual indicators.',
  },
  {
    id: 'Relational reasoning',
    label: 'Relational Reasoning',
    description: 'Tracing interdependencies, feedback loops, and systemic cause-and-effect.',
  },
  {
    id: 'Use of feedback',
    label: 'Use of Feedback',
    description: 'Active assimilation of critique, field diagnostics, and error signals.',
  },
  {
    id: 'Adaptive revision',
    label: 'Adaptive Revision',
    description: 'Pivoting hypotheses and reconfiguring strategies under shifting constraints.',
  },
  {
    id: 'Multimodal representation',
    label: 'Multimodal Representation',
    description: 'Expressing ideas across diagrams, quantitative logs, prose, and spatial maps.',
  },
  {
    id: 'Generative artifact',
    label: 'Generative Artifact',
    description: 'Creating durable, inspectable instruments, frameworks, or codebases.',
  },
  {
    id: 'Reflective recursion',
    label: 'Reflective Recursion',
    description: 'Meta-cognitive evaluation of one’s own analytical assumptions and biases.',
  },
  {
    id: 'Transfer and application',
    label: 'Transfer & Application',
    description: 'Transposing paradigms and methods into unfamiliar problem spaces.',
  },
  {
    id: 'Ethical and contextual awareness',
    label: 'Ethical & Contextual Awareness',
    description: 'Attunement to downstream stakeholder impacts, power asymmetries, and ecology.',
  },
];

export const REP_LEVELS = [
  { level: 1, label: 'Emerging', description: 'Early-stage orientation with basic recognition of patterns' },
  { level: 2, label: 'Developing', description: 'Consistent application in structured settings with guidance' },
  { level: 3, label: 'Proficient', description: 'Autonomous orchestration across complex multi-variable conditions' },
  { level: 4, label: 'Exemplary', description: 'Generative mastery, innovating new heuristics and teaching peers' },
] as const;

export interface User {
  id: string;
  name: string;
  email: string;
  preferredTeachingStyleNotes: string;
  profileSummary: string;
  avatarUrl?: string;
  targetRole?: string;
  location?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export type ProjectStatus = 'Planning' | 'In Progress' | 'Review' | 'Completed';

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: DomainCategory | string;
  status?: ProjectStatus;
  start_date: string;
  end_date: string;
  files: Array<{ name: string; size?: string; type?: string; content?: string }>;
  notes: string;
  milestones?: ProjectMilestone[];
  extractedSkillsCount?: number;
  assessedAt?: string;
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  domain_area: DomainCategory | string;
  acquisition_type: AcquisitionType;
  proficiency_level: 1 | 2 | 3 | 4 | 5;
  provenance_note: string;
  micro_tag: string;
  meso_tag: string;
  macro_tag: string;
  rep_scores: Partial<Record<REPDimension, 1 | 2 | 3 | 4>>;
  added_at?: string;
}

export interface ModuleResource {
  title: string;
  type: 'article' | 'standard' | 'case_study' | 'framework' | 'tool' | 'course' | 'external_link' | string;
  source?: string;
  url?: string;
  summary?: string;
  isCustom?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonContent {
  key_takeaway: string;
  conceptual_foundation: string;
  case_study: string;
  practical_exercise: string;
  reflection_prompt: string;
  user_reflection?: string;
  user_notes?: string;
  quiz?: QuizQuestion[];
  userQuizAnswers?: number[];
  userQuizScore?: number;
  repSelfAssessment?: Partial<Record<REPDimension, 1 | 2 | 3 | 4>>;
}

export interface Module {
  id: string;
  syllabus_id: string;
  title: string;
  description: string;
  spiral_phase?: SpiralPhase;
  catalyst?: string;
  micro_focus: string; // Specific skill or action
  meso_focus: string;  // Project or operational context
  macro_focus: string; // Institution or ecosystem scale
  resources: ModuleResource[];
  feedback_prompts: string[];
  completion_status: ModuleCompletionStatus;
  lesson_content?: LessonContent;
  completed_at?: string;
}

export interface Syllabus {
  id: string;
  user_id: string;
  title: string;
  goal_description: string;
  catalyst: string;
  spiral_phase: SpiralPhase;
  status: SyllabusStatus;
  domain: DomainCategory | string;
  target_project?: string;
  teaching_style_notes?: string;
  modules: Module[];
  created_at: string;
  updated_at: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  description: string;
  micro_focus: string;
  meso_focus: string;
  macro_focus: string;
  resources: string[];
  rep_prompts: string[];
}

export interface Course {
  id: string;
  user_id: string;
  title: string;
  description: string;
  audience: string;
  domain: DomainCategory | string;
  structure: CourseLesson[];
  publish_status: CoursePublishStatus;
  created_at: string;
  updated_at: string;
}
