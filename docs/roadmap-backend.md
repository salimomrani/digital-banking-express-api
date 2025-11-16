# 🧩 Roadmap Backend – Digital Banking API (Express + Prisma + PostgreSQL)

## Phase 1 — Foundation
- [x] Initialiser projet Express + TypeScript
- [x] Architecture modules (auth / accounts / transactions)
- [x] Mise en place Zod (validation)
- [x] Logger (custom basé sur console)
- [x] Middlewares : API-Key, error-handler, CORS
- [x] Endpoint /health
- [x] Intégration Prisma
- [x] Modèles Prisma : User, Account, Transaction
- [x] Prisma Migrations (via db push)
- [x] Prisma Seed

## Phase 2 — Authentification & Sécurité
- [ ] Auth JWT (access + refresh) — actuellement API Key simple
- [ ] Hashage bcrypt — ⚠️ passwords en clair (dev only)
- [ ] Rôles user/admin
- [ ] Rate limiting (login)
- [x] Guard middleware (API Key)
- [ ] Audit logs

## Phase 3 — Comptes bancaires
- [x] CRUD comptes — Read implémenté (GET list, GET by ID)
- [ ] CRUD comptes — Create, Update, Delete à implémenter
- [ ] Statuts (active, blocked)
- [x] Types (checking, saving) — champ accountType existe
- [ ] Filtrage & pagination
- [x] Recherche par IBAN — GET /api/accounts/:accountNumber

## Phase 4 — Transactions
- [x] Dépôt / retrait — POST /api/accounts/:id/transactions (credit/debit)
- [ ] Transfert interne
- [x] Transactions atomiques (Prisma.$transaction)
- [x] Mise à jour solde
- [x] Historique — GET /api/transactions/:accountId
- [ ] Historique filtrable (dates, types, montants)
- [ ] Référence unique (idempotence)
- [ ] Export CSV
- [ ] Export PDF (relevé bancaire)

## Phase 5 — Services avancés
- [ ] OTP pour transfert
- [ ] Notifications email
- [ ] Virements programmés (cron)
- [ ] Multi-devise + API taux
- [ ] Journaux d’audit avancés

## Phase 6 — Tests & Qualité
- [ ] Tests unitaires (Jest)
- [ ] Tests e2e API (Supertest)
- [ ] Tests charge (k6)
- [ ] Tests de concurrence (solde)