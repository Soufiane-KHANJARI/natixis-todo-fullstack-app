import { Injectable, signal } from '@angular/core';
import { Task } from '../model/task.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // URL de base de l'API
  private readonly apiUrl = 'http://localhost:8080/api/v1/tasks';

  // Signal pour stocker les tâches
  private _tasks = signal<Task[]>([]);
  public readonly tasks = this._tasks.asReadonly();

  constructor(private http: HttpClient) {
    console.log("1")
    // Charger les tâches au démarrage
    this.loadAllTasks();
    console.log(this.loadAllTasks,this.tasks);
    
  }

  /**
   * Charge toutes les tâches depuis l'API
   */
  loadAllTasks(): void {
    this.http.get<Task[]>(this.apiUrl)
      .pipe(
        tap(tasks => this._tasks.set(tasks)),
        catchError(this.handleError)
      )
      .subscribe();
  }

  /**
   * Récupère toutes les tâches
   * GET /api/v1/tasks
   */
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
      .pipe(
        tap(tasks => this._tasks.set(tasks)),
        catchError(this.handleError)
      );
  }

  /**
   * Récupère une tâche par son ID
   * GET /api/v1/tasks/{id}
   */
  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Crée une nouvelle tâche
   * POST /api/v1/tasks
   */
  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task)
      .pipe(
        tap(newTask => {
          // Ajouter la nouvelle tâche au signal
          this._tasks.update(tasks => [...tasks, newTask]);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Met à jour une tâche existante
   * PUT /api/v1/tasks/{id}
   */
  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task)
      .pipe(
        tap(updatedTask => {
          // Mettre à jour la tâche dans le signal
          this._tasks.update(tasks =>
            tasks.map(t => t.id === id ? updatedTask : t)
          );
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Supprime une tâche
   * DELETE /api/v1/tasks/{id}
   */
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          // Supprimer la tâche du signal
          this._tasks.update(tasks => tasks.filter(t => t.id !== id));
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Change le statut d'une tâche (completed/not completed)
   * PATCH /api/v1/tasks/{id}/{completed}
   */
  toggleTaskCompletion(id: string, completed: boolean): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/${completed}`, {})
      .pipe(
        tap(updatedTask => {
          // Mettre à jour la tâche dans le signal
          this._tasks.update(tasks =>
            tasks.map(t => t.id === id ? updatedTask : t)
          );
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Liste les tâches selon leur statut
   * GET /api/v1/tasks/status?completed=true|false
   */
  getTasksByStatus(completed: boolean): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/status`, {
      params: { completed: completed.toString() }
    })
    .pipe(catchError(this.handleError));
  }

  /**
   * Méthodes utilitaires locales (sans appel API)
   */
  
  getActiveTasks(): Task[] {
    return this._tasks().filter(task => !task.completed);
  }

  getCompletedTasks(): Task[] {
    return this._tasks().filter(task => task.completed);
  }

  getTotalCount(): number {
    return this._tasks().length;
  }

  getActiveCount(): number {
    return this.getActiveTasks().length;
  }

  getCompletedCount(): number {
    return this.getCompletedTasks().length;
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;
      
      // Messages personnalisés selon le code d'erreur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les données envoyées.';
          break;
        case 404:
          errorMessage = 'Tâche introuvable.';
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}