package com.natixis.todo.service;

import com.natixis.todo.dto.TaskDto;

import java.util.List;

public interface TaskService {
    List<TaskDto> getAllTasks();
    TaskDto getTaskById(Integer id);
    TaskDto addTask(TaskDto taskDto);
    List<TaskDto> getTasksByStatus(Boolean completed);
    TaskDto updateTask(Integer id, TaskDto taskDto);
    void deleteTask(Integer id);

}
