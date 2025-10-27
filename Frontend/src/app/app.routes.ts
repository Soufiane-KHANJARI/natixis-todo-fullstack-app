import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirection par défaut
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  
  // Liste des tâches
  {
    path: 'tasks',
    loadComponent: () => import('./task/components/task-list/task-list.component')
      .then(m => m.TaskListComponent),
    title: 'Mes Tâches'
  },
  
  // Détail d'une tâche (avec paramètre :id)
  {
    path: 'tasks/:id',
    loadComponent: () => import('./task/components/task-detail/task-detail.component')
      .then(m => m.TaskDetailComponent),
    title: 'Détail de la tâche'
  },
  
  // Page 404 - redirection vers la liste
  {
    path: '**',
    redirectTo: '/tasks'
  }
];