import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TaskService } from '../../service/task.service';
import { Task } from '../../model/task.model';

import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  task = signal<Task | null>(null);
  taskcomp!: Task;

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');

    if (taskId) {
      this.loadTask(taskId);
    } else {
      this.showNotification('ID de tâche manquant', 'error');
      this.goBack();
    }
  }

  private loadTask(taskId: string): void {
    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.task.set(task);
      },
      error: (error) => {
        this.showNotification(`Erreur: ${error.message}`, 'error');
        this.goBack();
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  goToList(): void {
    this.router.navigate(['/tasks']);
  }

  openEditDialog(): void {
    const currentTask = this.task();
    if (!currentTask) return;

    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog',
      data: { mode: 'edit', task: currentTask },
    });

    dialogRef.afterClosed().subscribe((result: Task | undefined) => {
      if (result) {
        // Mettre à jour la tâche via l'API
        this.taskService.updateTask(currentTask.id, result).subscribe({
          next: (updatedTask) => {
            this.task.set(updatedTask);
            this.showNotification('Tâche modifiée avec succès');
          },
          error: (error) => {
            this.showNotification(`Erreur: ${error.message}`, 'error');
          },
        });
      }
    });
  }

  toggleTaskStatus(): void {
    const currentTask = this.task();
    if (!currentTask) return;
    currentTask.completed = !currentTask.completed;
    // Appeler l'API pour changer le statut
    this.taskService.updateTask(currentTask.id, currentTask).subscribe({
      next: (updatedTask) => {
        this.task.set(updatedTask);
        const message = updatedTask.completed
          ? 'Tâche marquée comme terminée'
          : 'Tâche marquée comme en cours';
        this.showNotification(message);
      },
      error: (error) => {
        this.showNotification(`Erreur: ${error.message}`, 'error');
      },
    });
  }

  deleteTask(): void {
    const currentTask = this.task();
    if (!currentTask) return;

    const snackBarRef = this.snackBar.open(`Supprimer "${currentTask.label}" ?`, 'Confirmer', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    snackBarRef.onAction().subscribe(() => {
      // Supprimer la tâche via l'API
      this.taskService.deleteTask(currentTask.id).subscribe({
        next: () => {
          this.showNotification('Tâche supprimée');
          this.goBack();
        },
        error: (error) => {
          this.showNotification(`Erreur: ${error.message}`, 'error');
        },
      });
    });
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success'],
    });
  }
}
