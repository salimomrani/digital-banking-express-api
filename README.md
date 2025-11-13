# Digital Banking Backend

Petit backend Node.js/Express pour démarrer une API bancaire :

- `GET /health` : statut du service.
- `GET /api/accounts` : liste des comptes mockés.
- `GET /api/accounts/:accountId` : détail d'un compte.
- `POST /api/accounts/:accountId/transactions` : ajoute une transaction (en mémoire).

## Installation

```bash
npm install
```

## Lancer l'API

- Développement avec rechargement :

```bash
npm run dev
```

- Production :

```bash
npm start
```

Configurer les variables d'environnement en copiant `.env.example` vers `.env` si besoin.

- `ALLOWED_ORIGINS` accepte une liste d'origines séparées par des virgules (ex : `http://localhost:4200,https://app.example.com`) et seules ces origines pourront appeler l'API.
