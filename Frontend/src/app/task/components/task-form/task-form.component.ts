import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../model/task.model';

interface DialogData {
  mode: 'create' | 'edit';
  task?: Task;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TaskFormComponent>);
  private data = inject<DialogData>(MAT_DIALOG_DATA);

  isEditMode = signal<boolean>(false);
  taskForm!: FormGroup;

  ngOnInit(): void {
    this.isEditMode.set(this.data.mode === 'edit');
    this.initializeForm();
  }

  private initializeForm(): void {
    const task = this.data.task;

    this.taskForm = this.fb.group({
      label: [
        task?.label || '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      ],
      description: [task?.description || '', [Validators.maxLength(500)]],
      completed: [task?.completed || false],
    });
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      const taskData: Task = this.taskForm.value;
      this.dialogRef.close(taskData);
    }
  }
}
