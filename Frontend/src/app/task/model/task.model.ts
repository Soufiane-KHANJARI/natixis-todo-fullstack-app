export interface Task {
  id: string;

  label: string;

  description: string;

  completed: boolean;
}

export type CreateTaskDto = Omit<Task, 'id'>;

export type UpdateTaskDto = Partial<Task> & { id: string };
