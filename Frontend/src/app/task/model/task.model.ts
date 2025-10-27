export interface Task {
  id: number;
  label: string;
  description: string;
  completed: boolean;
}

export type TaskStatus = 'all' | 'completed' | 'pending';

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}