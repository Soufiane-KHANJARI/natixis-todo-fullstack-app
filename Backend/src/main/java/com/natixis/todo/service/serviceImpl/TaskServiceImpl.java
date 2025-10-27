package com.natixis.todo.service.serviceImpl;

import com.natixis.todo.dto.TaskDto;
import com.natixis.todo.entity.Task;
import com.natixis.todo.mapper.TaskMapper;
import com.natixis.todo.repository.TaskRepository;
import com.natixis.todo.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    @Override
    public List<TaskDto> getAll() {
        return taskRepository.findAll()
                .stream()
                .map(taskMapper::entityToDto)
                .toList();
    }

    @Override
    public TaskDto getById(Integer id) {
        return taskRepository.findById(id)
                .map(taskMapper::entityToDto)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public TaskDto add(TaskDto taskDto) {
        Task task = taskMapper.dtoToEntity(taskDto);
        return taskMapper.entityToDto(taskRepository.save(task));
    }

    @Override
    public List<TaskDto> getByStatus(Boolean completed) {
        return taskRepository.findByCompleted(completed)
                .stream()
                .map(taskMapper::entityToDto)
                .toList();
    }

    @Override
    public TaskDto update(Integer id, TaskDto taskDto) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        existingTask.setLabel(taskDto.label());
        existingTask.setDescription(taskDto.description());
        existingTask.setCompleted(taskDto.completed());

        Task updated = taskRepository.save(existingTask);
        return taskMapper.entityToDto(updated);
    }

    @Override
    public TaskDto updateStatus(Integer id, Boolean completed) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée avec id : " + id));

        task.setCompleted(completed);
        Task updated = taskRepository.save(task);

        return taskMapper.entityToDto(updated);
    }

    @Override
    public void delete(Integer id) {
        taskRepository.deleteById(id);
    }
}
