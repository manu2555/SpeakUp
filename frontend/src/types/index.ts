export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Feedback {
  id: string;
  type: 'COMPLAINT' | 'SUGGESTION' | 'ENQUIRE';
  department: string;
  agency: string;
  subject: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface FeedbackState {
  feedbacks: Feedback[];
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  feedback: FeedbackState;
}