import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes =  [
  { path: '', loadChildren: () => import('./task/task-module').then(m => m.TaskModule) },
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    children: [
      {
        path: '',
        loadComponent: () => import('./task/components/task-list/task-list.component')
          .then(m => m.TaskListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./task/components/task-detail/task-detail.component')
          .then(m => m.TaskDetailComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/tasks'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
