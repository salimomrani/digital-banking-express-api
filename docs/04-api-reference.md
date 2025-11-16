# API Reference

Documentation complète des endpoints disponibles.

## Base URL

```
http://localhost:4000
```

## Authentication

La plupart des endpoints nécessitent un header d'authentification:

```
x-api-key: your-api-key
```

---

## Health Check

### GET /health

Vérifie le statut du service.

**Headers**: Aucun requis

**Response**:
```json
{
  "status": "ok",
  "service": "digital-banking-api",
  "timestamp": "2025-11-14T14:30:00.000Z"
}
```

---

## Authentication

### POST /api/auth/login

Authentification utilisateur.

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "hashed_password_1"
}
```

**Success Response** (200):
```json
{
  "token": "am9obi5kb2VAZXhhbXBsZS5jb206MTc2MzEyNjE2ODIwMg==",
  "apiKey": "local-dev-key",
  "user": {
    "id": "1",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "roles": ["customer"]
  }
}
```

**Error Response** (401):
```json
{
  "message": "Identifiants invalides"
}
```

---

### GET /api/auth/me

Récupère les informations de l'utilisateur connecté.

**Headers**:
```
x-api-key: your-api-key
```

**Success Response** (200):
```json
{
  "user": {
    "id": "1",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "roles": ["customer"]
  }
}
```

**Error Response** (401):
```json
{
  "message": "Clé API invalide"
}
```

---

## Accounts

### GET /api/accounts

Liste tous les comptes bancaires avec leurs transactions.

**Headers**:
```
x-api-key: your-api-key
```

**Success Response** (200):
```json
{
  "accounts": [
    {
      "id": "FR7612345678901234567890123",
      "owner": "John Doe",
      "balance": 5074.5,
      "currency": "EUR",
      "transactions": [
        {
          "id": "8",
          "type": "credit",
          "amount": 100,
          "label": "Refund",
          "date": "2025-11-14"
        },
        {
          "id": "1",
          "type": "credit",
          "amount": 1000,
          "label": "Salary deposit",
          "date": "2025-11-14"
        }
      ]
    },
    {
      "id": "FR7698765432109876543210987",
      "owner": "John Doe",
      "balance": 15000,
      "currency": "EUR",
      "transactions": [...]
    }
  ]
}
```

---

### GET /api/accounts/:accountId

Récupère les détails d'un compte spécifique.

**Headers**:
```
x-api-key: your-api-key
```

**URL Parameters**:
- `accountId` (string): Numéro de compte (ex: FR7612345678901234567890123)

**Success Response** (200):
```json
{
  "account": {
    "id": "FR7612345678901234567890123",
    "owner": "John Doe",
    "balance": 5074.5,
    "currency": "EUR",
    "transactions": [
      {
        "id": "8",
        "type": "credit",
        "amount": 100,
        "label": "Refund",
        "date": "2025-11-14"
      }
    ]
  }
}
```

**Error Response** (404):
```json
{
  "message": "Compte introuvable"
}
```

---

### POST /api/accounts/:accountId/transactions

Crée une nouvelle transaction sur un compte.

**Headers**:
```
x-api-key: your-api-key
Content-Type: application/json
```

**URL Parameters**:
- `accountId` (string): Numéro de compte

**Body**:
```json
{
  "type": "credit",      // ou "debit"
  "amount": 100.50,
  "label": "Salary deposit"
}
```

**Validation**:
- `type`: "credit" ou "debit" (requis)
- `amount`: nombre positif (requis)
- `label`: string optionnel

**Success Response** (201):
```json
{
  "message": "Transaction enregistrée",
  "account": {
    "id": "FR7612345678901234567890123",
    "balance": 5174.5,
    "currency": "EUR"
  },
  "transaction": {
    "id": "9",
    "type": "credit",
    "amount": 100.5,
    "label": "Salary deposit",
    "date": "2025-11-14"
  }
}
```

**Error Responses**:

404 - Compte non trouvé:
```json
{
  "message": "Compte introuvable"
}
```

400 - Solde insuffisant (debit):
```json
{
  "message": "Solde insuffisant"
}
```

400 - Validation error:
```json
{
  "message": "Payload invalide",
  "details": {
    "fieldErrors": {
      "type": ["Invalid enum value. Expected 'credit' | 'debit'"],
      "amount": ["Number must be greater than 0"]
    }
  }
}
```

---

## Transactions

### GET /api/transactions/:accountId

Liste les transactions d'un compte.

**Headers**:
```
x-api-key: your-api-key
```

**URL Parameters**:
- `accountId` (string): Numéro de compte

**Success Response** (200):
```json
{
  "transactions": [
    {
      "id": "8",
      "type": "credit",
      "amount": 100,
      "label": "Refund",
      "date": "2025-11-14"
    },
    {
      "id": "7",
      "type": "debit",
      "amount": 25.5,
      "label": "Coffee shop",
      "date": "2025-11-14"
    }
  ]
}
```

**Error Response** (404):
```json
{
  "message": "Compte introuvable"
}
```

---

## Error Handling

### Error Response Format

Toutes les erreurs suivent ce format:

```json
{
  "message": "Description de l'erreur",
  "details": {
    // Détails optionnels (validation, etc.)
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (API key invalide) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Examples avec curl

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "hashed_password_1"
  }'
```

### Liste des comptes
```bash
curl http://localhost:4000/api/accounts \
  -H "x-api-key: local-dev-key"
```

### Détail d'un compte
```bash
curl http://localhost:4000/api/accounts/FR7612345678901234567890123 \
  -H "x-api-key: local-dev-key"
```

### Créer une transaction (crédit)
```bash
curl -X POST http://localhost:4000/api/accounts/FR7612345678901234567890123/transactions \
  -H "x-api-key: local-dev-key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "credit",
    "amount": 100.50,
    "label": "Salary deposit"
  }'
```

### Créer une transaction (débit)
```bash
curl -X POST http://localhost:4000/api/accounts/FR7612345678901234567890123/transactions \
  -H "x-api-key: local-dev-key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "debit",
    "amount": 25.50,
    "label": "Coffee shop"
  }'
```

---

## Postman Collection

### Import dans Postman

1. Créer une nouvelle collection "Digital Banking API"
2. Ajouter une variable d'environnement:
   - `baseUrl`: `http://localhost:4000`
   - `apiKey`: `local-dev-key`

3. Ajouter les requêtes avec `{{baseUrl}}` et `{{apiKey}}`

### Exemple de requête Postman

```json
{
  "name": "List Accounts",
  "request": {
    "method": "GET",
    "header": [
      {
        "key": "x-api-key",
        "value": "{{apiKey}}"
      }
    ],
    "url": {
      "raw": "{{baseUrl}}/api/accounts",
      "host": ["{{baseUrl}}"],
      "path": ["api", "accounts"]
    }
  }
}
```

---

## Rate Limiting

⏳ **À implémenter**: Rate limiting avec express-rate-limit

Limite prévue:
- 100 requêtes par minute par IP
- 1000 requêtes par heure par utilisateur

---

## Versioning

⏳ **À implémenter**: Versioning de l'API

Format prévu: `/api/v1/accounts`, `/api/v2/accounts`

---

## WebSockets

⏳ **À implémenter**: WebSocket pour notifications en temps réel

- Solde bas
- Nouvelle transaction
- Alerte sécurité

---

## Pagination

⏳ **À implémenter**: Pagination sur les listes

Format prévu:
```
GET /api/accounts/:id/transactions?page=1&limit=20
```

Response:
```json
{
  "transactions": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8
  }
}
```
