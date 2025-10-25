package com.natixis.todo.repository;

import com.natixis.todo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByCompleted(Boolean completed);
}
