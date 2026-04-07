# MindFlow Server

Hono API server with PostgreSQL + Drizzle ORM.

## Quick Start

```bash
# 1. Start PostgreSQL
pnpm db:up

# 2. Generate and apply migrations
pnpm db:generate
pnpm db:migrate

# 3. Start dev server (with hot reload)
pnpm server:dev
```

Server runs at `http://localhost:3000`.

## API Endpoints

### Tasks

| Method   | Path             | Description    |
| -------- | ---------------- | -------------- |
| `GET`    | `/api/tasks`     | List all tasks |
| `GET`    | `/api/tasks/:id` | Get task by ID |
| `POST`   | `/api/tasks`     | Create task    |
| `PUT`    | `/api/tasks/:id` | Update task    |
| `DELETE` | `/api/tasks/:id` | Delete task    |

### Projects

| Method   | Path                | Description       |
| -------- | ------------------- | ----------------- |
| `GET`    | `/api/projects`     | List all projects |
| `GET`    | `/api/projects/:id` | Get project by ID |
| `POST`   | `/api/projects`     | Create project    |
| `PUT`    | `/api/projects/:id` | Update project    |
| `DELETE` | `/api/projects/:id` | Delete project    |

### Health

| Method | Path      | Description  |
| ------ | --------- | ------------ |
| `GET`  | `/health` | Health check |

## Database Management

```bash
pnpm db:generate   # Generate migration files from schema
pnpm db:migrate    # Apply migrations to DB
pnpm db:push       # Push schema changes directly (dev only)
pnpm db:up         # Start PostgreSQL container
pnpm db:down       # Stop PostgreSQL container
```

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) — lightweight web framework
- **ORM**: [Drizzle](https://orm.drizzle.team/) — TypeScript ORM
- **Database**: PostgreSQL 17
- **Runtime**: Node.js with tsx (ESM)
