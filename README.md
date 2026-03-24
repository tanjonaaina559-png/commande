# T-Shirt Order Management System

## Structure du Projet

### Backend (`/server`)
- `server.js`: Entrée de l'application Express.
- `config/db.js`: Configuration de la connexion MySQL.
- `models/`: Logique d'interaction avec la base de données.
- `controllers/`: Gestion des requêtes API.
- `routes/`: Définition des terminaux API.
- `init.sql`: Script d'initialisation de la base de données.

### Frontend (`/client`)
- `src/components/`: Composants réutilisables (Layout, Sidebar).
- `src/pages/`: Pages principales (Dashboard, Orders, AddOrder, Clients).
- `src/services/`: Client API (Axios).
- `src/utils/`: Utilitaires (Générateur PDF, Constantes de prix).

## Installation

### Database setup
1.  Créer une base de données MySQL nommée `tshirt_business`.
2.  Exécuter le script `server/init.sql`.

### Backend
1.  Navigate to `server/`.
2.  Install dependencies: `npm install`.
3.  Set up environment in `.env`.
4.  Run: `npm run dev` (using nodemon).

### Frontend
1.  Navigate to `client/`.
2.  Install dependencies: `npm install`.
3.  Run: `npm run dev`.

## Fonctionnalités
- Gestion complète des clients et commandes.
- Calcul automatique des prix selon le type et la taille.
- Suivi des paiements (Avance / Reste à payer).
- Génération de reçus PDF professionnels.
- Dashboard avec statistiques de ventes.
