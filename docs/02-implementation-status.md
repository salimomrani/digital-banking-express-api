# État d'implémentation des fonctionnalités

Ce document fait le lien entre les fonctionnalités prévues (voir `backend-feature.md`) et leur état d'implémentation actuel.

## Légende
- ✅ **Implémenté** - Fonctionnalité complète et testée
- 🚧 **Partiel** - Implémenté partiellement
- ⏳ **Planifié** - À implémenter
- 🔄 **En cours** - Développement en cours

---

## 1. Comptes bancaires

| Fonctionnalité | État | Endpoints | Notes |
|----------------|------|-----------|-------|
| Liste des comptes | ✅ | `GET /api/accounts` | Avec relations User et Transactions |
| Détail d'un compte | ✅ | `GET /api/accounts/:id` | Inclut historique transactions |
| Création de compte | ⏳ | - | À implémenter |
| Mise à jour de compte | ⏳ | - | À implémenter |
| Suppression de compte | ⏳ | - | À implémenter |
| Types de comptes | 🚧 | - | Champ `accountType` existe (checking/savings) |
| Solde en temps réel | ✅ | - | Calculé via Prisma |
| Verrouillage transactions | ✅ | - | Via Prisma `$transaction` (pessimiste) |

### Implémentation actuelle

**Repository** (`accounts.repository.ts`):
```typescript
- findAll(): Promise<Account[]>       // ✅
- findById(id): Promise<Account>      // ✅
- save(account): Promise<Account>     // ✅ (update balance)
- addTransaction(...)                 // ✅
```

**Service** (`accounts.service.ts`):
```typescript
- listAccounts(): Promise<Account[]>  // ✅
- getAccount(id): Promise<Account>    // ✅
```

---

## 2. Transactions

| Fonctionnalité | État | Endpoints | Notes |
|----------------|------|-----------|-------|
| Dépôt (credit) | ✅ | `POST /api/accounts/:id/transactions` | Type: 'credit' |
| Retrait (debit) | ✅ | `POST /api/accounts/:id/transactions` | Type: 'debit' avec validation solde |
| Transfert entre comptes | ⏳ | - | À implémenter |
| Référence unique | ✅ | - | ID auto-incrémenté Prisma |
| Catégorisation | ⏳ | - | Champ à ajouter au modèle |
| Horodatage | ✅ | - | `createdAt` automatique |
| Gestion doublons | ⏳ | - | Idempotence à implémenter |

### Implémentation actuelle

**Création de transaction** (`POST /api/accounts/:accountId/transactions`):
```json
{
  "type": "credit",     // ou "debit"
  "amount": 100.50,
  "label": "Salary deposit"
}
```

**Atomicité garantie**:
- Transaction PostgreSQL via `prisma.$transaction()`
- Lecture du solde + création transaction + mise à jour solde = opération atomique
- Rollback automatique en cas d'erreur

---

## 3. Historique et filtres

| Fonctionnalité | État | Endpoints | Notes |
|----------------|------|-----------|-------|
| Historique complet | ✅ | `GET /api/accounts/:id` | Inclus dans détail compte |
| Pagination | ⏳ | - | À implémenter avec Prisma `skip`/`take` |
| Filtre par date | ⏳ | - | Query params à ajouter |
| Filtre par type | ⏳ | - | Query params à ajouter |
| Filtre par montant | ⏳ | - | Query params à ajouter |
| Filtre par catégorie | ⏳ | - | Nécessite champ catégorie |
| Tri montant/date | 🚧 | - | Tri par date DESC implémenté |

### À implémenter

```typescript
// Exemple pagination + filtres
interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: 'credit' | 'debit';
  minAmount?: number;
  maxAmount?: number;
  category?: string;
  page?: number;
  limit?: number;
}

// Repository
async findTransactions(accountId: string, filters: TransactionFilters) {
  return prisma.transaction.findMany({
    where: {
      accountId,
      createdAt: {
        gte: filters.startDate,
        lte: filters.endDate
      },
      transactionType: filters.type,
      amount: {
        gte: filters.minAmount,
        lte: filters.maxAmount
      }
    },
    skip: (filters.page - 1) * filters.limit,
    take: filters.limit,
    orderBy: { createdAt: 'desc' }
  });
}
```

---

## 4. Sécurité & Auth

| Fonctionnalité | État | Notes |
|----------------|------|-------|
| Auth JWT | ⏳ | Actuellement API Key simple |
| Refresh tokens | ⏳ | À implémenter |
| Rôles (Admin/User) | ⏳ | Champ à ajouter au modèle User |
| Hashage passwords | ⏳ | Actuellement en clair (dev only!) |
| Rate limiting | ⏳ | express-rate-limit à ajouter |
| Audit log | ⏳ | Table à créer |

### Migration recommandée

**De**: API Key simple
**Vers**: JWT (access + refresh tokens)

```prisma
model User {
  // Existant
  id        Int      @id
  email     String   @unique
  password  String   // À hasher avec bcrypt

  // À ajouter
  role      String   @default("USER")  // USER | ADMIN
  isActive  Boolean  @default(true)

  // Relations
  refreshTokens RefreshToken[]
  auditLogs     AuditLog[]
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    Int
  expiresAt DateTime
  user      User     @relation(...)
}

model AuditLog {
  id        Int      @id @default(autoincrement())
  userId    Int
  action    String   // "CREATE_TRANSACTION", "LOGIN", etc.
  resource  String   // "account:123"
  metadata  Json?
  createdAt DateTime @default(now())
  user      User     @relation(...)
}
```

---

## 5. Statistiques

| Fonctionnalité | État | Endpoints | Notes |
|----------------|------|-----------|-------|
| Dépenses mensuelles | ⏳ | - | Agrégation Prisma à implémenter |
| Revenus mensuels | ⏳ | - | Agrégation Prisma à implémenter |
| API Graphiques | ⏳ | - | Données pour charts frontend |
| Classement catégories | ⏳ | - | Nécessite catégories |

### Exemple d'implémentation

```typescript
// Endpoint: GET /api/accounts/:id/statistics?month=2025-01
async getMonthlyStatistics(accountId: string, month: string) {
  const startDate = new Date(month + '-01');
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const stats = await prisma.transaction.groupBy({
    by: ['transactionType'],
    where: {
      accountId,
      createdAt: {
        gte: startDate,
        lt: endDate
      }
    },
    _sum: { amount: true },
    _count: true
  });

  return {
    expenses: stats.find(s => s.transactionType === 'debit')?._sum.amount || 0,
    income: stats.find(s => s.transactionType === 'credit')?._sum.amount || 0
  };
}
```

---

## 6. Automatisation

| Fonctionnalité | État | Notes |
|----------------|------|-------|
| Virements planifiés | ⏳ | node-cron ou agenda à ajouter |
| Prélèvements récurrents | ⏳ | Table ScheduledTransaction à créer |
| Notifications solde bas | ⏳ | Email/SMS service à intégrer |

### Architecture recommandée

```prisma
model ScheduledTransaction {
  id            Int      @id @default(autoincrement())
  fromAccountId Int
  toAccountId   Int?     // null si externe
  amount        Decimal
  frequency     String   // "DAILY", "WEEKLY", "MONTHLY"
  nextRunAt     DateTime
  isActive      Boolean  @default(true)

  fromAccount   Account  @relation(...)
}
```

Worker avec node-cron:
```typescript
// src/jobs/scheduled-transactions.ts
import cron from 'node-cron';

cron.schedule('0 * * * *', async () => {
  const pending = await prisma.scheduledTransaction.findMany({
    where: {
      nextRunAt: { lte: new Date() },
      isActive: true
    }
  });

  for (const scheduled of pending) {
    await executeScheduledTransaction(scheduled);
  }
});
```

---

## 7. Export

| Fonctionnalité | État | Librairies suggérées |
|----------------|------|----------------------|
| Export PDF | ⏳ | pdfkit ou puppeteer |
| Export CSV | ⏳ | fast-csv |
| Export Excel | ⏳ | exceljs |

### Exemple endpoint

```typescript
// GET /api/accounts/:id/export?format=pdf&from=2025-01-01&to=2025-01-31
async exportTransactions(accountId, format, dateRange) {
  const transactions = await getTransactions(accountId, dateRange);

  switch(format) {
    case 'pdf':
      return generatePDF(transactions);
    case 'csv':
      return generateCSV(transactions);
    case 'excel':
      return generateExcel(transactions);
  }
}
```

---

## 8. Gestion avancée

| Fonctionnalité | État | Notes |
|----------------|------|-------|
| OTP transferts | ⏳ | speakeasy + qrcode pour 2FA |
| Bénéficiaires | ⏳ | Table Beneficiary à créer |
| Multi-devises | 🚧 | Champ currency existe, conversion à implémenter |
| Système approbation | ⏳ | Workflow avec états (PENDING, APPROVED, REJECTED) |

---

## Priorités d'implémentation recommandées

### Phase 1 - Sécurité (URGENT)
1. ⚠️ **Hash passwords** avec bcrypt
2. Migration vers JWT (access + refresh tokens)
3. Système de rôles (USER/ADMIN)
4. Rate limiting

### Phase 2 - Fonctionnalités core
1. CRUD complet comptes
2. Transferts entre comptes
3. Pagination et filtres transactions
4. Catégorisation

### Phase 3 - Analytics
1. Statistiques mensuelles
2. Graphiques et dashboards
3. Export PDF/CSV

### Phase 4 - Automatisation
1. Virements planifiés
2. Notifications
3. Prélèvements récurrents

### Phase 5 - Avancé
1. Multi-devises avec API conversion
2. OTP et 2FA
3. Système d'approbation
4. Audit complet
