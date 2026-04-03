export type Plan = 'free' | 'pro' | 'team' | 'enterprise';
export type Role = 'owner' | 'admin' | 'developer' | 'viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'invited';
  analyses: number;
  avgScore: number;
  initials: string;
  color: string;
}

export interface NavPage {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}
