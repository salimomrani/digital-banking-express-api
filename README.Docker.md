# Docker Setup for Digital Banking Backend

## Quick Start

### 1. Start PostgreSQL Database

```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL 16 container
- Create the `digital_banking` database
- Run the initialization script (`docker/init.sql`) to create tables and seed data
- Expose PostgreSQL on port 5432

### 2. Check Database Status

```bash
docker-compose ps
```

### 3. View Database Logs

```bash
docker-compose logs postgres
```

### 4. Connect to PostgreSQL

Using psql:
```bash
docker-compose exec postgres psql -U banking_user -d digital_banking
```

Using any PostgreSQL client:
- Host: localhost
- Port: 5432
- Database: digital_banking
- Username: banking_user
- Password: banking_password

### 5. Stop Database

```bash
docker-compose down
```

To stop and remove volumes (delete all data):
```bash
docker-compose down -v
```

## Database Schema

The database includes three main tables:

- **users**: User accounts with authentication
- **accounts**: Bank accounts linked to users
- **transactions**: Transaction history for each account

See `docker/init.sql` for the complete schema and seed data.

## Development

After starting the database, run the backend:

```bash
npm run dev
```

The backend will automatically connect to the PostgreSQL database using the credentials in your `.env` file.
