# Open Bank Project (OBP) Integration

Documentation complète de l'intégration avec l'API Open Bank Project.

## Table des matières
- [Introduction](#introduction)
- [Configuration](#configuration)
- [Authentification](#authentification)
- [Modules disponibles](#modules-disponibles)
- [Utilisation](#utilisation)
- [Exemples de code](#exemples-de-code)
- [Migration des endpoints](#migration-des-endpoints)
- [Ressources](#ressources)

---

## Introduction

### Qu'est-ce que Open Bank Project ?

**Open Bank Project (OBP)** est une plateforme d'API bancaire open source qui fournit des endpoints standardisés conformes aux standards :
- Open Banking (UK)
- PSD2 / XS2A (EU)
- Open Finance

### Mode d'intégration : Proxy

Notre backend Express agit comme **proxy** entre le frontend et l'API OBP :

```
Frontend (Angular) → Backend Express → OBP API
                         ↕
                    PostgreSQL (données custom)
```

**Avantages** :
- ✅ Contrôle total de la logique métier
- ✅ Combinaison de données OBP + données locales
- ✅ Sécurité : credentials OBP jamais exposés au frontend
- ✅ Flexibilité : possibilité de switcher entre OBP et mock data
- ✅ Cache et optimisations possibles

---

## Configuration

### 1. Variables d'environnement

Fichier `.env` :

```env
# Open Bank Project (OBP) Configuration
OBP_BASE_URL=https://apisandbox.openbankproject.com
OBP_CONSUMER_KEY=gcfjbwmkiqatb3kwggboti2lkzycvykorls5dudz
OBP_CONSUMER_SECRET=hnkros0y4lialwfvwr1ky5oufokslxnb3ujly1qi
OBP_DIRECT_LOGIN_ENDPOINT=/my/logins/direct

# OBP Test Credentials (Sandbox)
OBP_TEST_USERNAME=your-test-username
OBP_TEST_PASSWORD=your-test-password
```

### 2. Credentials OBP

**Consumer ID** : `db385351-eebd-401c-a360-ebc0b7f1b4ba`
**Application Name** : Digital-banking
**Developer Email** : omrani_salim@outlook.fr

### 3. Obtenir des utilisateurs de test

1. Aller sur https://apiexplorer-ii-sandbox.openbankproject.com
2. Section "Getting Started" → "Test Users"
3. Utiliser ces credentials pour `OBP_TEST_USERNAME` et `OBP_TEST_PASSWORD`

---

## Authentification

### Direct Login (recommandé)

OBP supporte plusieurs méthodes d'authentification. Nous utilisons **Direct Login** pour sa simplicité.

#### Flow d'authentification :

```typescript
import { obpClient } from './modules/obp';

// 1. Authentifier l'utilisateur
const token = await obpClient.directLogin({
  username: 'john.doe@example.com',
  password: 'user-password',
  consumerKey: process.env.OBP_CONSUMER_KEY!
});

// 2. Token stocké automatiquement dans obpClient
// 3. Utiliser le token pour les requêtes suivantes
```

#### Format du token

Le token est utilisé dans le header `DirectLogin` :

```
DirectLogin: token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Modules disponibles

### Structure du module OBP

```
src/modules/obp/
├── index.ts                      # Exports
├── obp.client.ts                 # Client HTTP avec auth
├── obp.types.ts                  # Types TypeScript
├── obp-accounts.service.ts       # Service comptes
└── obp-transactions.service.ts   # Service transactions
```

### Imports

```typescript
import {
  obpClient,
  obpAccountsService,
  obpTransactionsService,
  OBPAccount,
  OBPTransaction
} from './modules/obp';
```

---

## Utilisation

### OBP Client

Le client gère l'authentification et les requêtes HTTP.

```typescript
import obpClient from './modules/obp/obp.client';

// Authentification
const token = await obpClient.directLogin({
  username: 'user@example.com',
  password: 'password',
  consumerKey: process.env.OBP_CONSUMER_KEY!
});

// Requêtes authentifiées
const data = await obpClient.get('/obp/v5.1.0/banks', token);
```

### Accounts Service

```typescript
import obpAccountsService from './modules/obp/obp-accounts.service';

// Lister tous les comptes
const accounts = await obpAccountsService.getAccounts(token);

// Récupérer un compte par ID
const account = await obpAccountsService.getAccountById(
  'gh.29.uk',      // bankId
  'account-123',   // accountId
  token
);

// Rechercher par IBAN
const account = await obpAccountsService.searchAccountsByIBAN(
  'GB33BUKB20201555555555',
  token
);

// Récupérer les transactions d'un compte
const transactions = await obpAccountsService.getAccountTransactions(
  'gh.29.uk',      // bankId
  'account-123',   // accountId
  'owner',         // viewId
  token
);
```

### Transactions Service

```typescript
import obpTransactionsService from './modules/obp/obp-transactions.service';

// Récupérer les transactions avec filtres
const result = await obpTransactionsService.getTransactions(
  'gh.29.uk',
  'account-123',
  'owner',
  token,
  {
    from_date: '2025-01-01T00:00:00.000Z',
    to_date: '2025-12-31T23:59:59.999Z',
    limit: 50,
    offset: 0
  }
);

// Créer une transaction (payment)
const transaction = await obpTransactionsService.createTransaction(
  'gh.29.uk',
  'account-123',
  'owner',
  {
    value: {
      currency: 'EUR',
      amount: '100.50'
    },
    description: 'Payment for services'
  },
  token
);
```

---

## Exemples de code

### Exemple 1 : Controller hybride

Combiner OBP avec données locales :

```typescript
// accounts.controller.ts
import { Request, Response } from 'express';
import accountsService from './accounts.service';
import { obpClient, obpAccountsService } from '../obp';

export const listAccounts = async (req: Request, res: Response): Promise<Response> => {
  const useOBP = req.query.source === 'obp';

  if (useOBP) {
    // Utiliser OBP
    const token = req.headers['x-obp-token'] as string;
    if (!token) {
      return res.status(401).json({ message: 'OBP token required' });
    }

    const obpAccounts = await obpAccountsService.getAccounts(token);

    // Transformer format OBP → format local
    const accounts = obpAccounts.map(acc => ({
      id: acc.number,
      owner: acc.owners[0]?.display_name || 'Unknown',
      balance: parseFloat(acc.balance.amount),
      currency: acc.balance.currency,
      transactions: []
    }));

    return res.json({ accounts, source: 'obp' });
  }

  // Utiliser base de données locale
  const accounts = await accountsService.listAccounts();
  return res.json({ accounts, source: 'local' });
};
```

### Exemple 2 : Endpoint OBP dédié

Créer des routes spécifiques OBP :

```typescript
// obp.controller.ts
import { Request, Response } from 'express';
import { obpClient, obpAccountsService } from '../obp';

export const obpLogin = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  const token = await obpClient.directLogin({
    username,
    password,
    consumerKey: process.env.OBP_CONSUMER_KEY!
  });

  return res.json({ token });
};

export const obpAccounts = async (req: Request, res: Response): Promise<Response> => {
  const token = req.headers['x-obp-token'] as string;
  const accounts = await obpAccountsService.getAccounts(token);

  return res.json({ accounts });
};
```

### Exemple 3 : Middleware OBP auth

```typescript
// middleware/obp-auth.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const obpAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers['x-obp-token'] as string;

  if (!token) {
    res.status(401).json({
      message: 'OBP token required in x-obp-token header'
    });
    return;
  }

  // Token validé par OBP lors des requêtes
  next();
};
```

---

## Migration des endpoints

### Stratégie de migration progressive

#### Phase 1 : Endpoints parallèles (actuel)
```
GET /api/accounts          → Base de données locale
GET /api/obp/accounts      → OBP API
```

#### Phase 2 : Query parameter
```
GET /api/accounts?source=local    → Base de données
GET /api/accounts?source=obp      → OBP API
```

#### Phase 3 : Remplacement complet
```
GET /api/accounts → OBP uniquement
```

### Mapping des endpoints

| Endpoint Local | Endpoint OBP | Notes |
|----------------|--------------|-------|
| `GET /api/accounts` | `GET /obp/v5.1.0/my/accounts` | Liste comptes utilisateur |
| `GET /api/accounts/:id` | `GET /obp/v5.1.0/banks/{bank_id}/accounts/{account_id}/account` | Détail compte |
| `GET /api/transactions/:accountId` | `GET /obp/v5.1.0/banks/{bank_id}/accounts/{account_id}/{view_id}/transactions` | Transactions |
| `POST /api/accounts/:id/transactions` | `POST /obp/v5.1.0/banks/{bank_id}/accounts/{account_id}/{view_id}/transaction-request-types/SANDBOX_TAN/transaction-requests` | Créer transaction |

---

## Ressources

### Documentation officielle
- **API Explorer** : https://apiexplorer-ii-sandbox.openbankproject.com
- **Sandbox** : https://apisandbox.openbankproject.com
- **GitHub** : https://github.com/OpenBankProject/OBP-API
- **Documentation** : https://github.com/OpenBankProject/OBP-API/wiki

### Endpoints principaux (v5.1.0)

```
Base URL: https://apisandbox.openbankproject.com/obp/v5.1.0
```

- `GET /my/accounts` - Comptes de l'utilisateur
- `GET /banks` - Liste des banques
- `GET /banks/{bank_id}` - Détails banque
- `GET /banks/{bank_id}/accounts/{account_id}/account` - Détail compte
- `GET /banks/{bank_id}/accounts/{account_id}/{view_id}/transactions` - Transactions
- `POST /banks/{bank_id}/accounts/{account_id}/{view_id}/transaction-requests` - Créer transaction

### Support

- **Email** : contact@openbankproject.com
- **Chat** : chat.openbankproject.com
- **Issues GitHub** : https://github.com/OpenBankProject/OBP-API/issues

---

## Prochaines étapes

1. ✅ Configuration OBP terminée
2. ⏳ Créer endpoints OBP dédiés
3. ⏳ Ajouter tests d'intégration OBP
4. ⏳ Implémenter cache Redis pour OBP
5. ⏳ Créer dashboard admin pour gérer OBP vs local

---

## Notes importantes

⚠️ **Sécurité** :
- Ne jamais exposer `OBP_CONSUMER_KEY` et `OBP_CONSUMER_SECRET` au frontend
- Toujours valider les tokens côté backend
- `.env` est gitignored - ne jamais commit les credentials

⚠️ **Rate Limiting** :
- OBP sandbox a des limites de requêtes
- Implémenter un cache pour éviter les appels répétés

⚠️ **Environnements** :
- **Sandbox** : https://apisandbox.openbankproject.com (développement)
- **Production** : Nécessite un contrat avec une banque OBP
