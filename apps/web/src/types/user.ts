import { Role, Plan } from './workspace';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  plan: Plan;
  createdAt: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: string;
}
