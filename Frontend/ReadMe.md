# Frontend - Application de Gestion de Tâches

## 📋 Description

Application web développée avec Angular pour interagir avec l'API de gestion de tâches (To-Do List) dans le cadre d'un test technique pour Natixis Interépargne. Interface moderne et responsive utilisant Angular Material.

## 🚀 Technologies Utilisées

- **Angular 20** (Standalone Components)
- **TypeScript**
- **Angular Material** - Composants UI
- **RxJS** - Programmation réactive
- **Karma** - Test Runner
- **Jasmine** - Framework de tests
- **SCSS** - Styles

## 📁 Structure du Projet

```
FRONTEND
├── src/
│   ├── app/
│   │   └── task/
│   │       ├── components/
│   │       │   ├── task-detail/
│   │       │   │   ├── task-detail.component.ts
│   │       │   │   ├── task-detail.component.html
│   │       │   │   ├── task-detail.component.scss
│   │       │   │   └── task-detail.component.spec.ts
│   │       │   ├── task-form/
│   │       │   │   ├── task-form.component.ts
│   │       │   │   ├── task-form.component.html
│   │       │   │   ├── task-form.component.scss
│   │       │   │   └── task-form.component.spec.ts
│   │       │   └── task-list/
│   │       │       ├── task-list.component.ts
│   │       │       ├── task-list.component.html
│   │       │       ├── task-list.component.scss
│   │       │       └── task-list.component.spec.ts
│   │       ├── model/
│   │       │   └── task.model.ts
│   │       └── service/
│   │           ├── task.service.ts
│   │           └── task.service.spec.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.spec.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.ts
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   └── test.ts
├── .editorconfig
├── .gitignore
├── .hintrc
├── angular.json
├── karma.conf.js
├── package-lock.json
├── package.json
└── README.md
```

## 🎨 Fonctionnalités

### ✅ Fonctionnalités Principales

1. **Affichage de la liste des tâches**
   - Vue liste avec toutes les tâches
   - Interface Material Design moderne
   - Responsive sur tous les appareils

2. **Détail d'une tâche**
   - Affichage complet des informations
   - Navigation fluide entre liste et détail

3. **Filtrage par statut**
   - Toutes les tâches
   - Tâches à effectuer (pending)
   - Tâches complétées

4. **Modification du statut**
   - Marquer comme complétée/non complétée
   - Mise à jour en temps réel
   - Confirmation visuelle

5. **Création de tâches**
   - Formulaire avec validation
   - Ajout instantané à la liste

6. **Suppression de tâches**
   - Action de suppression
   - Confirmation avant suppression

### ✨ Fonctionnalités Bonus

- ✅ Interface utilisateur intuitive avec Angular Material
- ✅ Animations et transitions fluides
- ✅ Gestion d'erreurs avec notifications
- ✅ Loading states pendant les requêtes
- ✅ Design responsive (mobile-first)
- ✅ Architecture standalone components
- ✅ Services réutilisables
- ✅ Tests unitaires complets

## 🛠️ Architecture

### Structure en Modules

L'application utilise l'architecture **Standalone Components** d'Angular 20 :

- **Components** : Composants réutilisables et modulaires
- **Services** : Logique métier et communication API
- **Models** : Interfaces TypeScript pour le typage
- **Routing** : Navigation entre les vues

### Composants Principaux

#### 1. TaskListComponent
- Affiche la liste complète des tâches
- Gère le filtrage par statut
- Permet la navigation vers le détail

#### 2. TaskDetailComponent
- Affiche les détails d'une tâche spécifique
- Permet la modification du statut
- Option de suppression

#### 3. TaskFormComponent
- Formulaire de création/édition
- Validation des champs
- Gestion des erreurs

### Service TaskService

Gère toutes les interactions avec l'API Backend :

```typescript
- getTasks(): Observable<Task[]>
- getPendingTasks(): Observable<Task[]>
- getTaskById(id: number): Observable<Task>
- createTask(task: Task): Observable<Task>
- updateTask(id: number, task: Task): Observable<Task>
- updateTaskStatus(id: number, completed: boolean): Observable<Task>
- deleteTask(id: number): Observable<void>
```

## 📦 Modèle de Données

```typescript
interface Task {
  id?: number;
  label: string;
  description: string;
  completed: boolean;
}
```

## ⚙️ Installation et Lancement

### Prérequis

- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)
- Angular CLI 20

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone [URL_DU_REPO]
cd FRONTEND
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer l'application en mode développement**
```bash
ng serve
```

L'application sera accessible sur : `http://localhost:4200`

## 🧪 Tests

### Lancer tous les tests unitaires

```bash
ng test
```

### Lancer les tests avec coverage

```bash
ng test --code-coverage
```

Le rapport de coverage sera généré dans `coverage/`

### Lancer les tests en mode headless (CI/CD)

```bash
ng test --watch=false --browsers=ChromeHeadless
```