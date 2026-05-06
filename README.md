# TP Final : Conteneurisation d'une Application Todo Full-Stack

Bienvenue dans votre dernier travail pratique (TP Final) sur Docker. Dans ce projet, vous allez conteneuriser une application Todo full-stack complète, composée d'un frontend en React, d'une API backend en Node.js et d'une base de données MongoDB.

## Structure du Projet
Le dépôt est divisé en deux répertoires principaux :
- `/backend` : Une API Node.js + Express.
- `/frontend` : Un frontend React + Vite.

## Votre Mission

Votre objectif est de conteneuriser entièrement cette application en accomplissant les tâches suivantes :

### 1. Dockerfile Backend
Créez un `Dockerfile` dans le répertoire `backend`.
- Utilisez une image de base Node.js appropriée (par ex., `node:20-alpine`).
- Définissez le répertoire de travail (working directory) sur `/usr/src/app`.
- Copiez `package.json` et installez les dépendances.
- Copiez le reste du code source du backend.
- Exposez le port nécessaire (l'API écoute sur le port `3000`).
- Définissez la commande de démarrage (`npm start` ou `node index.js`).

Une fois le `Dockerfile` créé, construisez l'image en utilisant la commande `docker build` standard :
```bash
docker build -t todo-backend ./backend
```

### 2. Dockerfile Frontend
Créez un `Dockerfile` dans le répertoire `frontend`.
- Utilisez une image de base Node.js appropriée.
- Définissez le répertoire de travail sur `/usr/src/app`.
- Copiez `package.json` et installez les dépendances.
- Copiez le reste du code source du frontend.
- Exposez le port utilisé par Vite (`5173`).

Une fois le `Dockerfile` créé, construisez l'image en utilisant la commande `docker build` standard :
```bash
docker build -t todo-frontend ./frontend
```

### 3. Configuration Docker Compose
Créez un fichier `docker-compose.yml` à la racine du projet pour orchestrer les 3 services :

**A. Service Base de Données (`mongo` / `db`) :**
- Utilisez l'image officielle `mongo:latest`.
- Exposez le port par défaut de MongoDB (`27017:27017`).
- Ajoutez un volume nommé (named volume) pour persister les données de la base afin qu'elles ne soient pas perdues lorsque le conteneur s'arrête.

**B. Service Backend (`api`) :**
- Utilisez l'image `todo-backend` que vous venez de construire au lieu de construire l'image via docker-compose.
- Mappez le port hôte `3001` vers le port conteneur `3000` (cela évite les conflits si le port 3000 est utilisé sur votre machine).
- Passez les variables d'environnement suivantes :
  - `MONGO_URI=mongodb://db:27017/todoapp` *(Remplacez `db` par le nom de votre service MongoDB)*.
  - `PORT=3000`
- Assurez-vous que ce service démarre **après** la base de données en utilisant `depends_on`.

**C. Service Frontend (`frontend`) :**
- Utilisez l'image `todo-frontend` que vous venez de construire au lieu de construire l'image via docker-compose.
- Mappez le port `5173` vers `5173`.
- (Optionnel mais recommandé) Utilisez un montage de type "bind mount" pour synchroniser votre code source local du frontend avec le conteneur pour le rechargement à chaud (live-reloading).

## Validation
Pour tester si vous avez réussi, exécutez :
```bash
docker compose up
```
Votre frontend devrait être accessible à l'adresse `http://localhost:5173` et le backend à `http://localhost:3001`. Vous devriez pouvoir créer des listes de tâches, ajouter des tâches et les marquer comme terminées, prouvant ainsi que les trois conteneurs communiquent correctement !
