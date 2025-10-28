import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { of, throwError, EMPTY } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TaskDetailComponent } from './task-detail.component';
import { TaskService } from '../../service/task.service';
import { Task } from '../../model/task.model';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let activatedRouteSpy: any;

  const mockTask: Task = {
    id: '1',
    label: 'Task 1',
    description: 'Description 1',
    completed: false,
  };

  beforeEach(async () => {
    // Créer les spies
    taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTaskById',
      'updateTask',
      'deleteTask',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    // Mock ActivatedRoute
    activatedRouteSpy = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent, NoopAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load task on init with valid id', () => {
      taskServiceSpy.getTaskById.and.returnValue(of(mockTask));

      fixture.detectChanges(); // Déclenche ngOnInit

      expect(activatedRouteSpy.snapshot.paramMap.get).toHaveBeenCalledWith('id');
      expect(taskServiceSpy.getTaskById).toHaveBeenCalledWith('1');
      expect(component.task()).toEqual(mockTask);
    });

    it('should call loadTask with correct taskId', () => {
      spyOn<any>(component, 'loadTask');
      activatedRouteSpy.snapshot.paramMap.get.and.returnValue('123');

      component.ngOnInit();

      expect(component['loadTask']).toHaveBeenCalledWith('123');
    });
  });

  describe('loadTask', () => {
    it('should set task signal on successful load', () => {
      taskServiceSpy.getTaskById.and.returnValue(of(mockTask));

      component['loadTask']('1');

      expect(taskServiceSpy.getTaskById).toHaveBeenCalledWith('1');
      expect(component.task()).toEqual(mockTask);
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      taskServiceSpy.getTaskById.and.returnValue(of(mockTask));
      fixture.detectChanges();
    });

    it('should navigate back to tasks list when goBack is called', () => {
      component.goBack();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
    });

    it('should navigate to tasks list when goToList is called', () => {
      component.goToList();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
    });

    it('should navigate using the same route for both goBack and goToList', () => {
      component.goBack();
      const goBackCall = routerSpy.navigate.calls.first().args;

      routerSpy.navigate.calls.reset();

      component.goToList();
      const goToListCall = routerSpy.navigate.calls.first().args;

      expect(goBackCall).toEqual(goToListCall);
    });
  });

  describe('openEditDialog', () => {
    beforeEach(() => {
      taskServiceSpy.getTaskById.and.returnValue(of(mockTask));
      fixture.detectChanges();
    });

    it('should not open dialog when task is null', () => {
      component.task.set(null);

      component.openEditDialog();

      expect(dialogSpy.open).not.toHaveBeenCalled();
    });
  });

  describe('toggleTaskStatus', () => {
    beforeEach(() => {
      taskServiceSpy.getTaskById.and.returnValue(of(mockTask));
      fixture.detectChanges();
    });

    it('should not toggle when task is null', () => {
      component.task.set(null);

      component.toggleTaskStatus();

      expect(taskServiceSpy.updateTask).not.toHaveBeenCalled();
    });

    it('should mutate the task object before calling updateTask', () => {
      const task = { ...mockTask, completed: false };
      component.task.set(task);

      taskServiceSpy.updateTask.and.returnValue(of({ ...task, completed: true }));

      component.toggleTaskStatus();

      // Vérifier que la tâche a été mutée avant l'appel API
      expect(taskServiceSpy.updateTask).toHaveBeenCalledWith(
        '1',
        jasmine.objectContaining({ completed: true })
      );
    });
  });

  describe('deleteTask', () => {
    beforeEach(() => {
      taskServiceSpy.getTaskById.and.returnValue(of(mockTask));
      fixture.detectChanges();
    });

    it('should not delete when task is null', () => {
      component.task.set(null);

      component.deleteTask();

      expect(snackBarSpy.open).not.toHaveBeenCalled();
      expect(taskServiceSpy.deleteTask).not.toHaveBeenCalled();
    });
  });

  describe('task signal', () => {
    it('should initialize task signal as null', () => {
      expect(component.task()).toBeNull();
    });

    it('should update task signal when loadTask succeeds', () => {
      taskServiceSpy.getTaskById.and.returnValue(of(mockTask));

      component['loadTask']('1');

      expect(component.task()).toEqual(mockTask);
    });

    it('should keep task as null when loadTask fails', () => {
      const error = new Error('Load failed');
      taskServiceSpy.getTaskById.and.returnValue(throwError(() => error));

      component['loadTask']('1');

      expect(component.task()).toBeNull();
    });
  });
});
