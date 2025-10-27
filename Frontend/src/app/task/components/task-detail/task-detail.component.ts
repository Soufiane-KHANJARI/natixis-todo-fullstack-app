import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Services et Models


// Components
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskService } from '../../service/task.service';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  task = signal<Task | null>(null);

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    
    if (taskId) {
      this.loadTask(taskId);
    } else {
      this.showNotification('ID de tâche manquant');
      this.goBack();
    }
  }

  private loadTask(taskId: string): void {
    const task = this.taskService.getTaskById(taskId);
    
    if (task) {
      this.task.set(task);
    } else {
      this.showNotification('Tâche introuvable');
      this.goBack();
    }
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
      data: { mode: 'edit', task: currentTask }
    });

    dialogRef.afterClosed().subscribe((result: Task | undefined) => {
      if (result) {
        this.taskService.updateTask(result);
        this.task.set(result);
        this.showNotification('Tâche modifiée avec succès');
      }
    });
  }

  toggleTaskStatus(): void {
    const currentTask = this.task();
    if (!currentTask) return;

    const updatedTask = { ...currentTask, completed: !currentTask.completed };
    this.taskService.updateTask(updatedTask);
    this.task.set(updatedTask);

    const message = updatedTask.completed 
      ? 'Tâche marquée comme terminée' 
      : 'Tâche marquée comme en cours';
    this.showNotification(message);
  }

  deleteTask(): void {
    const currentTask = this.task();
    if (!currentTask) return;

    const snackBarRef = this.snackBar.open(
      `Supprimer "${currentTask.label}" ?`,
      'Confirmer',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.taskService.deleteTask(currentTask.id);
      this.showNotification('Tâche supprimée');
      this.goBack();
    });
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}