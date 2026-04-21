# MindFlow

Офлайн-менеджер задач для личного планирования. Построен на React Native (мобильный) и React (веб) в Turborepo монорепозитории.

## Требования

| Инструмент  | Версия       | Примечание                                         |
| ----------- | ------------ | -------------------------------------------------- |
| **Node.js** | `>= 22.11.0` | Управляется через `.nvmrc` / Volta                 |
| **pnpm**    | `10.6.5`     | `corepack enable` затем `corepack use pnpm@10.6.5` |

## Быстрый старт

### Установка зависимостей

```bash
pnpm install
```

### Development Workflows

#### 🔵 **Full-Stack (Web + Server + Mobile)**

**Терминал 1:** PostgreSQL

```bash
pnpm db:up
```

**Терминал 2:** Backend

```bash
pnpm server:dev
```

**Терминал 3:** Frontend

```bash
pnpm web:dev
```

**Терминал 4 (опционально):** Mobile

```bash
cd apps/mobile && pnpm start   # Metro bundler
# Затем в другом терминале:
pnpm ios   # iOS эмулятор
```

➜ Server: http://localhost:3000  
➜ Web: http://localhost:5173  
➜ Mobile: подключается через Metro

---

#### 🟦 **Только Backend**

```bash
pnpm db:up         # PostgreSQL
pnpm server:dev    # Server with hot reload
```

#### 🟦 **Только Frontend**

```bash
# Убедись что Server запущен
pnpm web:dev
```

#### 📦 **Production (Docker)**

```bash
docker compose up
```

➜ http://localhost (Web через nginx)  
➜ http://localhost:3000 (API)

## Скрипты

### Root scripts

| Команда             | Описание                                 |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Server + Web локально (требует postgres) |
| `pnpm build`        | Сборка всех пакетов и приложений         |
| `pnpm test`         | Запуск всех тестов                       |
| `pnpm typecheck`    | TypeScript проверка всех пакетов         |
| `pnpm format`       | Prettier — автоисправление               |
| `pnpm format:check` | Prettier — только проверка               |
| `pnpm clean`        | Очистка кешей turbo                      |

### Docker

| Команда            | Описание                               |
| ------------------ | -------------------------------------- |
| `pnpm docker:up`   | Production (nginx + server + postgres) |
| `pnpm docker:down` | Остановить контейнеры                  |

### Server

| Команда                 | Описание               |
| ----------------------- | ---------------------- |
| `pnpm server:dev`       | Запуск с hot reload    |
| `pnpm server:build`     | Сборка                 |
| `pnpm server:start`     | Запуск compiled версии |
| `pnpm server:test`      | Запуск тестов          |
| `pnpm server:typecheck` | TypeScript проверка    |

### Web

| Команда              | Описание                                 |
| -------------------- | ---------------------------------------- |
| `pnpm web:dev`       | Запуск Vite dev-сервера (localhost:5173) |
| `pnpm web:build`     | Продакшн-сборка                          |
| `pnpm web:test`      | Запуск тестов                            |
| `pnpm web:typecheck` | TypeScript проверка                      |

### Database

| Команда        | Описание              |
| -------------- | --------------------- |
| `pnpm db:up`   | Запустить PostgreSQL  |
| `pnpm db:down` | Остановить PostgreSQL |

## Структура проекта

```
mindflow-app/
├── apps/
│   ├── mobile/          # React Native приложение (FSD)
│   ├── web/             # React SPA с Vite (FSD)
│   └── server/          # Hono API + Drizzle ORM + PostgreSQL
├── packages/
│   ├── domain/          # Бизнес-сущности, use case'ы, селекторы
│   ├── data/            # Контракты репозиториев + персистенция (SQLite, Dexie)
│   ├── ui/              # Токены тем, UI-примитивы
│   ├── copy/            # i18n словарь (RU/EN)
│   └── config/          # Общие TS-превенты
├── .env.example         # Environment variables template
├── docker-compose.yml   # Production: PostgreSQL + Server + Web (nginx)
├── docker-compose.dev.yml # Development: Server (hot reload) + PostgreSQL
└── [infra]
    ├── .github/         # GitHub Actions CI
    ├── .husky/          # Git-хуки (lint-staged, commitlint)
    └── .vscode/         # Настройки редактора + рекомендуемые расширения
```

Подробнее — в [ARCHITECTURE.md](./ARCHITECTURE.md): диаграммы слоёв и потоков данных.

## Архитектура

- **Паттерн**: Feature-Sliced Design (FSD)
- **Стейт-менеджмент**: Zustand
- **Мобильное хранилище**: SQLite (`@op-engineering/op-sqlite`)
- **Веб-хранилище**: IndexedDB (`dexie`)
- **Сервер**: Hono + PostgreSQL + Drizzle ORM
- **Навигация**: React Navigation 7 (мобильный), React Router 7 (веб)
- **Синхронизация**: Паттерн Repository через `RepositoryBundle` — подставляй SQLite / Dexie / API / in-memory

## Качество кода

- **Линт**: ESLint 9 + TypeScript-ESLint
- **Форматирование**: Prettier 3
- **Хуки**: Husky pre-commit запускает lint-staged (eslint + prettier на staged файлах)
- **Сообщения коммитов**: Conventional Commits через commitlint
- **CI**: GitHub Actions — lint + test + typecheck на каждом PR

## Тестирование

```bash
# Все пакеты
pnpm test

# По отдельности
pnpm --filter @mindflow/domain test
pnpm --filter @mindflow/data test
pnpm --filter @mindflow/web test
pnpm --filter @mindflow/mobile test
```

Пакеты domain и data используют Vitest. Мобильный — Jest.
