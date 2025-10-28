# Backend - Application de Gestion de Tâches

## 📋 Description

API RESTful développée dans le cadre d'un test technique pour Natixis Interépargne. Cette application permet de gérer une liste de tâches (To-Do List) avec des opérations CRUD complètes.

## 🚀 Technologies Utilisées

- **Java 25**
- **Spring Boot 3.x**
- **Maven** - Gestion des dépendances
- **H2 Database** - Base de données en mémoire
- **JUnit 5** - Tests unitaires
- **Mockito** - Mocking pour les tests
- **Spring Data JPA** - Persistance des données
- **Lombok** - Réduction du code boilerplate

## 📁 Structure du Projet

```
Backend [todo]
├── .idea/
├── .mvn/
├── src/
│   └── main/
│       └── java/
│           └── com.natixis.todo/
│               ├── controller/
│               │   └── TaskController.java
│               ├── dto/
│               │   └── TaskDto.java
│               ├── entity/
│               │   └── Task.java
│               ├── mapper/
│               │   └── TaskMapper.java
│               ├── repository/
│               │   └── TaskRepository.java
│               ├── service/
│               │   ├── serviceImpl/
│               │   │   └── TaskServiceImpl.java
│               │   └── TaskService.java
│               └── TodoApplication.java
│       └── resources/
│           ├── application.properties
│           └── data.sql
└── pom.xml
```

## 🔧 Architecture

L'application suit une architecture en couches :

- **Controller** : Gère les requêtes HTTP et les réponses
- **Service** : Contient la logique métier
- **Repository** : Gère l'accès aux données
- **Entity** : Représente le modèle de données
- **DTO** : Objets de transfert de données
- **Mapper** : Conversion entre Entity et DTO

## 🌐 Endpoints API

### 📌 Récupérer toutes les tâches
```http
GET /api/tasks
```

### 📌 Récupérer les tâches à effectuer (non complétées)

```http
GET /api/tasks?completed=false
```

### 📌 Récupérer une tâche par ID
```http
GET /api/tasks/{id}
```

### 📌 Créer une nouvelle tâche
```http
POST /api/tasks
Content-Type: application/json

{
  "label": "Titre de la tâche",
  "description": "Description détaillée",
  "completed": false
}
```

### 📌 Modifier le statut d'une tâche
```http
PUT /api/tasks/{id}/status
Content-Type: application/json

{
  "completed": true
}
```

### 📌 Mettre à jour une tâche complète
```http
PUT /api/tasks/{id}
Content-Type: application/json

{
  "label": "Nouveau titre",
  "description": "Nouvelle description",
  "completed": true
}
```

### 📌 Supprimer une tâche
```http
DELETE /api/tasks/{id}
```

## 📦 Modèle de Données

### Task Entity
```java
{
        "id": Long,           // Identifiant unique
        "label": String,      // Intitulé de la tâche
        "description": String,// Description détaillée
        "completed": Boolean  // Statut (effectuée ou non)
}
```

## ⚙️ Installation et Lancement

### Prérequis
- Java 25 installé
- Maven 3.x installé

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone [URL_DU_REPO]
cd Backend
```

2. **Compiler le projet**
```bash
mvn clean install
```

3. **Lancer l'application**
```bash
mvn spring-boot:run
```

L'application sera accessible sur : `http://localhost:8080`

### Configuration H2 Database

La console H2 est accessible à : `http://localhost:8080/h2-console`

**Paramètres de connexion :**
- JDBC URL: `jdbc:h2:mem:tododb`
- Username: `natixis`
- Password: 'natixis123'

## 🧪 Tests

### Lancer tous les tests
```bash
mvn test
```

### Structure des tests
- **Tests unitaires** : Teste les méthodes de Service isolement. 
- **Tests d'intégration** : Testent les interactions entre composants
- **Mocking** : Utilisation de Mockito pour simuler les dépendances

## ✨ Fonctionnalités Implémentées

### Fonctionnalités de base
- ✅ CRUD complet sur les tâches
- ✅ Filtrage par statut (completed/pending)
- ✅ Validation des données entrantes
- ✅ Gestion des erreurs avec messages appropriés
- ✅ Tests unitaires avec JUnit 5 et Mockito

### Fonctionnalités bonus
- ✅ Base de données H2 (au lieu de stockage en mémoire simple)
- ✅ Architecture en couches (Controller/Service/Repository)
- ✅ Utilisation de DTOs pour la séparation des préoccupations
- ✅ Pattern Mapper pour conversion Entity/DTO
- ✅ Documentation API
- ✅ Gestion des exceptions personnalisées
- ✅ Validation des données avec Bean Validation
- ✅ Configuration CORS pour le frontend

## 📝 Bonnes Pratiques Respectées

- ✅ **REST Principles** : Utilisation correcte des verbes HTTP
- ✅ **Clean Code** : Code lisible et maintenable
- ✅ **SOLID Principles** : Architecture modulaire
- ✅ **DTOs** : Séparation entre modèle de données et API
- ✅ **Exception Handling** : Gestion centralisée des erreurs
- ✅ **Testing** : Couverture des tests unitaires
- ✅ **Lombok** : Réduction du code répétitif

## 🔒 Sécurité et Améliorations Possibles

### Améliorations futures suggérées :
- [ ] Authentification JWT
- [ ] Pagination des résultats
- [ ] Recherche et filtres avancés
- [ ] Validation plus poussée
- [ ] Documentation OpenAPI/Swagger
- [ ] Logging structuré
- [ ] Métriques et monitoring
- [ ] CI/CD pipeline
- [ ] Containerisation Docker
