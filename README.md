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

- Développement TypeScript avec rechargement :

  ```bash
  npm run dev
  ```

- Build TypeScript → JavaScript :

  ```bash
  npm run build
  ```

- Production (assure-toi d'avoir un `npm run build` juste avant) :

  ```bash
  npm start
  ```

- Linting TypeScript (et `npm test`) :

  ```bash
  npm run lint
  ```

Configurer les variables d'environnement en copiant `.env.example` vers `.env` si besoin.

- `ALLOWED_ORIGINS` accepte une liste d'origines séparées par des virgules (ex : `http://localhost:4200,https://app.example.com`) et seules ces origines pourront appeler l'API.

## Stack & Qualité

- Node.js + Express + TypeScript (ts-node-dev en dev, `tsc` pour la build).
- ESLint + `@typescript-eslint` garantit un style cohérent (`npm test` déclenche `npm run lint`).

## Intégration Continue

Chaque push ou pull request vers `main` déclenche une GitHub Action (`.github/workflows/ci.yml`) qui installe les dépendances, lance `npm run lint` puis `npm run build`.
