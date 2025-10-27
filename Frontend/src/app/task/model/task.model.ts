/**
 * Interface représentant une tâche
 */
export interface Task {
  /** Identifiant unique de la tâche */
  id: string;
  
  /** Intitulé de la tâche */
  label: string;
  
  /** Description détaillée de la tâche */
  description: string;
  
  /** Indique si la tâche est complétée */
  completed: boolean;
}

/**
 * Type pour la création d'une nouvelle tâche (sans ID)
 */
export type CreateTaskDto = Omit<Task, 'id'>;

/**
 * Type pour la mise à jour partielle d'une tâche
 */
export type UpdateTaskDto = Partial<Task> & { id: string };
