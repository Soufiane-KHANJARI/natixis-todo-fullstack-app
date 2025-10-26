package com.natixis.todo.repository;

import com.natixis.todo.entity.Task;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@DataJpaTest
class TaskRepositoryTest {
    @Autowired
    private TaskRepository taskRepository;
    @Test
    void testFindByCompleted() {
        List<Task> tasks = taskRepository.findByCompleted(false);
        //Then
        assertNotNull(tasks, "The returned task list should not be null");
        assertFalse(tasks.isEmpty(), "The returned task list should not be empty");

        assertTrue(tasks.stream().allMatch(task -> !task.getCompleted()),
                "All tasks should have completed = false");

    }



}