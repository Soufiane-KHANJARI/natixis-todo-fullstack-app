import { Injectable, signal } from '@angular/core';
import { Task } from '../model/task.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/tasks';

  private _tasks = signal<Task[]>([]);
  public readonly tasks = this._tasks.asReadonly();

  constructor(private http: HttpClient) {
    console.log('1');

    this.loadAllTasks();
    console.log(this.loadAllTasks, this.tasks);
  }

  loadAllTasks(): void {
    this.http
      .get<Task[]>(this.apiUrl)
      .pipe(
        tap((tasks) => this._tasks.set(tasks)),
        catchError(this.handleError)
      )
      .subscribe();
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap((tasks) => this._tasks.set(tasks)),
      catchError(this.handleError)
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap((newTask) => {
        this._tasks.update((tasks) => [...tasks, newTask]);
      }),
      catchError(this.handleError)
    );
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap((updatedTask) => {
        this._tasks.update((tasks) => tasks.map((t) => (t.id === id ? updatedTask : t)));
      }),
      catchError(this.handleError)
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Supprimer la tâche du signal
        this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  toggleTaskCompletion(id: string, completed: boolean): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/${completed}`, {}).pipe(
      tap((updatedTask) => {
        // Mettre à jour la tâche dans le signal
        this._tasks.update((tasks) => tasks.map((t) => (t.id === id ? updatedTask : t)));
      }),
      catchError(this.handleError)
    );
  }

  getTasksByStatus(completed: boolean): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.apiUrl}/status`, {
        params: { completed: completed.toString() },
      })
      .pipe(catchError(this.handleError));
  }

  getActiveTasks(): Task[] {
    return this._tasks().filter((task) => !task.completed);
  }

  getCompletedTasks(): Task[] {
    return this._tasks().filter((task) => task.completed);
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

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;

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
