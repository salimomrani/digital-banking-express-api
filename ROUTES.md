# API Routes Reference

| Méthode | Chemin | Description | Corps/Paramètres clés | Réponse |
| --- | --- | --- | --- | --- |
| `GET` | `/health` | Vérifie l'état du service. | Aucun. | `{ status, service, timestamp }`. |
| `POST` | `/api/auth/login` | Auth mock + récupération de la clé API (`x-api-key`). | JSON `{ "email": string, "password": string }`. | `{ token, apiKey, user }`. |
| `GET` | `/api/auth/me` | Renvoie l'utilisateur mocké (protégé). | En-tête `x-api-key`. | `{ user }`. |
| `GET` | `/api/accounts` | Liste des comptes mockés. | `x-api-key`. | `{ accounts: Account[] }`. |
| `GET` | `/api/accounts/:accountId` | Détail d'un compte. | `x-api-key`, paramètre `accountId`. | `{ account }` ou `404`. |
| `POST` | `/api/accounts/:accountId/transactions` | Ajoute une transaction via le module comptes. | `x-api-key`, JSON `{ type: "credit"|"debit", amount: number, label?: string }`. | `201` `{ message, account, transaction }`. |
| `GET` | `/api/transactions/:accountId` | Liste des transactions d'un compte. | `x-api-key`. | `{ transactions: Transaction[] }`. |
| `POST` | `/api/transactions/:accountId` | Ajoute une transaction (même payload que ci-dessus). | `x-api-key`, JSON `{ type, amount, label? }`. | `201` `{ message, transaction, account }`. |

Notes :
- Toutes les routes `/api/*` héritent des middlewares JSON et CORS de `src/app.ts`.
- Les routes `accounts` et `transactions` exigent l'en-tête `x-api-key`, obtenue via `POST /api/auth/login`.
- Les validations Zod sont définies dans chaque module (`modules/*/*.schemas.ts`) et les erreurs sont normalisées par `core/middleware/error-handler.ts`.
