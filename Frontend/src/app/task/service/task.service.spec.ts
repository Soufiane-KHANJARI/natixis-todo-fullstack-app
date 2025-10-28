import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../model/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api/v1/tasks';

  const mockTasks: Task[] = [
    { id: '1', label: 'Task 1', description: 'Description 1', completed: false },
    { id: '2', label: 'Task 2', description: 'Description 2', completed: true },
    { id: '3', label: 'Task 3', description: 'Description 3', completed: false },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);

    // Intercepter la requête du constructor
    const constructorReq = httpMock.expectOne(apiUrl);
    constructorReq.flush([]);
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', () => {
      service.getAllTasks().subscribe((tasks) => {
        expect(tasks.length).toBe(3);
        expect(tasks).toEqual(mockTasks);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTasks);
    });

    it('should handle error when API fails', () => {
      service.getAllTasks().subscribe({
        next: () => fail('should have failed with error'),
        error: (error) => {
          expect(error.message).toContain('Erreur serveur');
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getTaskById', () => {
    it('should return a single task', () => {
      const taskId = '1';
      const expectedTask = mockTasks[0];

      service.getTaskById(taskId).subscribe((task) => {
        expect(task).toEqual(expectedTask);
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedTask);
    });
  });

  describe('createTask', () => {
    it('should create a new task', () => {
      const newTask: Omit<Task, 'id'> = {
        label: 'New Task',
        description: 'New Description',
        completed: false,
      };

      const createdTask: Task = { id: '4', ...newTask };

      service.createTask(newTask).subscribe((task) => {
        expect(task).toEqual(createdTask);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(createdTask);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', () => {
      const taskId = '1';
      const updatedTask: Task = {
        id: '1',
        label: 'Updated Task',
        description: 'Updated Description',
        completed: true,
      };

      service.updateTask(taskId, updatedTask).subscribe((task) => {
        expect(task).toEqual(updatedTask);
      });

      const req = httpMock.expectOne(`${apiUrl}/${taskId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedTask);
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      service['_tasks'].set(mockTasks);
    });

    it('should return active tasks', () => {
      const activeTasks = service.getActiveTasks();
      expect(activeTasks.length).toBe(2);
    });

    it('should return completed tasks', () => {
      const completedTasks = service.getCompletedTasks();
      expect(completedTasks.length).toBe(1);
    });

    it('should return total count', () => {
      expect(service.getTotalCount()).toBe(3);
    });
  });
});
