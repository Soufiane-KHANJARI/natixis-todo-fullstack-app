package com.natixis.todo.mapper;

import com.natixis.todo.dto.TaskDto;
import com.natixis.todo.entity.Task;
import org.mapstruct.Mapper;
import org.springframework.web.bind.annotation.Mapping;

import static java.util.Objects.requireNonNull;
//@Component
@Mapper( componentModel = "spring")
public interface TaskMapper {

    public static TaskDto entityToDto(Task task){
        requireNonNull(task, "task entity should not be null!");
        TaskDto taskDto;
        return  taskDto= new TaskDto(
                task.getId(),
                task.getLabel(),
                task.getDescription(),
                task.getCompleted()
        );
    }

    public static Task dtoToEntity(TaskDto taskDto){
        requireNonNull(taskDto, "taskDto should not be null!");
        Task task = new Task();
                task.setId(taskDto.id());
                task.setLabel(taskDto.label());
                task.setDescription(taskDto.description());
                task.setCompleted(taskDto.completed());

        return  task;
    }
}
