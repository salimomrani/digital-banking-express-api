# Repository Guidelines

## Project Structure & Module Organization
- `src/app.ts` wires Express, middleware, and routing; `src/server.ts` owns process bootstrap.
- Route handlers live in `src/routes`, controller logic in `src/controllers`, and in-memory fixtures in `src/data`. Configuration helpers sit in `src/config`.
- Create shared helpers under `src/lib` (if needed) and mirror route structure inside a future `tests/` folder for integration specs.

## Build, Test, and Development Commands
- `npm install` pulls runtime + dev tooling (TypeScript, ESLint).
- `npm run dev` runs `ts-node-dev` with hot reload from `src/server.ts`.
- `npm run build` compiles TypeScript to `dist/` via `tsc`.
- `npm start` expects a fresh build and runs `node dist/server.js`.
- `npm run lint` (aliased as `npm test`) executes ESLint on all `.ts` files.

## Coding Style & Naming Conventions
- TypeScript + CommonJS: default exports for singletons (`export default app`) and named exports for controller functions.
- Follow the ESLint flat config (`eslint.config.mjs`): 2-space indentation, single quotes, underscore prefix for intentionally unused params.
- Name files by responsibility: `account.routes.ts`, `account.controller.ts`, `accounts.ts`, etc.; keep DTO/utility types close to their usage.

## Testing Guidelines
- Until Jest is introduced, `npm test` runs linting—do not skip it in PRs.
- When adding Jest + supertest, colocate specs in `tests/<feature>/<endpoint>.spec.ts` and cover success + validation errors for each route.

## Commit & Pull Request Guidelines
- Write imperative commits scoped to a single concern (`feat: add transaction endpoint validation`, `chore: enable eslint flat config`).
- PRs should summarize the change, link issues, note manual/automated checks (`npm run lint`, `npm run build`), and document API contract updates.

## Security & Configuration Tips
- Manage origins via `ALLOWED_ORIGINS` in `.env` (comma-separated); keep `.env.example` authoritative for safe defaults.
- Never commit real secrets; prefer temporary `.env.local` overrides ignored by git.
- In CI, store the entire `.env` content inside the `ENV_FILE` repository secret; the workflow writes it to `.env` before lint/build so pipelines mirror local config.

## Recommended Enhancements
- Add persistence/integration points (PostgreSQL + Prisma or MongoDB) behind repository modules to swap out the mock data safely.
- Introduce Jest + supertest plus coverage thresholds for the HTTP layer before growing the API surface.
- Layer structured logging (pino/Winston) and metrics (Prometheus or OpenTelemetry) for production-grade observability.
