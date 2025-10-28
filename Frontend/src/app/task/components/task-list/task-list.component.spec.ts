import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../service/task.service';
import { Task } from '../../model/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockTasks: Task[] = [
    { id: '1', label: 'Task 1', description: 'Description 1', completed: false },
    { id: '2', label: 'Task 2', description: 'Description 2', completed: true },
    { id: '3', label: 'Task 3', description: 'Description 3', completed: false },
  ];

  beforeEach(async () => {
    const tasksSignal = signal<Task[]>(mockTasks);

    taskServiceSpy = jasmine.createSpyObj(
      'TaskService',
      ['loadAllTasks', 'createTask', 'getTaskById', 'updateTask'],
      {
        tasks: tasksSignal.asReadonly(),
      }
    );

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, NoopAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load tasks on init', () => {
      component.ngOnInit();
      expect(taskServiceSpy.loadAllTasks).toHaveBeenCalled();
    });
  });

  describe('computed signals', () => {
    it('should calculate total tasks correctly', () => {
      expect(component.totalTasks()).toBe(3);
    });

    it('should calculate active tasks correctly', () => {
      expect(component.activeTasks()).toBe(2);
    });

    it('should calculate completed tasks correctly', () => {
      expect(component.completedTasks()).toBe(1);
    });
  });

  describe('filterStatus', () => {
    it('should show all tasks when filter is "all"', () => {
      component.filterStatus.set('all');
      expect(component.filteredTasks().length).toBe(3);
    });

    it('should show only active tasks when filter is "active"', () => {
      component.filterStatus.set('active');
      const filtered = component.filteredTasks();
      expect(filtered.length).toBe(2);
      expect(filtered.every((t) => !t.completed)).toBe(true);
    });

    it('should show only completed tasks when filter is "completed"', () => {
      component.filterStatus.set('completed');
      const filtered = component.filteredTasks();
      expect(filtered.length).toBe(1);
      expect(filtered.every((t) => t.completed)).toBe(true);
    });

    it('should update filtered tasks when filter changes', () => {
      component.filterStatus.set('all');
      expect(component.filteredTasks().length).toBe(3);

      component.filterStatus.set('active');
      expect(component.filteredTasks().length).toBe(2);

      component.filterStatus.set('completed');
      expect(component.filteredTasks().length).toBe(1);
    });
  });

  describe('viewTaskDetail', () => {
    it('should navigate to task detail page with correct id', () => {
      const taskId = '1';
      component.viewTaskDetail(taskId);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks', taskId]);
    });

    it('should navigate to different task ids', () => {
      component.viewTaskDetail('1');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks', '1']);

      component.viewTaskDetail('2');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks', '2']);
    });
  });

  describe('goToDetail', () => {
    it('should navigate to first task detail when tasks exist', () => {
      component.goToDetail();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks', '1']);
    });

    it('should not navigate when no tasks exist', () => {
      // Créer un signal vide
      const emptyTasksSignal = signal<Task[]>([]);
      Object.defineProperty(component, 'tasks', {
        get: () => emptyTasksSignal.asReadonly(),
        configurable: true,
      });

      component.goToDetail();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('integration tests', () => {
    it('should correctly filter and count tasks', () => {
      // Test initial state
      expect(component.totalTasks()).toBe(3);
      expect(component.activeTasks()).toBe(2);
      expect(component.completedTasks()).toBe(1);

      component.filterStatus.set('all');
      expect(component.filteredTasks().length).toBe(3);

      component.filterStatus.set('active');
      expect(component.filteredTasks().length).toBe(2);
      expect(component.filteredTasks().every((t) => !t.completed)).toBe(true);

      component.filterStatus.set('completed');
      expect(component.filteredTasks().length).toBe(1);
      expect(component.filteredTasks().every((t) => t.completed)).toBe(true);
    });
  });
});
