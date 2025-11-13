# Repository Guidelines

## Project Structure & Module Organization
- `src/app.js` instantiates Express, middleware (CORS, morgan) and mounts `/api` routes; `src/server.js` boots HTTP.
- Feature code lives in `src/controllers`, `src/routes`, and `src/data` for in-memory fixtures. Config helpers belong in `src/config`.
- Add shared utilities under `src/lib` (create if needed) to keep controllers slim. Place future integration tests under `tests/` mirroring the route structure.

## Build, Test, and Development Commands
- `npm install` installs runtime + dev dependencies.
- `npm run dev` runs the API with nodemon reloading via `src/server.js`.
- `npm start` launches the production server with plain Node.
- `npm test` currently stubbed; replace with Jest or your preferred runner before contributing tests.

## Coding Style & Naming Conventions
- Stick to CommonJS modules (`require`/`module.exports`) until the repo migrates to ESM.
- Use 2-space indentation, single quotes for strings, and trailing commas only where JS syntax requires.
- Name routes with the resource they expose (e.g., `account.routes.js`), controllers as `<resource>.controller.js`, and data fixtures as plural nouns (`accounts.js`).

## Testing Guidelines
- Favor Jest + supertest for HTTP layers; place specs in `tests/<feature>/<route>.spec.js`.
- Mirror endpoint names in test descriptions (e.g., `GET /api/accounts should return all accounts`).
- Aim for coverage of happy-path and validation errors, especially for balance updates and CORS configuration.

## Commit & Pull Request Guidelines
- Commits should be scoped and written in imperative mood (`feat: add transaction controller` or `chore: tighten cors config`).
- Pull requests must describe the change, reference any tracking issue, list manual/automated tests run, and include API samples when behavior changes.

## Security & Configuration Tips
- Declare frontend origins via `ALLOWED_ORIGINS` in `.env` to prevent unsolicited traffic.
- Never commit secrets; share sample values in `.env.example` only.
