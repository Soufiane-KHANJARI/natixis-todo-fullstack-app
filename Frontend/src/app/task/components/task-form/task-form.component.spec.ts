import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TaskFormComponent } from './task-form.component';
import { Task } from '../../model/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TaskFormComponent>>;

  const mockTask: Task = {
    id: '1',
    label: 'Test Task',
    description: 'Test Description',
    completed: false
  };

  function setupComponent(mode: 'create' | 'edit', task?: Task) {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [
        TaskFormComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { mode, task } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  describe('Create Mode', () => {
    beforeEach(() => {
      setupComponent('create');
    });

    it('should create in create mode', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode()).toBe(false);
    });

    it('should initialize form with empty values', () => {
      expect(component.taskForm.value).toEqual({
        label: '',
        description: '',
        completed: false
      });
    });

    it('should have invalid form when label is empty', () => {
      expect(component.taskForm.valid).toBe(false);
      expect(component.taskForm.get('label')?.errors?.['required']).toBeTruthy();
    });

    it('should have valid form with valid data', () => {
      component.taskForm.patchValue({
        label: 'New Task',
        description: 'New Description'
      });

      expect(component.taskForm.valid).toBe(true);
    });

    it('should validate label min length', () => {
      component.taskForm.patchValue({ label: 'Ab' });
      expect(component.taskForm.get('label')?.errors?.['minlength']).toBeTruthy();

      component.taskForm.patchValue({ label: 'Abc' });
      expect(component.taskForm.get('label')?.errors?.['minlength']).toBeFalsy();
    });

    it('should validate label max length', () => {
      const longLabel = 'a'.repeat(101);
      component.taskForm.patchValue({ label: longLabel });
      expect(component.taskForm.get('label')?.errors?.['maxlength']).toBeTruthy();

      const validLabel = 'a'.repeat(100);
      component.taskForm.patchValue({ label: validLabel });
      expect(component.taskForm.get('label')?.errors?.['maxlength']).toBeFalsy();
    });

    it('should validate description max length', () => {
      const longDesc = 'a'.repeat(501);
      component.taskForm.patchValue({ description: longDesc });
      expect(component.taskForm.get('description')?.errors?.['maxlength']).toBeTruthy();
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      setupComponent('edit', mockTask);
    });

    it('should create in edit mode', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode()).toBe(true);
    });

    it('should initialize form with task data', () => {
      expect(component.taskForm.value).toEqual({
        label: mockTask.label,
        description: mockTask.description,
        completed: mockTask.completed
      });
    });

    it('should have valid form with existing task data', () => {
      expect(component.taskForm.valid).toBe(true);
    });
  });

  describe('saveTask', () => {
    beforeEach(() => {
      setupComponent('create');
    });

    it('should close dialog with form data when valid', () => {
      const taskData = {
        label: 'New Task',
        description: 'New Description',
        completed: false
      };

      component.taskForm.patchValue(taskData);
      component.saveTask();

      expect(dialogRefSpy.close).toHaveBeenCalledWith(taskData);
    });

    it('should not close dialog when form is invalid', () => {
      component.taskForm.patchValue({ label: '' }); // Invalid
      component.saveTask();

      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });
  });
});