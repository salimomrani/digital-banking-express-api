# Documentation Backend - Digital Banking API

Bienvenue dans la documentation technique du backend de l'application Digital Banking.

## 📚 Structure de la documentation

### 1. [Architecture](01-architecture.md)
Vue d'ensemble de l'architecture technique du projet:
- Stack technique (Express, TypeScript, Prisma, PostgreSQL)
- Architecture en couches (Controller → Service → Repository)
- Structure des modules
- Modèle de données
- Sécurité et gestion des erreurs
- Configuration et déploiement

**À lire en premier** pour comprendre les fondations du projet.

### 2. [État d'implémentation](02-implementation-status.md)
Suivi détaillé de toutes les fonctionnalités:
- ✅ Fonctionnalités implémentées
- 🚧 Fonctionnalités partielles
- ⏳ Fonctionnalités planifiées
- Exemples de code pour chaque fonctionnalité
- Priorités d'implémentation recommandées

**Consultez ce document** avant de commencer une nouvelle feature pour éviter les doublons.

### 3. [Guide de développement](03-development-guide.md)
Guide pratique pour développer de nouvelles fonctionnalités:
- Comment ajouter un nouveau module
- Patterns et conventions du projet
- Transactions Prisma
- Gestion des erreurs
- Tests (à implémenter)
- Performance et optimisations
- Workflow Git

**Suivez ce guide** lors de l'implémentation de nouvelles features.

### 4. [Fonctionnalités planifiées](backend-feature.md)
Liste complète des fonctionnalités à implémenter:
- Comptes bancaires (CRUD complet)
- Transactions avancées
- Historique et filtres
- Sécurité & authentification
- Statistiques
- Automatisation
- Export de données
- Gestion avancée

**Référez-vous à ce document** pour la vision produit globale.

---

## 🚀 Quick Start

### Pour un nouveau développeur

1. **Comprendre l'architecture**
   ```bash
   # Lire la documentation d'architecture
   cat src/docs/01-architecture.md
   ```

2. **Installer et lancer le projet**
   ```bash
   # Installer les dépendances
   npm install

   # Démarrer PostgreSQL
   docker-compose up -d

   # Initialiser la base de données
   npx prisma db push
   npm run prisma:seed

   # Lancer le serveur
   npm run dev
   ```

3. **Tester l'API**
   ```bash
   # Health check
   curl http://localhost:4000/health

   # Login
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john.doe@example.com","password":"hashed_password_1"}'

   # Liste des comptes
   curl http://localhost:4000/api/accounts \
     -H "x-api-key: local-dev-key"
   ```

4. **Explorer le code**
   ```bash
   # Structure d'un module
   src/modules/accounts/
   ├── accounts.controller.ts   # HTTP handlers
   ├── accounts.service.ts       # Business logic
   ├── accounts.repository.ts    # Data access (Prisma)
   ├── accounts.routes.ts        # Route definitions
   └── accounts.schemas.ts       # Zod validation
   ```

### Pour implémenter une nouvelle feature

1. Consulter `02-implementation-status.md` pour voir si la feature existe
2. Suivre le guide dans `03-development-guide.md`
3. Créer une feature branch: `git checkout -b feature/nom-feature`
4. Implémenter en suivant les patterns du projet
5. Tester localement
6. Créer une PR vers `main`

---

## 📖 Ressources externes

### Prisma
- [Documentation Prisma](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

### Express
- [Express Documentation](https://expressjs.com/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript with Node.js](https://www.typescriptlang.org/docs/handbook/nodejs.html)

### Zod
- [Zod Documentation](https://zod.dev/)
- [Zod with TypeScript](https://zod.dev/?id=basic-usage)

---

## 🔧 Commandes utiles

### Développement
```bash
npm run dev              # Démarrer le serveur avec hot-reload
npm run build            # Compiler TypeScript → JavaScript
npm run lint             # Vérifier le code avec ESLint
npm test                 # Exécuter les tests (lint pour l'instant)
```

### Base de données
```bash
# Docker
docker-compose up -d     # Démarrer PostgreSQL
docker-compose down      # Arrêter PostgreSQL
docker-compose logs -f   # Voir les logs PostgreSQL

# Prisma
npx prisma studio        # Interface visuelle BD
npx prisma db push       # Synchroniser schéma → BD
npx prisma generate      # Générer Prisma Client
npm run prisma:seed      # Peupler avec données test

# Migrations (production)
npx prisma migrate dev   # Créer une migration
npx prisma migrate deploy # Appliquer les migrations
```

### Git
```bash
git checkout -b feature/nom         # Nouvelle feature
git commit -m "feat: description"   # Commit avec convention
git push -u origin feature/nom      # Push branch
gh pr create --base main            # Créer PR
```

---

## 📝 Conventions du projet

### Nommage
- **Fichiers**: kebab-case (`accounts.controller.ts`)
- **Classes**: PascalCase (`AccountsService`)
- **Variables/Fonctions**: camelCase (`findById`)
- **Constantes**: SCREAMING_SNAKE_CASE (`API_KEY`)
- **Types/Interfaces**: PascalCase (`CreateAccountInput`)

### Commits
Format: `type: description`

Types:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `refactor`: Refactoring
- `chore`: Tâches de maintenance
- `test`: Ajout de tests

Exemples:
```
feat: add pagination to transactions endpoint
fix: correct balance calculation in debit transactions
docs: update API documentation for accounts
refactor: simplify error handling in services
```

### Structure des réponses API
```typescript
// Success
{
  "account": { ... },
  // ou
  "accounts": [ ... ]
}

// Error
{
  "message": "Description de l'erreur",
  "details": { ... }  // optionnel (validation, etc.)
}
```

---

## 🐛 Debugging

### Logs Prisma
Activer les logs Prisma en développement:
```typescript
// src/config/db.ts
export const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']  // Voir toutes les requêtes SQL
});
```

### VS Code Debug
Fichier `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Dev Server",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "dev"],
  "console": "integratedTerminal",
  "skipFiles": ["<node_internals>/**"]
}
```

---

## 🤝 Contribution

1. Fork le projet
2. Créer une feature branch
3. Implémenter en suivant les conventions
4. S'assurer que lint et build passent
5. Créer une PR détaillée

---

## 📞 Support

- GitHub Issues: [digital-banking-express-api/issues](https://github.com/salimomrani/digital-banking-express-api/issues)
- Documentation Prisma: https://www.prisma.io/docs
- Express Guide: https://expressjs.com/en/guide/routing.html

---

## 🎯 Prochaines étapes

Voir [État d'implémentation - Priorités](02-implementation-status.md#priorités-dimplémentation-recommandées) pour la roadmap.

**Phase 1 prioritaire**: Sécurité
- ⚠️ Hash des passwords avec bcrypt
- Migration vers JWT
- Rate limiting
- Audit logging
