# Docker Setup for Digital Banking Backend

## Quick Start

### 1. Start PostgreSQL Database

```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL 16 container
- Create the `digital_banking` database
- Expose PostgreSQL on port 5433 (avoiding conflict with local PostgreSQL on 5432)

### 2. Initialize Database Schema with Prisma

```bash
npx prisma db push
npm run prisma:seed
```

This will:
- Create the database tables based on `prisma/schema.prisma`
- Seed the database with development data

### 3. Check Database Status

```bash
docker-compose ps
```

### 4. View Database Logs

```bash
docker-compose logs postgres
```

### 5. Connect to PostgreSQL

Using psql:
```bash
docker-compose exec postgres psql -U banking_user -d digital_banking
```

Using Prisma Studio (visual database browser):
```bash
npx prisma studio
```

Using any PostgreSQL client:
- Host: localhost
- Port: 5433
- Database: digital_banking
- Username: banking_user
- Password: banking_password

### 6. Stop Database

```bash
docker-compose down
```

To stop and remove volumes (delete all data):
```bash
docker-compose down -v
# You'll need to re-run: npx prisma db push && npm run prisma:seed
```

## Database Schema

The database uses **Prisma ORM** with three main models defined in `prisma/schema.prisma`:

- **User**: User accounts with authentication
- **Account**: Bank accounts linked to users
- **Transaction**: Transaction history for each account

## Prisma Commands

- `npx prisma studio` - Open visual database editor
- `npx prisma db push` - Sync schema changes to database
- `npx prisma generate` - Regenerate Prisma Client
- `npm run prisma:seed` - Seed database with test data
- `npx prisma migrate dev` - Create and apply migrations (for production)

## Development

After starting the database and running Prisma setup, start the backend:

```bash
npm run dev
```

The backend will automatically connect to the PostgreSQL database via Prisma using the credentials in your `.env` file.
