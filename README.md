# Système de gestion des commandes de t-shirts

## Structure du Projet

### Backend (/server)
- `server.js`: Entrée de l'application Express.
- `config/db.js`: Configuration de la connexion MySQL.
- `models/`: Logique d'interaction avec la base de données.
- `controllers/`: Gestion des requêtes API.
- `routes/`: Définition des terminaux API.
- `init.sql`: Script d'initialisation de la base de données.

### L'extrémité avant (/client)
- `src/components/`: Composants réutilisables (Layout, Sidebar).
- `src/pages/`: Pages principales (Tableau de bord, Commandes, Ajouter une commande, Clients).
- `src/services/`: API client (Axios).
- `src/utils/`: Utilitaires (Générateur PDF, Constantes de prix).

## Installation

### Configuration de la base de données
1. Créer une base de données MySQL nommée `tshirt_business`.
2. Exécuter le script `server/init.sql`.

### Backend
1. Accédez à `server/`.
2. Installer les dépendances : `npm install`.
3. Configurez l'environnement dans `.env`.
4. Exécuter : `npm run dev` (en utilisant nodemon).

### L'extrémité avant (Frontend)
1. Accédez à `client/`.
2. Installer les dépendances : `npm install`.
3. Courir: `npm run dev`.

## Fonctionnalités
- Gestion complète des clients et commandes.
- Calcul automatique des prix selon le type et la taille.
- Suivi des paiements (Avance / Reste à payer).
- Génération de reçus PDF professionnels.
- Tableau de bord avec statistiques de ventes.
