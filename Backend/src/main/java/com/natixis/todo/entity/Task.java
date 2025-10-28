package com.natixis.todo.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "tasks")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(
            name = "label",
            nullable = false,
            length = 200
    )
    private String label;
    @Column(
            name = "description",
            length = 500
    )
    private String description;
    @Column(
            name = "completed"
    )
    private Boolean completed = false;
}
