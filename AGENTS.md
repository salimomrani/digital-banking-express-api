# Repository Guidelines

## Project Structure & Module Organization
- `src/app.ts` assemble Express + middlewares; `src/server.ts` bootstraps HTTP & la connexion DB (mock). 
- `src/config` regroupe `env.ts` et `db.ts`; `src/core` héberge erreurs, middlewares partagés, utilitaires (logger) et types globaux.
- Chaque domaine vit dans `src/modules/<feature>` avec `controller/service/routes/repository/schemas`. Les modèles partagés se trouvent dans `src/models`. Crée les tests correspondants dans `tests/<feature>/`.

## Build, Test, and Development Commands
- `npm install` pulls runtime + dev tooling (TypeScript, ESLint).
- `npm run dev` runs `ts-node-dev` with hot reload from `src/server.ts`.
- `npm run build` compiles TypeScript to `dist/` via `tsc`.
- `npm start` expects a fresh build and runs `node dist/server.js`.
- `npm run lint` (aliased as `npm test`) executes ESLint on all `.ts` files.

## Coding Style & Naming Conventions
- TypeScript strict + CommonJS; privilégie les exports nommés pour les handlers et default pour les services singletons.
- Respecte `eslint.config.mjs` (indentation 2 espaces, single quotes, `_` pour les args inutilisés). 
- Les schémas Zod résident dans `*.schemas.ts` et doivent être importés au niveau controller avant d'appeler la couche service.

## Testing Guidelines
- Tant que Jest n'est pas branché, `npm test` se limite au lint : toute PR doit être lint-clean.
- Dès que Jest/supertest arrive, place les specs sous `tests/<feature>/...` pour couvrir success paths, validation Zod et erreurs métier (ex : solde insuffisant).

## Commit & Pull Request Guidelines
- Write imperative commits scoped to a single concern (`feat: add transaction endpoint validation`, `chore: enable eslint flat config`).
- PRs should summarize the change, link issues, note manual/automated checks (`npm run lint`, `npm run build`), and document API contract updates.

## Security & Configuration Tips
- Variables `.env` : `ALLOWED_ORIGINS`, `API_KEY`, etc. Ne les versionne jamais; alimente le secret GitHub `ENV_FILE` pour la CI.
- Les routes `accounts`/`transactions` passent par `api-key.middleware.ts`; conserve cette protection pour toute nouvelle route sensible.

## Recommended Enhancements
- Add persistence/integration points (PostgreSQL + Prisma or MongoDB) behind repository modules to swap out the mock data safely.
- Introduce Jest + supertest plus coverage thresholds for the HTTP layer before growing the API surface.
- Layer structured logging (pino/Winston) and metrics (Prometheus or OpenTelemetry) for production-grade observability.
