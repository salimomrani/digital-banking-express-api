# Project Overview

This is a Node.js Express backend for a digital banking API. It is written in TypeScript and uses Prisma as the ORM for interacting with a PostgreSQL database. The application provides RESTful endpoints for managing user accounts and transactions.

## Architecture

The project follows a modular architecture, with a clear separation of concerns. The main components are:

-   `src/app.ts`: The main Express application file, where middleware and routes are configured.
-   `src/modules`: Contains the different modules of the application, such as `auth`, `accounts`, and `transactions`. Each module has its own controllers, services, repositories, routes, and validation schemas.
-   `src/core`: Contains core functionalities like error handling and middleware.
-   `prisma`: Contains the Prisma schema file (`schema.prisma`) which defines the database models.

## Building and Running

### Installation

To install the dependencies, run:

```bash
npm install
```

### Running the Application

-   **Development:** To run the application in development mode with hot-reloading, use:

    ```bash
    npm run dev
    ```

-   **Production:** To build and run the application in production, use:

    ```bash
    npm run build
    npm start
    ```

### Testing

To run the linter, use:

```bash
npm run lint
```

The project also has a test script, which currently only runs the linter:

```bash
npm test
```

## Development Conventions

-   **TypeScript:** The entire codebase is written in TypeScript.
-   **ESLint:** The project uses ESLint with the `@typescript-eslint` plugin to enforce a consistent coding style.
-   **Zod:** Zod is used for validating incoming request payloads.
-   **Prisma:** Prisma is used as the ORM for database interactions.
-   **API Key Authentication:** Most routes are protected by an API key, which is validated by the `apiKeyMiddleware`.
-   **Conventional Commits:** While not explicitly stated, the presence of a `CHANGELOG.md` and the structure of the project suggest that following a convention for commit messages would be beneficial.
