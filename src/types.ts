export interface FormSubmission {
  id: string;
  name: string;
  email: string;
  feedback: string;
  environment: string;
  rating?: number;
  submittedAt: string;
  hasSQLi: boolean;
  hasXSS: boolean;
}

export type PlaygroundPage = 'form' | 'visualizer' | 'split';

export type AttackPresetType = 'normal' | 'sqli' | 'xss';
