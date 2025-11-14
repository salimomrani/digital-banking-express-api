# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with auto-reload using ts-node-dev
- `npm run build` - Compile TypeScript to JavaScript (outputs to dist/)
- `npm start` - Run production build (requires `npm run build` first)
- `npm run lint` - Run ESLint on all TypeScript files
- `npm test` - Currently runs lint (no unit tests configured yet)

### Environment Setup
Copy `.env.example` to `.env` before running. Key variables:
- `API_KEY` - Required for API authentication (returned by POST /api/auth/login and validated via x-api-key header)
- `ALLOWED_ORIGINS` - Comma-separated list of CORS origins (e.g., `http://localhost:4200,https://app.example.com`)

## Architecture

### Domain-Driven Module Structure
The codebase follows a domain-oriented architecture where each feature is organized into modules under `src/modules/`. Each module contains:
- `*.controller.ts` - Express request/response handlers
- `*.service.ts` - Business logic layer
- `*.repository.ts` - Data access layer (currently in-memory, designed for database later)
- `*.routes.ts` - Route definitions and middleware setup
- `*.schemas.ts` - Zod validation schemas for request/response payloads

### Core Infrastructure
- `src/core/middleware/` - Shared middleware (error-handler.ts, api-key.middleware.ts)
- `src/core/errors/` - Custom error classes (HttpException)
- `src/core/utils/` - Shared utilities (logger.ts)
- `src/config/` - Configuration management (env.ts, db.ts)
- `src/models/` - Data model definitions (TypeScript interfaces)

### Application Flow
1. `src/server.ts` - Entry point, creates HTTP server and initializes app
2. `src/app.ts` - Express app setup, CORS, middleware, and route registration
3. All API routes are prefixed with `/api/` (e.g., `/api/accounts`, `/api/auth`, `/api/transactions`)
4. Protected routes (accounts, transactions) require `x-api-key` header via `apiKeyMiddleware`
5. Errors are centralized through `error-handler.ts` which handles HttpException, ZodError, and generic errors

### Request Validation
- All input validation uses Zod schemas defined in each module's `*.schemas.ts`
- Validation errors are automatically caught by error-handler.ts and return 400 status
- Access the schemas via the module's schemas file (e.g., `auth.schemas.ts`, `accounts.schemas.ts`)

### Authentication Pattern
- API uses simple API key authentication (not JWT)
- POST /api/auth/login returns the configured API_KEY
- Protected routes validate the key via `apiKeyMiddleware` (src/core/middleware/api-key.middleware.ts:4)
- Auth validation is centralized in `authService.validateApiKey()` (src/modules/auth/auth.service.ts)

### Data Persistence
- Currently uses in-memory storage (arrays in repository files)
- Repository pattern is in place to facilitate future database integration
- `src/config/db.ts` has a placeholder `connectDb()` function for future database setup

## Git Workflow (Gitflow)

This project follows **Gitflow** branching strategy:

### Branch Structure
- `main` - Current development branch
- `feature/express-backend` - Main integration branch (target for pull requests)
- `feature/*` - Feature branches (e.g., `feature/user-authentication`, `feature/transaction-history`)
- `fix/*` - Bug fix branches (e.g., `fix/validation-error`, `fix/cors-config`)
- `docs/*` - Documentation branches (e.g., `docs/api-reference`, `docs/setup-guide`)
- `chore/*` - Maintenance branches (e.g., `chore/update-dependencies`, `chore/eslint-config`)

### Workflow
1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

2. **Work on your changes** with meaningful commits:
   ```bash
   git add .
   git commit -m "feat: add user profile endpoint"
   ```

3. **Push your branch** to remote:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. **Create a Pull Request** targeting `feature/express-backend` (not `main`)

5. **After PR is merged**, delete the feature branch and pull latest changes:
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/your-feature-name
   ```

### Commit Message Convention
Use conventional commits format:
- `feat:` - New feature (e.g., `feat: add transaction filtering`)
- `fix:` - Bug fix (e.g., `fix: correct balance calculation`)
- `docs:` - Documentation changes (e.g., `docs: update API routes`)
- `chore:` - Maintenance tasks (e.g., `chore: update dependencies`)
- `refactor:` - Code refactoring (e.g., `refactor: simplify auth logic`)

### Important Notes
- **Always create PRs to `feature/express-backend`**, not `main`
- Run `npm run lint` and `npm run build` before committing to ensure CI passes
- Keep feature branches focused on a single feature or fix
- Delete branches after they're merged to keep the repository clean

## CI/CD
GitHub Actions workflow at `.github/workflows/ci.yml`:
- Runs on push/PR to main branch
- Creates ephemeral .env from GitHub secret `ENV_FILE`
- Runs `npm install`, `npm run lint`, and `npm run build`
- Configure `ENV_FILE` secret in GitHub repo settings (Actions → Secrets and variables)
