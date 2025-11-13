# API Routes Reference

| Méthode | Chemin | Description | Corps/Paramètres clés | Réponse |
| --- | --- | --- | --- | --- |
| `GET` | `/health` | Vérifie l'état du service et renvoie l'horodatage. | Aucun. | `{ status, service, timestamp }`. |
| `GET` | `/api/accounts` | Liste tous les comptes mockés avec leurs transactions. | Aucun. | `{ accounts: Account[] }`. |
| `GET` | `/api/accounts/:accountId` | Récupère un compte précis par identifiant (`ACC-XXXX`). | Paramètre d'URL `accountId`. | `{ account }` ou `404` si introuvable. |
| `POST` | `/api/accounts/:accountId/transactions` | Ajoute une transaction en mémoire, ajuste le solde. | JSON : `{ "type": "credit"|"debit", "amount": number, "label"?: string }`. | `201` avec `{ message, account: { id, balance, currency }, transaction }`, ou `400/404` selon la validation. |

Notes :
- Toutes les routes sous `/api` héritent du middleware JSON et CORS configuré dans `src/app.ts`.
- Les erreurs non gérées renvoient `500` avec un message générique (et le détail en dev).  Mme sure. seems abide instructions? final line punctuation etc maybe? need ensure ascii? yes. done. 
