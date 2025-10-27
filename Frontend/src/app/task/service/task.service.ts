import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, TaskStats, TaskStatus } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks$ = new BehaviorSubject<Task[]>([
    {
      id: 1,
      label: 'Développer l\'interface utilisateur',
      description: 'Créer les composants Angular pour la liste et les détails des tâches avec Material Design. Assurer la responsivité et l\'accessibilité de l\'interface.',
      completed: false
    },
    {
      id: 2,
      label: 'Configurer le routing',
      description: 'Mettre en place les routes pour naviguer entre les différentes vues de l\'application. Configurer les guards et les resolvers nécessaires.',
      completed: true
    },
    {
      id: 3,
      label: 'Implémenter le service de tâches',
      description: 'Créer un service pour gérer les opérations CRUD sur les tâches. Intégrer avec l\'API backend et gérer les états de chargement.',
      completed: false
    },
    {
      id: 4,
      label: 'Ajouter les tests unitaires',
      description: 'Écrire les tests pour valider le bon fonctionnement de l\'application. Couvrir les composants, services et pipes.',
      completed: false
    }
  ]);

  constructor() { }

  // Récupérer toutes les tâches
  getTasks(): Observable<Task[]> {
    return this.tasks$.asObservable();
  }

  // Récupérer une tâche par son ID
  getTaskById(id: number): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }

  // Filtrer les tâches par statut
  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => {
        switch (status) {
          case 'completed':
            return tasks.filter(task => task.completed);
          case 'pending':
            return tasks.filter(task => !task.completed);
          default:
            return tasks;
        }
      })
    );
  }

  // Obtenir les statistiques
  getStats(): Observable<TaskStats> {
    return this.tasks$.pipe(
      map(tasks => ({
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length
      }))
    );
  }

  // Ajouter une tâche
  addTask(task: Omit<Task, 'id'>): void {
    const tasks = this.tasks$.value;
    const newTask: Task = {
      ...task,
      id: Math.max(...tasks.map(t => t.id), 0) + 1
    };
    this.tasks$.next([...tasks, newTask]);
  }

  // Mettre à jour une tâche
  updateTask(id: number, updates: Partial<Task>): void {
    const tasks = this.tasks$.value;
    const index = tasks.findIndex(task => task.id === id);
    
    if (index !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[index] = { ...updatedTasks[index], ...updates };
      this.tasks$.next(updatedTasks);
    }
  }

  // Basculer le statut d'une tâche
  toggleTaskStatus(id: number): void {
    const tasks = this.tasks$.value;
    const task = tasks.find(t => t.id === id);
    
    if (task) {
      this.updateTask(id, { completed: !task.completed });
    }
  }

  // Supprimer une tâche
  deleteTask(id: number): void {
    const tasks = this.tasks$.value;
    this.tasks$.next(tasks.filter(task => task.id !== id));
  }

  // Supprimer toutes les tâches terminées
  deleteCompletedTasks(): void {
    const tasks = this.tasks$.value;
    this.tasks$.next(tasks.filter(task => !task.completed));
  }
}