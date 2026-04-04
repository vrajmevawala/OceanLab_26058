export type Severity = 'error' | 'warning' | 'info';

export interface Issue {
  id: string;
  line: number;
  endLine?: number;
  column?: number;
  severity: Severity;
  message: string;
  rule: string;
  fixable: boolean;
  explanation?: string;
  fix?: string;
  originalCode?: string;
  category?: string;
  metadata?: {
    timeComplexity?: string;
    spaceComplexity?: string;
  };
}

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  lineNum?: number;
  content: string;
}
