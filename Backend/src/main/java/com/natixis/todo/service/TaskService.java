package com.natixis.todo.service;

import com.natixis.todo.dto.TaskDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TaskService {
    List<TaskDto> getAll(Pageable pageable);
    TaskDto getById(Integer id);
    TaskDto add(TaskDto taskDto);
    List<TaskDto> getByStatus(Boolean completed);
    TaskDto update(Integer id, TaskDto taskDto);
    TaskDto updateStatus(Integer id, Boolean completed);
    void delete(Integer id);

}
