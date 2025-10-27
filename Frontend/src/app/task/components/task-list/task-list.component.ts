import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Services


// Components
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskService } from '../../service/task.service';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  filterStatus = signal<'all' | 'active' | 'completed'>('all');
  
  tasks = this.taskService.tasks;

  totalTasks = computed(() => this.tasks().length);
  activeTasks = computed(() => this.tasks().filter(task => !task.completed).length);
  completedTasks = computed(() => this.tasks().filter(task => task.completed).length);

  filteredTasks = computed(() => {
    let tasks = this.tasks();
    const filter = this.filterStatus();

    if (filter === 'active') {
      tasks = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
      tasks = tasks.filter(task => task.completed);
    }

    return tasks;
  });

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe((result: Task | undefined) => {
      if (result) {
        this.taskService.addTask(result);
        this.showNotification('Tâche créée avec succès !');
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

  toggleTaskStatus(taskId: string): void {
    const task = this.taskService.getTaskById(taskId);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      this.taskService.updateTask(updatedTask);
      
      const message = updatedTask.completed 
        ? 'Tâche marquée comme terminée' 
        : 'Tâche marquée comme en cours';
      this.showNotification(message);
    }
  }

  private showNotification(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}