import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../material/material-module';
import { CommonModule } from '@angular/common';

interface Task {
  id: number;
  label: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports:[MaterialModule,CommonModule]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [
    {
      id: 1,
      label: 'Développer l\'interface utilisateur',
      description: 'Créer les composants Angular pour la liste et les détails des tâches',
      completed: false
    },
    {
      id: 2,
      label: 'Configurer le routing',
      description: 'Mettre en place les routes pour naviguer entre les différentes vues',
      completed: true
    },
    {
      id: 3,
      label: 'Implémenter le service de tâches',
      description: 'Créer un service pour gérer les opérations CRUD sur les tâches',
      completed: false
    },
    {
      id: 4,
      label: 'Ajouter les tests unitaires',
      description: 'Écrire les tests pour valider le bon fonctionnement de l\'application',
      completed: false
    }
  ];

  filteredTasks: Task[] = [];
  filterStatus: 'all' | 'completed' | 'pending' = 'all';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    switch (this.filterStatus) {
      case 'completed':
        this.filteredTasks = this.tasks.filter(task => task.completed);
        break;
      case 'pending':
        this.filteredTasks = this.tasks.filter(task => !task.completed);
        break;
      default:
        this.filteredTasks = [...this.tasks];
    }
  }

  onFilterChange(status: 'all' | 'completed' | 'pending'): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  toggleTaskStatus(task: Task): void {
    task.completed = !task.completed;
    this.applyFilter();
  }

  viewTaskDetail(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }

  getCompletedCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  getPendingCount(): number {
    return this.tasks.filter(task => !task.completed).length;
  }
}