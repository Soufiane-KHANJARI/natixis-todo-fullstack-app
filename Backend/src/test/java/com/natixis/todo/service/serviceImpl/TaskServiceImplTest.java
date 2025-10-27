package com.natixis.todo.service.serviceImpl;

import com.natixis.todo.dto.TaskDto;
import com.natixis.todo.entity.Task;
import com.natixis.todo.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskServiceImpl;

    private Task task1;
    private Task task2;
    private TaskDto dto1;
    private TaskDto dto2;

    @BeforeEach
    void setUp() {
        task1 = new Task(1, "Task One", "First Task", false);
        task2 = new Task(2, "Task Two", "Second Task", true);

        dto1 = new TaskDto(1, "Task One", "First Task", false);
        dto2 = new TaskDto(2, "Task Two", "Second Task", true);
    }

    @Test
    void testGetAll_success() {
        // Given
        when(taskRepository.findAll(Pageable.ofSize(2))).thenReturn(new PageImpl<>(List.of(task1,task2), Pageable.ofSize(2), 2));

        // When
        var result = taskServiceImpl.getAll(Pageable.ofSize(2));

        // Then
        verify(taskRepository).findAll(Pageable.ofSize(2));
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(dto1, result.get(0));
        assertEquals(dto2, result.get(1));
    }

    @Test
    void testGetById_success() {
        // Given
        when(taskRepository.findById(1)).thenReturn(Optional.of(task1));

        // When
        var result = taskServiceImpl.getById(1);

        // Then
        verify(taskRepository).findById(1);
        assertNotNull(result);
        assertEquals(dto1, result);
    }

    @Test
    void testGetById_notFound() {
        // Given
        when(taskRepository.findById(99)).thenReturn(Optional.empty());

        // When / Then
        var exception = assertThrows(RuntimeException.class,
                () -> taskServiceImpl.getById(99));

        assertEquals("Task not found", exception.getMessage());
        verify(taskRepository).findById(99);
    }

    @Test
    void testAdd_success() {
        // Given
        when(taskRepository.save(any(Task.class))).thenReturn(task1);

        // When
        var result = taskServiceImpl.add(dto1);

        // Then
        verify(taskRepository).save(any(Task.class));
        assertNotNull(result);
        assertEquals(dto1, result);
    }

    @Test
    void testGetByStatus_success() {
        // Given
        when(taskRepository.findByCompleted(true)).thenReturn(List.of(task2));

        // When
        var result = taskServiceImpl.getByStatus(true);

        // Then
        verify(taskRepository).findByCompleted(true);
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(dto2, result.get(0));
    }

    @Test
    void testUpdate_success() {
        // Given
        when(taskRepository.findById(1)).thenReturn(Optional.of(task1));
        when(taskRepository.save(any(Task.class))).thenReturn(
                new Task(1, "Updated Task", "Updated Description", true)
        );

        var updateDto = new TaskDto(1, "Updated Task", "Updated Description", true);

        // When
        var result = taskServiceImpl.update(1, updateDto);

        // Then
        verify(taskRepository).findById(1);
        verify(taskRepository).save(any(Task.class));
        assertNotNull(result);
        assertEquals(updateDto, result);
    }

    @Test
    void testUpdate_notFound() {
        // Given
        when(taskRepository.findById(10)).thenReturn(Optional.empty());

        // When / Then
        var exception = assertThrows(RuntimeException.class,
                () -> taskServiceImpl.update(10, dto1));

        assertEquals("Task not found", exception.getMessage());
        verify(taskRepository).findById(10);
    }

    @Test
    void testUpdateStatus_success() {
        // Given
        when(taskRepository.findById(1)).thenReturn(Optional.of(task1));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        var result = taskServiceImpl.updateStatus(1, true);

        // Then
        verify(taskRepository).findById(1);
        verify(taskRepository).save(any(Task.class));
        assertNotNull(result);
        assertEquals(1, result.id());
        assertTrue(result.completed());
    }

    @Test
    void testUpdateStatus_notFound() {
        // Given
        when(taskRepository.findById(99)).thenReturn(Optional.empty());

        // When / Then
        var exception = assertThrows(RuntimeException.class,
                () -> taskServiceImpl.updateStatus(99, true));

        assertEquals("Tâche non trouvée avec id : 99", exception.getMessage());
        verify(taskRepository).findById(99);
        verify(taskRepository, never()).save(any(Task.class));
    }
    
    @Test
    void testDelete_success() {
        // When
        taskServiceImpl.delete(1);

        // Then
        verify(taskRepository).deleteById(1);
    }
}
