# Guide de développement

Ce guide explique comment ajouter de nouvelles fonctionnalités en suivant les conventions du projet.

## Ajouter un nouveau module

### 1. Créer la structure du module

```bash
mkdir -p src/modules/nom-module
cd src/modules/nom-module

touch nom-module.controller.ts
touch nom-module.service.ts
touch nom-module.repository.ts
touch nom-module.routes.ts
touch nom-module.schemas.ts
```

### 2. Définir le schéma Prisma

Éditer `prisma/schema.prisma`:

```prisma
model NomModele {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("nom_table")
}
```

Puis synchroniser:
```bash
npx prisma db push
npx prisma generate
```

### 3. Créer le repository

**Pattern**: Le repository gère uniquement l'accès aux données via Prisma.

```typescript
// nom-module.repository.ts
import { prisma } from '../../config/db';
import { NomModele } from '@prisma/client';

class NomModuleRepository {
  async findAll(): Promise<NomModele[]> {
    return await prisma.nomModele.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number): Promise<NomModele | null> {
    return await prisma.nomModele.findUnique({
      where: { id }
    });
  }

  async create(data: Omit<NomModele, 'id' | 'createdAt' | 'updatedAt'>): Promise<NomModele> {
    return await prisma.nomModele.create({
      data
    });
  }

  async update(id: number, data: Partial<NomModele>): Promise<NomModele> {
    return await prisma.nomModele.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.nomModele.delete({
      where: { id }
    });
  }
}

export default new NomModuleRepository();
```

### 4. Créer les schémas de validation Zod

**Pattern**: Valider toutes les entrées utilisateur.

```typescript
// nom-module.schemas.ts
import { z } from 'zod';

export const createNomModuleSchema = z.object({
  name: z.string().min(3).max(100),
  // autres champs...
});

export const updateNomModuleSchema = createNomModuleSchema.partial();

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number)
});

export type CreateNomModuleInput = z.infer<typeof createNomModuleSchema>;
export type UpdateNomModuleInput = z.infer<typeof updateNomModuleSchema>;
```

### 5. Créer le service

**Pattern**: Le service contient la logique métier.

```typescript
// nom-module.service.ts
import nomModuleRepository from './nom-module.repository';
import HttpException from '../../core/errors/http-exception';
import { CreateNomModuleInput, UpdateNomModuleInput } from './nom-module.schemas';

class NomModuleService {
  async list() {
    return await nomModuleRepository.findAll();
  }

  async getById(id: number) {
    const item = await nomModuleRepository.findById(id);
    if (!item) {
      throw new HttpException(404, 'Ressource non trouvée');
    }
    return item;
  }

  async create(data: CreateNomModuleInput) {
    // Logique métier (validation, calculs, etc.)
    return await nomModuleRepository.create(data);
  }

  async update(id: number, data: UpdateNomModuleInput) {
    await this.getById(id); // Vérifie l'existence
    return await nomModuleRepository.update(id, data);
  }

  async delete(id: number) {
    await this.getById(id); // Vérifie l'existence
    await nomModuleRepository.delete(id);
  }
}

export default new NomModuleService();
```

### 6. Créer le controller

**Pattern**: Le controller gère les requêtes/réponses HTTP.

```typescript
// nom-module.controller.ts
import { Request, Response } from 'express';
import nomModuleService from './nom-module.service';
import { createNomModuleSchema, updateNomModuleSchema, idParamSchema } from './nom-module.schemas';

export const list = async (_req: Request, res: Response): Promise<Response> => {
  const items = await nomModuleService.list();
  return res.json({ items });
};

export const getById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = idParamSchema.parse(req.params);
  const item = await nomModuleService.getById(id);
  return res.json({ item });
};

export const create = async (req: Request, res: Response): Promise<Response> => {
  const data = createNomModuleSchema.parse(req.body);
  const item = await nomModuleService.create(data);
  return res.status(201).json({ item });
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = idParamSchema.parse(req.params);
  const data = updateNomModuleSchema.parse(req.body);
  const item = await nomModuleService.update(id, data);
  return res.json({ item });
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { id } = idParamSchema.parse(req.params);
  await nomModuleService.delete(id);
  return res.status(204).send();
};
```

### 7. Créer les routes

**Pattern**: Définir les endpoints et middleware.

```typescript
// nom-module.routes.ts
import { Router } from 'express';
import apiKeyMiddleware from '../../core/middleware/api-key.middleware';
import * as controller from './nom-module.controller';

const router = Router();

// Appliquer le middleware d'authentification
router.use(apiKeyMiddleware);

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
```

### 8. Enregistrer les routes dans app.ts

```typescript
// src/app.ts
import nomModuleRoutes from './modules/nom-module/nom-module.routes';

// ...
app.use('/api/nom-module', nomModuleRoutes);
```

---

## Transactions atomiques avec Prisma

### Simple transaction
```typescript
async createTransactionWithUpdate(accountId: number, amount: number) {
  return await prisma.$transaction(async (tx) => {
    // Créer la transaction
    const transaction = await tx.transaction.create({
      data: { accountId, amount }
    });

    // Mettre à jour le solde
    await tx.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: amount
        }
      }
    });

    return transaction;
  });
}
```

### Transaction avec retry
```typescript
async createWithRetry(data: any) {
  const maxRetries = 3;
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Vos opérations...
      });
    } catch (error) {
      lastError = error;
      // Attendre avant de réessayer
      await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
    }
  }

  throw lastError;
}
```

---

## Tests (à implémenter)

### Structure recommandée
```
src/modules/nom-module/
├── __tests__/
│   ├── nom-module.repository.test.ts
│   ├── nom-module.service.test.ts
│   └── nom-module.controller.test.ts
```

### Exemple avec Jest + Prisma
```typescript
// __tests__/nom-module.service.test.ts
import { beforeEach, describe, expect, it } from '@jest/globals';
import { prisma } from '../../../config/db';

beforeEach(async () => {
  // Clean database before each test
  await prisma.nomModele.deleteMany();
});

describe('NomModuleService', () => {
  it('should create item', async () => {
    const data = { name: 'Test' };
    const item = await nomModuleService.create(data);

    expect(item.name).toBe(data.name);
  });

  it('should throw 404 when item not found', async () => {
    await expect(nomModuleService.getById(999))
      .rejects
      .toThrow('Ressource non trouvée');
  });
});
```

---

## Gestion des erreurs

### Custom errors
```typescript
// src/core/errors/validation-error.ts
export class ValidationError extends HttpException {
  constructor(message: string, details?: unknown) {
    super(400, message, details);
  }
}

// src/core/errors/not-found-error.ts
export class NotFoundError extends HttpException {
  constructor(resource: string) {
    super(404, `${resource} non trouvé`);
  }
}

// Usage
throw new NotFoundError('Compte');
throw new ValidationError('Solde insuffisant');
```

---

## Logging

### Utiliser le logger existant
```typescript
import logger from '../../core/utils/logger';

logger.info('Operation completed', { userId: 123 });
logger.warn('Low balance detected', { accountId: 456 });
logger.error('Transaction failed', error);
```

### Ajouter des métadonnées structurées
```typescript
logger.info('Transaction created', {
  transactionId: transaction.id,
  accountId: account.id,
  amount: transaction.amount,
  timestamp: new Date().toISOString()
});
```

---

## Performance

### Eager loading avec Prisma
```typescript
// ❌ N+1 query problem
const accounts = await prisma.account.findMany();
for (const account of accounts) {
  const user = await prisma.user.findUnique({ where: { id: account.userId } });
}

// ✅ Single query with include
const accounts = await prisma.account.findMany({
  include: { user: true }
});
```

### Sélection de champs
```typescript
// Récupérer uniquement les champs nécessaires
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    // password excluded
  }
});
```

### Indexes
```prisma
model Transaction {
  accountId Int
  createdAt DateTime

  @@index([accountId, createdAt])  // Index composé
}
```

---

## Migration base de données

### Créer une migration
```bash
npx prisma migrate dev --name add_category_to_transactions
```

### Appliquer en production
```bash
npx prisma migrate deploy
```

### Reset (dev uniquement)
```bash
npx prisma migrate reset
npm run prisma:seed
```

---

## Git Workflow

### Créer une feature branch
```bash
git checkout main
git pull origin main
git checkout -b feature/nom-fonctionnalite
```

### Commits
Suivre conventional commits:
```bash
git commit -m "feat: add category support for transactions"
git commit -m "fix: correct balance calculation in transfers"
git commit -m "docs: update API documentation"
```

### Pull Request
```bash
git push -u origin feature/nom-fonctionnalite
gh pr create --base main --title "feat: add category support"
```

---

## Checklist avant PR

- [ ] Tests ajoutés et passent
- [ ] Lint passe (`npm run lint`)
- [ ] Build passe (`npm run build`)
- [ ] Documentation mise à jour
- [ ] Prisma schema à jour
- [ ] Variables d'env documentées dans `.env.example`
- [ ] Pas de secrets commités
- [ ] Commit messages suivent conventions
