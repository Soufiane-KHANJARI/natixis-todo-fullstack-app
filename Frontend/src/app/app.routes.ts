import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    loadComponent: () => import('./task/components/task-list/task-list.component')
      .then(m => m.TaskListComponent)
  },
  {
    path: 'tasks/:id',
    loadComponent: () => import('./task/components/task-detail/task-detail.component')
      .then(m => m.TaskDetailComponent)
  },
  {
    path: '**',
    redirectTo: '/tasks'
  }
];