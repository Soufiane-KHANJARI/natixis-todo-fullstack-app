import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TaskService } from '../../service/task.service';
import { Task } from '../../model/task.model';

import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCheckboxModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  taskcomp!: Task;
  filterStatus = signal<'all' | 'active' | 'completed'>('all');

  tasks = this.taskService.tasks;

  totalTasks = computed(() => this.tasks().length);
  activeTasks = computed(() => this.tasks().filter((task) => !task.completed).length);
  completedTasks = computed(() => this.tasks().filter((task) => task.completed).length);

  filteredTasks = computed(() => {
    let tasks = this.tasks();
    const filter = this.filterStatus();

    if (filter === 'active') {
      tasks = tasks.filter((task) => !task.completed);
    } else if (filter === 'completed') {
      tasks = tasks.filter((task) => task.completed);
    }

    return tasks;
  });

  ngOnInit(): void {
    // Charger les tâches au démarrage
    console.log('2');
    this.taskService.loadAllTasks();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result: Task | undefined) => {
      if (result) {
        // Créer la tâche via l'API
        this.taskService.createTask(result).subscribe({
          next: () => {
            this.showNotification('Tâche créée avec succès !');
          },
          error: (error) => {
            this.showNotification(`Erreur: ${error.message}`, 'error');
          },
        });
      }
    });
  }

  viewTaskDetail(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  goToDetail(): void {
    if (this.tasks().length > 0) {
      this.viewTaskDetail(this.tasks()[0].id);
    }
  }

  toggleTaskStatus(taskId: string) {
    this.taskService.getTaskById(taskId).subscribe((data) => {
      data.completed = !data.completed;
      this.taskService.updateTask(taskId, data).subscribe({
        next: (updatedTask) => {
          const message = updatedTask.completed
            ? 'Tâche marquée comme terminée'
            : 'Tâche marquée comme en cours';
          this.showNotification(message);
        },
        error: (error) => {
          this.showNotification(`Erreur: ${error.message}`, 'error');
        },
      });
    });
    console.log(this.taskcomp);
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
