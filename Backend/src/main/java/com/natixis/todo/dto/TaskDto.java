package com.natixis.todo.dto;


public record TaskDto(Integer id, String label, String description, Boolean completed) {
}
