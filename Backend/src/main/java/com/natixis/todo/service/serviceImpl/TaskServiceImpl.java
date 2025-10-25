package com.natixis.todo.service.serviceImpl;

import com.natixis.todo.dto.TaskDto;
import com.natixis.todo.entity.Task;
import com.natixis.todo.mapper.TaskMapper;
import com.natixis.todo.repository.TaskRepository;
import com.natixis.todo.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(TaskMapper::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDto getTaskById(Integer id) {
        return taskRepository.findById(id)
                .map(TaskMapper::entityToDto)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public TaskDto addTask(TaskDto taskDto) {
        Task task = TaskMapper.dtoToEntity(taskDto);
        return TaskMapper.entityToDto(taskRepository.save(task));
    }

    @Override
    public List<TaskDto> getTasksByStatus(Boolean completed) {
        return taskRepository.findByCompleted(completed)
                .stream()
                .map(TaskMapper::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDto updateTask(Integer id, TaskDto taskDto) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        existingTask.setLabel(taskDto.label());
        existingTask.setDescription(taskDto.description());
        existingTask.setCompleted(taskDto.completed());

        Task updated = taskRepository.save(existingTask);
        return TaskMapper.entityToDto(updated);
    }

    @Override
    public void deleteTask(Integer id) {
        taskRepository.deleteById(id);
    }
}
