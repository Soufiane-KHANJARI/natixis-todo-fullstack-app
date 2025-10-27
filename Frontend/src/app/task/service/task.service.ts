import { Injectable, signal } from '@angular/core';
import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Signal pour stocker les tâches
  private _tasks = signal<Task[]>([]);

  // Signal readonly exposé publiquement
  public readonly tasks = this._tasks.asReadonly();

  constructor() {
    this.initializeDemoData();
  }

  /**
   * Initialise des données de démonstration
   */
  private initializeDemoData(): void {
    const demoTasks: Task[] = [
      {
        id: 'task-1',
        label: 'Préparer la réunion mensuelle',
        description: 'Organiser l\'ordre du jour et préparer les documents nécessaires pour la réunion mensuelle avec l\'équipe.',
        completed: false
      },
      {
        id: 'task-2',
        label: 'Réviser le code du module utilisateur',
        description: 'Effectuer une revue de code approfondie du module de gestion des utilisateurs avant la mise en production.',
        completed: true
      },
      {
        id: 'task-3',
        label: 'Mettre à jour la documentation',
        description: 'Mettre à jour la documentation technique du projet suite aux dernières modifications de l\'API.',
        completed: false
      },
      {
        id: 'task-4',
        label: 'Corriger les bugs critiques',
        description: 'Résoudre les bugs critiques signalés dans le système de tickets avant la fin de la semaine.',
        completed: false
      },
      {
        id: 'task-5',
        label: 'Former les nouveaux développeurs',
        description: 'Organiser une session de formation pour les nouveaux membres de l\'équipe sur les bonnes pratiques du projet.',
        completed: true
      }
    ];

    this._tasks.set(demoTasks);
  }

  /**
   * Récupère toutes les tâches
   */
  getAllTasks(): Task[] {
    return this._tasks();
  }

  /**
   * Récupère une tâche par son ID
   */
  getTaskById(id: string): Task | undefined {
    return this._tasks().find(task => task.id === id);
  }

  /**
   * Ajoute une nouvelle tâche
   */
  addTask(task: Task): void {
    this._tasks.update(tasks => [...tasks, task]);
  }

  /**
   * Met à jour une tâche existante
   */
  updateTask(updatedTask: Task): void {
    this._tasks.update(tasks =>
      tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
  }

  /**
   * Supprime une tâche
   */
  deleteTask(id: string): void {
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  /**
   * Bascule le statut d'une tâche
   */
  toggleTaskStatus(id: string): void {
    this._tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  /**
   * Récupère les tâches actives
   */
  getActiveTasks(): Task[] {
    return this._tasks().filter(task => !task.completed);
  }

  /**
   * Récupère les tâches complétées
   */
  getCompletedTasks(): Task[] {
    return this._tasks().filter(task => task.completed);
  }

  /**
   * Compte le nombre total de tâches
   */
  getTotalCount(): number {
    return this._tasks().length;
  }

  /**
   * Compte le nombre de tâches actives
   */
  getActiveCount(): number {
    return this.getActiveTasks().length;
  }

  /**
   * Compte le nombre de tâches complétées
   */
  getCompletedCount(): number {
    return this.getCompletedTasks().length;
  }
}
