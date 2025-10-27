package com.natixis.todo.controller;

import com.natixis.todo.dto.TaskDto;
import com.natixis.todo.service.TaskService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @MockitoBean
    private TaskService taskService;

    @Autowired
    private MockMvc mockMvc;

    private final TaskDto dto1 = new TaskDto(1, "Task One", "Description One", false);
    private final TaskDto dto2 = new TaskDto(2, "Task Two", "Description Two", true);

    @Test
    void getAllTasks_shouldReturnListOfTasks() throws Exception {
        // Given
        when(taskService.getAll(Pageable.ofSize(2))).thenReturn(List.of(dto1, dto2));

        // When / Then
        mockMvc.perform(get("/api/v1/tasks?size=2")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].label").value("Task One"))
                .andExpect(jsonPath("$[1].completed").value(true));
    }

    @Test
    void getTaskById_shouldReturnSingleTask() throws Exception {
        // Given
        when(taskService.getById(1)).thenReturn(dto1);

        // When / Then
        mockMvc.perform(get("/api/v1/tasks/{id}", 1)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.label").value("Task One"))
                .andExpect(jsonPath("$.completed").value(false));
    }

    @Test
    void createTask_shouldReturnCreatedTask() throws Exception {
        // Given
        when(taskService.add(any(TaskDto.class))).thenReturn(dto1);

        var json = """
                {
                  "label": "Task One",
                  "description": "Description One",
                  "completed": false
                }
                """;

        // When / Then
        mockMvc.perform(post("/api/v1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.label").value("Task One"));
    }

    @Test
    void getTasksByStatus_shouldReturnFilteredTasks() throws Exception {
        // Given
        when(taskService.getByStatus(true)).thenReturn(List.of(dto2));

        // When / Then
        mockMvc.perform(get("/api/v1/tasks/status?completed=true", true)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].completed").value(true));
    }

    @Test
    void updateTask_shouldReturnUpdatedTask() throws Exception {
        // Given
        var updatedDto = new TaskDto(1, "Updated Task", "Updated Description", true);
        when(taskService.update(eq(1), any(TaskDto.class))).thenReturn(updatedDto);

        var json = """
                {
                  "id": 1,
                  "label": "Updated Task",
                  "description": "Updated Description",
                  "completed": true
                }
                """;

        // When / Then
        mockMvc.perform(put("/api/v1/tasks/{id}", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.label").value("Updated Task"))
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    void updateStatus_shouldReturnUpdatedTask() throws Exception {
        // Given
        var updatedDto = new TaskDto(1, "Task One", "Description One", true);
        when(taskService.updateStatus(eq(1), eq(true))).thenReturn(updatedDto);

        var json = """
            {
              "completed": true
            }
            """;

        // When / Then
        mockMvc.perform(patch("/api/v1/tasks/{id}/completed", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.label").value("Task One"))
                .andExpect(jsonPath("$.completed").value(true));
    }

    @Test
    void deleteTask_shouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(taskService).delete(1);

        // When / Then
        mockMvc.perform(delete("/api/v1/tasks/{id}", 1))
                .andExpect(status().isNoContent());

        Mockito.verify(taskService).delete(1);
    }
}
