# Backend API for SIDAN Lab Governance Discord Bot

This is the backend API, used to interact with the Discord Bot for SIDAN Lab Governance.

## Getting Started

### Installation

```shell
yarn # or npm install
```

## Pre-requisites

1. (For database) Download and set up local PostgreSQL database, or use a cloud-based database service, like (Supabase)[https://supabase.com/].

### Environment Variables

Create a `.env` file in the workspace repository and set the environment variables according to `.env.example`. For details, please refer to the internal documentation.

For database schema changes & migrations, port 5432 should be used for the database connection.

```
"postgresql://postgres:<database_password>@/sidan-gov?host=/cloudsql/gcp_project_id>:<region>>:<database_instance_name>"
```

For database connection & operation, port 6543 should be used.

```
DATABASE_URL=postgresql://postgres:password@the.postgres.ip.address:6543
```

### Running database migrations

Environment variable must be set for `DATABASE_URL` to connect to the database.

```shell
yarn db:generate # or npm run db:generate
```

### Running the server

The server will start on http://localhost:3002 by default.

```shell
yarn dev # or npm run dev
```

## Swagger Documentation

`/api-docs` will show the Swagger documentation for the API.

## Testing

```shell
yarn test # or npm test
```

testing
