package com.natixis.todo.mapper;

import com.natixis.todo.dto.TaskDto;
import com.natixis.todo.entity.Task;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    TaskDto entityToDto(Task task);

    Task dtoToEntity(TaskDto taskDto);
}
