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
  role?: string;
  sessionToken?: string;
  passwordHash?: string;
  plainPasswordSimulated?: string;
  ipAddress?: string;
  accountBalance?: string;
}

export type PlaygroundPage = 'form' | 'visualizer' | 'exfiltrated' | 'split';

export type AttackPresetType = 'normal' | 'sqli' | 'xss';

export interface BreachIncident {
  id: string;
  timestamp: string;
  attackType: 'sqli' | 'xss';
  payload: {
    email: string;
    comment: string;
  };
  title: string;
  summary: string;
  subCategory?: string;
}

