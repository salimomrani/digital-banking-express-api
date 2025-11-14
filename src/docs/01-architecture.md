# Architecture Backend - Digital Banking API

## Vue d'ensemble

Cette API bancaire est construite avec **Express.js**, **TypeScript**, **Prisma ORM** et **PostgreSQL**, suivant une architecture modulaire orientée domaine.

## Stack Technique

### Core
- **Runtime**: Node.js 18+
- **Framework**: Express 5.x
- **Language**: TypeScript 5.x (strict mode)
- **ORM**: Prisma 6.x
- **Database**: PostgreSQL 16 (via Docker)

### Outils de développement
- **ts-node-dev**: Hot reload en développement
- **ESLint**: Linting avec @typescript-eslint
- **Zod**: Validation des schémas
- **Docker**: Containerisation de PostgreSQL

## Architecture en couches

```
┌─────────────────────────────────────────┐
│           HTTP Layer (Express)          │
│  - CORS, Logging, Error Handling       │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│        Controller Layer                 │
│  - Request/Response handling            │
│  - Zod validation                       │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Service Layer                   │
│  - Business logic                       │
│  - Transaction orchestration            │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│        Repository Layer                 │
│  - Data access via Prisma               │
│  - Database transactions                │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Database (PostgreSQL)           │
│  - Users, Accounts, Transactions        │
└─────────────────────────────────────────┘
```

## Structure des modules

Chaque module fonctionnel suit le pattern suivant :

```
src/modules/{domain}/
├── {domain}.controller.ts   # Gestion HTTP
├── {domain}.service.ts       # Logique métier
├── {domain}.repository.ts    # Accès données
├── {domain}.routes.ts        # Définition routes
└── {domain}.schemas.ts       # Validation Zod
```

### Modules actuels

#### 1. **Auth Module**
- Authentification par API Key
- Login basique (email/password)
- Endpoint `/api/auth/me`

#### 2. **Accounts Module**
- Liste des comptes
- Détails d'un compte avec transactions
- Création de transactions sur un compte
- Support des relations Prisma (User ↔ Account ↔ Transaction)

#### 3. **Transactions Module**
- Liste des transactions par compte
- Tri chronologique descendant

## Modèle de données (Prisma)

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  accounts  Account[]
}

model Account {
  id            Int      @id @default(autoincrement())
  accountNumber String   @unique
  userId        Int
  balance       Decimal  @db.Decimal(15, 2)
  currency      String   @default("EUR")
  accountType   String   @default("checking")

  user          User     @relation(...)
  transactions  Transaction[]
}

model Transaction {
  id              Int      @id @default(autoincrement())
  accountId       Int
  transactionType String   // 'credit' | 'debit'
  amount          Decimal  @db.Decimal(15, 2)
  balanceAfter    Decimal  @db.Decimal(15, 2)
  description     String?

  account Account @relation(...)
}
```

## Gestion des erreurs

### HttpException
Custom exception class avec:
- `statusCode`: HTTP status code
- `message`: Message d'erreur
- `details`: Détails additionnels (optionnel)

### Error Handler Middleware
Centralise la gestion des erreurs:
- `HttpException` → Retourne le status code approprié
- `ZodError` → 400 avec détails de validation
- Autres erreurs → 500 erreur interne

## Sécurité

### Middleware API Key
- Validation via header `x-api-key`
- Protège les routes `/api/accounts` et `/api/transactions`
- Configuration via variable d'env `API_KEY`

### CORS
- Liste blanche d'origines via `ALLOWED_ORIGINS`
- Support multi-domaines séparés par virgules

### Validation des entrées
- Tous les payloads validés via Zod
- Type-safety garantie à la compilation et runtime

## Transactions atomiques

Utilisation de Prisma transactions pour garantir la cohérence:

```typescript
await prisma.$transaction(async (tx) => {
  // Récupère le compte
  const account = await tx.account.findUnique(...);

  // Crée la transaction
  await tx.transaction.create(...);

  // Met à jour le solde
  await tx.account.update(...);
});
```

## Configuration

### Variables d'environnement
```env
# Application
PORT=4000
NODE_ENV=development
SERVICE_NAME=digital-banking-api

# CORS
ALLOWED_ORIGINS=http://localhost:4200,https://app.example.com

# Auth
API_KEY=your-secret-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5433/digital_banking
```

## Déploiement

### Build
```bash
npm run build
```
Génère le code JavaScript dans `dist/`

### Production
```bash
npm start
```
Exécute `node dist/server.js`

### CI/CD
GitHub Actions automatise:
1. Installation des dépendances
2. Génération du Prisma Client
3. Linting (ESLint)
4. Build TypeScript
