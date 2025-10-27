import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../model/task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  task?: Task;
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTask();
  }

  /**
   * Charge les détails de la tâche
   */
  private loadTask(): void {
    const taskId = Number(this.route.snapshot.paramMap.get('id'));

    // Simuler un chargement (à remplacer par un appel au service)
    setTimeout(() => {
      // Données de démonstration - à remplacer par un appel au service
      const tasks: Task[] = [
        {
          id: 1,
          label: 'Préparer la présentation client',
          description: 'Créer une présentation PowerPoint pour le client ABC avec les résultats du Q4. Inclure les graphiques de performance, les statistiques de vente et les projections pour le prochain trimestre.',
          completed: false
        },
        {
          id: 2,
          label: 'Réviser le code de la feature X',
          description: 'Faire une revue de code complète de la nouvelle fonctionnalité X. Vérifier les tests unitaires, la couverture de code et s\'assurer que les standards de codage sont respectés.',
          completed: false
        },
        {
          id: 3,
          label: 'Mettre à jour la documentation',
          description: 'Actualiser la documentation technique du projet suite aux dernières modifications. Documenter les nouvelles API et mettre à jour les exemples de code.',
          completed: true
        },
        {
          id: 4,
          label: 'Réunion d\'équipe hebdomadaire',
          description: 'Point hebdomadaire avec l\'équipe de développement pour faire le bilan de la semaine et planifier les tâches de la semaine suivante.',
          completed: true
        }
      ];

      this.task = tasks.find(t => t.id === taskId);
      this.loading = false;

      if (!this.task) {
        this.error = true;
      }
    }, 500);
  }

  /**
   * Change le statut de la tâche
   */
  toggleTaskStatus(): void {
    if (this.task) {
      this.task.completed = !this.task.completed;
      // Ici, ajouter l'appel au service pour sauvegarder le changement
    }
  }

  /**
   * Navigue vers l'édition de la tâche
   */
  editTask(): void {
    if (this.task) {
      this.router.navigate(['/task', this.task.id, 'edit']);
    }
  }

  /**
   * Supprime la tâche
   */
  deleteTask(): void {
    if (this.task && confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      // Ici, ajouter l'appel au service pour supprimer la tâche
      console.log('Suppression de la tâche:', this.task.id);
      this.goBack();
    }
  }

  /**
   * Retourne à la liste des tâches
   */
  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
