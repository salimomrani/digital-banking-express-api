# API Bank - Documentation

API pour générer des données bancaires fictives et effectuer des opérations bancaires.

**Base URL:** `http://localhost:4000/api/bank`

## Table des matières

- [Génération de données](#génération-de-données)
  - [Générer des comptes](#générer-des-comptes)
  - [Générer des transactions](#générer-des-transactions)
- [Opérations bancaires](#opérations-bancaires)
  - [Effectuer un virement](#effectuer-un-virement)
  - [Créer une carte bancaire](#créer-une-carte-bancaire)
  - [Créer un prêt](#créer-un-prêt)
- [Consultation](#consultation)
  - [Obtenir les cartes d'un compte](#obtenir-les-cartes-dun-compte)
  - [Obtenir les prêts d'un compte](#obtenir-les-prêts-dun-compte)
- [Utilitaires](#utilitaires)
  - [Réinitialiser les données](#réinitialiser-les-données)

---

## Génération de données

### Générer des comptes

Crée un ou plusieurs comptes bancaires avec des données aléatoires.

**Endpoint:** `POST /api/bank/generate-accounts`

**Corps de la requête:**

```json
{
  "count": 5,        // Nombre de comptes à créer (1-50)
  "userId": 1        // Optionnel - ID utilisateur existant
}
```

**Paramètres:**

| Paramètre | Type   | Requis | Valeurs        | Description                          |
|-----------|--------|--------|----------------|--------------------------------------|
| count     | number | Oui    | 1-50           | Nombre de comptes à générer          |
| userId    | number | Non    | ID existant    | ID de l'utilisateur propriétaire     |

**Exemple de requête:**

```bash
curl -X POST http://localhost:4000/api/bank/generate-accounts \
  -H "Content-Type: application/json" \
  -d '{"count": 3}'
```

**Réponse (201 Created):**

```json
{
  "message": "3 accounts created successfully",
  "data": [
    {
      "id": 1,
      "accountNumber": "FR7617523579969499208794",
      "userId": 1,
      "balance": "28859",
      "currency": "EUR",
      "accountType": "savings",
      "status": "active",
      "createdAt": "2025-01-14T19:00:00.000Z",
      "updatedAt": "2025-01-14T19:00:00.000Z"
    }
  ]
}
```

**Données générées:**
- Numéro IBAN français (FR76...)
- Solde aléatoire (1000-50000)
- Devise: EUR, USD ou GBP
- Type de compte: checking, savings ou business

---

### Générer des transactions

Crée des transactions aléatoires pour un compte donné.

**Endpoint:** `POST /api/bank/generate-transactions`

**Corps de la requête:**

```json
{
  "count": 10,       // Nombre de transactions (1-100)
  "accountId": 4     // ID du compte
}
```

**Paramètres:**

| Paramètre | Type   | Requis | Valeurs   | Description                      |
|-----------|--------|--------|-----------|----------------------------------|
| count     | number | Oui    | 1-100     | Nombre de transactions           |
| accountId | number | Oui    | ID valide | ID du compte                     |

**Exemple de requête:**

```bash
curl -X POST http://localhost:4000/api/bank/generate-transactions \
  -H "Content-Type: application/json" \
  -d '{"count": 10, "accountId": 4}'
```

**Réponse (201 Created):**

```json
{
  "message": "10 transactions created successfully",
  "data": [
    {
      "id": 1,
      "accountId": 4,
      "transactionType": "credit",
      "amount": "267",
      "balanceAfter": "29126",
      "description": "ATM withdrawal",
      "reference": "REF-8816255372",
      "status": "completed",
      "createdAt": "2025-01-14T19:00:00.000Z"
    }
  ]
}
```

**Données générées:**
- Type: credit ou debit
- Montant: 10-500
- Descriptions variées (achats, retraits, virements, etc.)
- Mise à jour automatique du solde du compte

---

## Opérations bancaires

### Effectuer un virement

Effectue un virement entre deux comptes avec mise à jour atomique des soldes.

**Endpoint:** `POST /api/bank/transfers`

**Corps de la requête:**

```json
{
  "fromAccountId": 4,
  "toAccountId": 5,
  "amount": 500,
  "description": "Virement test",  // Optionnel
  "transferType": "sepa"            // Optionnel
}
```

**Paramètres:**

| Paramètre     | Type   | Requis | Valeurs                        | Description                  |
|---------------|--------|--------|--------------------------------|------------------------------|
| fromAccountId | number | Oui    | ID valide                      | Compte émetteur              |
| toAccountId   | number | Oui    | ID valide                      | Compte destinataire          |
| amount        | number | Oui    | > 0                            | Montant du virement          |
| description   | string | Non    | Texte                          | Description du virement      |
| transferType  | string | Non    | sepa, international, instant   | Type de virement (défaut: sepa) |

**Exemple de requête:**

```bash
curl -X POST http://localhost:4000/api/bank/transfers \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccountId": 4,
    "toAccountId": 5,
    "amount": 500,
    "description": "Remboursement",
    "transferType": "instant"
  }'
```

**Réponse (201 Created):**

```json
{
  "message": "Transfer completed successfully",
  "data": {
    "success": true,
    "transferType": "instant",
    "amount": 500,
    "fromAccountId": 4,
    "toAccountId": 5,
    "timestamp": "2025-01-14T19:00:00.000Z"
  }
}
```

**Notes:**
- Le solde du compte émetteur doit être suffisant
- Les deux comptes doivent exister
- L'opération est atomique (transaction SQL)
- Crée 2 transactions (débit et crédit)

---

### Créer une carte bancaire

Crée une carte bancaire pour un compte avec génération automatique des données.

**Endpoint:** `POST /api/bank/cards`

**Corps de la requête:**

```json
{
  "accountId": 4,
  "cardType": "credit",  // debit, credit, virtual
  "limit": 5000          // Optionnel
}
```

**Paramètres:**

| Paramètre | Type   | Requis | Valeurs                | Description                           |
|-----------|--------|--------|------------------------|---------------------------------------|
| accountId | number | Oui    | ID valide              | ID du compte                          |
| cardType  | string | Oui    | debit, credit, virtual | Type de carte                         |
| limit     | number | Non    | > 0                    | Limite de crédit (requis pour credit) |

**Exemple de requête:**

```bash
# Carte de crédit avec limite
curl -X POST http://localhost:4000/api/bank/cards \
  -H "Content-Type: application/json" \
  -d '{"accountId": 4, "cardType": "credit", "limit": 5000}'

# Carte de débit
curl -X POST http://localhost:4000/api/bank/cards \
  -H "Content-Type: application/json" \
  -d '{"accountId": 4, "cardType": "debit"}'
```

**Réponse (201 Created):**

```json
{
  "message": "Card created successfully",
  "data": {
    "id": 1,
    "accountId": 4,
    "cardNumber": "4532492166098708",
    "cardType": "credit",
    "cardholderName": "JOHN DOE",
    "expiryDate": "10/26",
    "cvv": "377",
    "status": "active",
    "limit": "5000",
    "createdAt": "2025-01-14T19:00:00.000Z",
    "updatedAt": "2025-01-14T19:00:00.000Z"
  }
}
```

**Données générées:**
- Numéro de carte Visa (4532...)
- Nom du titulaire (depuis le compte)
- Date d'expiration (2-6 ans dans le futur)
- CVV aléatoire (3 chiffres)

---

### Créer un prêt

Crée un prêt pour un compte avec calcul automatique des mensualités.

**Endpoint:** `POST /api/bank/loans`

**Corps de la requête:**

```json
{
  "accountId": 4,
  "loanType": "personal",     // personal, mortgage, auto
  "amount": 10000,
  "interestRate": 5.5,        // Pourcentage (max 20%)
  "durationMonths": 36        // Mois (6-360)
}
```

**Paramètres:**

| Paramètre      | Type   | Requis | Valeurs                 | Description                |
|----------------|--------|--------|-------------------------|----------------------------|
| accountId      | number | Oui    | ID valide               | ID du compte               |
| loanType       | string | Oui    | personal, mortgage, auto| Type de prêt               |
| amount         | number | Oui    | > 0                     | Montant du prêt            |
| interestRate   | number | Oui    | 0-20                    | Taux d'intérêt annuel (%)  |
| durationMonths | number | Oui    | 6-360                   | Durée en mois              |

**Exemple de requête:**

```bash
# Prêt personnel
curl -X POST http://localhost:4000/api/bank/loans \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": 4,
    "loanType": "personal",
    "amount": 10000,
    "interestRate": 5.5,
    "durationMonths": 36
  }'

# Prêt immobilier
curl -X POST http://localhost:4000/api/bank/loans \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": 4,
    "loanType": "mortgage",
    "amount": 200000,
    "interestRate": 3.2,
    "durationMonths": 240
  }'
```

**Réponse (201 Created):**

```json
{
  "message": "Loan created successfully",
  "data": {
    "id": 1,
    "accountId": 4,
    "loanType": "personal",
    "amount": "10000",
    "remainingBalance": "10000",
    "interestRate": "5.5",
    "durationMonths": 36,
    "monthlyPayment": "301.96",
    "status": "active",
    "startDate": "2025-01-14T19:00:00.000Z",
    "createdAt": "2025-01-14T19:00:00.000Z",
    "updatedAt": "2025-01-14T19:00:00.000Z"
  }
}
```

**Calcul automatique:**
- Mensualité calculée avec la formule d'amortissement
- Solde restant initialisé au montant total

---

## Consultation

### Obtenir les cartes d'un compte

Récupère toutes les cartes associées à un compte.

**Endpoint:** `GET /api/bank/cards/:accountId`

**Paramètres d'URL:**

| Paramètre | Type   | Description      |
|-----------|--------|------------------|
| accountId | number | ID du compte     |

**Exemple de requête:**

```bash
curl http://localhost:4000/api/bank/cards/4
```

**Réponse (200 OK):**

```json
{
  "message": "Cards retrieved successfully",
  "data": [
    {
      "id": 1,
      "accountId": 4,
      "cardNumber": "4532492166098708",
      "cardType": "credit",
      "cardholderName": "JOHN DOE",
      "expiryDate": "10/26",
      "cvv": "377",
      "status": "active",
      "limit": "5000",
      "createdAt": "2025-01-14T19:00:00.000Z",
      "updatedAt": "2025-01-14T19:00:00.000Z"
    }
  ]
}
```

---

### Obtenir les prêts d'un compte

Récupère tous les prêts associés à un compte.

**Endpoint:** `GET /api/bank/loans/:accountId`

**Paramètres d'URL:**

| Paramètre | Type   | Description      |
|-----------|--------|------------------|
| accountId | number | ID du compte     |

**Exemple de requête:**

```bash
curl http://localhost:4000/api/bank/loans/4
```

**Réponse (200 OK):**

```json
{
  "message": "Loans retrieved successfully",
  "data": [
    {
      "id": 1,
      "accountId": 4,
      "loanType": "personal",
      "amount": "10000",
      "remainingBalance": "10000",
      "interestRate": "5.5",
      "durationMonths": 36,
      "monthlyPayment": "301.96",
      "status": "active",
      "startDate": "2025-01-14T19:00:00.000Z",
      "createdAt": "2025-01-14T19:00:00.000Z",
      "updatedAt": "2025-01-14T19:00:00.000Z"
    }
  ]
}
```

---

## Utilitaires

### Réinitialiser les données

Supprime toutes les données bancaires (comptes, transactions, cartes, prêts).

**Endpoint:** `DELETE /api/bank/reset`

**Pas de corps de requête**

**Exemple de requête:**

```bash
curl -X DELETE http://localhost:4000/api/bank/reset
```

**Réponse (200 OK):**

```json
{
  "message": "All data deleted successfully"
}
```

**Attention:** Cette opération est irréversible et supprime toutes les données.

---

## Codes de statut HTTP

| Code | Description                          |
|------|--------------------------------------|
| 200  | Succès (GET, DELETE)                 |
| 201  | Ressource créée (POST)               |
| 400  | Erreur de validation                 |
| 404  | Ressource non trouvée                |
| 500  | Erreur interne du serveur            |

---

## Exemples de scénarios

### Scénario complet : Nouveau client

```bash
# 1. Créer un compte
curl -X POST http://localhost:4000/api/bank/generate-accounts \
  -H "Content-Type: application/json" \
  -d '{"count": 1}'

# 2. Créer une carte de débit
curl -X POST http://localhost:4000/api/bank/cards \
  -H "Content-Type: application/json" \
  -d '{"accountId": 1, "cardType": "debit"}'

# 3. Générer des transactions initiales
curl -X POST http://localhost:4000/api/bank/generate-transactions \
  -H "Content-Type: application/json" \
  -d '{"count": 20, "accountId": 1}'

# 4. Créer un prêt auto
curl -X POST http://localhost:4000/api/bank/loans \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": 1,
    "loanType": "auto",
    "amount": 25000,
    "interestRate": 4.5,
    "durationMonths": 60
  }'
```

### Scénario : Virement entre comptes

```bash
# 1. Créer 2 comptes
curl -X POST http://localhost:4000/api/bank/generate-accounts \
  -H "Content-Type: application/json" \
  -d '{"count": 2}'

# 2. Effectuer un virement
curl -X POST http://localhost:4000/api/bank/transfers \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccountId": 1,
    "toAccountId": 2,
    "amount": 1000,
    "description": "Remboursement",
    "transferType": "instant"
  }'
```

---

## Notes importantes

- Toutes les requêtes utilisent le format JSON
- Les montants sont stockés en centimes/décimales
- Les dates sont au format ISO 8601
- Les transactions sont atomiques (rollback en cas d'erreur)
- Les numéros de carte sont générés aléatoirement (non valides pour production)
