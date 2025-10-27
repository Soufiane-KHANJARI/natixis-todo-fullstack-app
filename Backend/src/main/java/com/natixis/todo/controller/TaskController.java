package com.natixis.todo.controller;

import com.natixis.todo.dto.TaskDto;
import com.natixis.todo.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tasks")
@CrossOrigin("*")
@Tag(name = "Tâches", description = "Gestion des tâches à faire")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Operation(
            summary = "Récupérer toutes les tâches",
            description = "Retourne la liste complète des tâches enregistrées.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Liste des tâches récupérée avec succès",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = TaskDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
            }
    )
    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAll());
    }

    @Operation(
            summary = "Récupérer une tâche par ID",
            description = "Permet de consulter une tâche spécifique en utilisant son identifiant unique.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Tâche trouvée",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = TaskDto.class)
                            )
                    ),
                    @ApiResponse(responseCode = "404", description = "Tâche introuvable")
            }
    )
    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Integer id){
        return ResponseEntity.ok(taskService.getById(id));
    }

    @Operation(
            summary = "Créer une nouvelle tâche",
            description = "Ajoute une nouvelle tâche dans la base de données.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Tâche créée avec succès"),
                    @ApiResponse(responseCode = "400", description = "Données invalides fournies")
            }
    )
    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto){
        return ResponseEntity.ok(taskService.add(taskDto));
    }

    @Operation(
            summary = "Lister les tâches selon leur statut",
            description = "Filtre les tâches par leur état (terminée ou non terminée).",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Liste filtrée récupérée avec succès")
            }
    )
    @GetMapping("/status")
    public ResponseEntity<List<TaskDto>> getTasksByStatus(@RequestParam Boolean completed) {
        return ResponseEntity.ok(taskService.getByStatus(completed));
    }

    @Operation(
            summary = "Mettre à jour une tâche",
            description = "Modifie les propriétés d'une tâche existante selon son ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Tâche mise à jour avec succès"),
                    @ApiResponse(responseCode = "404", description = "Tâche non trouvée")
            }
    )
    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable Integer id,
            @RequestBody TaskDto taskDto) {
        return ResponseEntity.ok(taskService.update(id, taskDto));
    }

    @Operation(
            summary = "Changer le statut d'une tâche",
            description = "Mettre à jour l'attribut completed d'une tâche spécifique.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Tâche mise à jour avec succès"),
                    @ApiResponse(responseCode = "404", description = "Tâche non trouvée")
            }
    )
    @PatchMapping("/{id}/{completed}")
    public ResponseEntity<TaskDto> updateStatus(
            @PathVariable Integer id,
            @PathVariable Boolean completed) {

        TaskDto updated = taskService.updateStatus(id, completed);
        return ResponseEntity.ok(updated);
    }

    @Operation(
            summary = "Supprimer une tâche",
            description = "Supprime une tâche existante de la base de données.",
            responses = {
                    @ApiResponse(responseCode = "204", description = "Tâche supprimée avec succès"),
                    @ApiResponse(responseCode = "404", description = "Tâche introuvable")
            }
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
