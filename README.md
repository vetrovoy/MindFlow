# MindFlow

Офлайн-менеджер задач для личного планирования. Построен на React Native (мобильный) и React (веб) в Turborepo монорепозитории.

## Требования

| Инструмент  | Версия       | Примечание                                         |
| ----------- | ------------ | -------------------------------------------------- |
| **Node.js** | `>= 22.11.0` | Управляется через `.nvmrc` / Volta                 |
| **pnpm**    | `10.6.5`     | `corepack enable` затем `corepack use pnpm@10.6.5` |

## Быстрый старт

```bash
# 1. Установка зависимостей
pnpm install

# 2. Запуск всех dev-серверов (веб + мобильный metro)
pnpm dev

# Или запуск отдельных приложений:
pnpm web:dev          # Веб на localhost:5173
pnpm mobile:start     # Metro bundler
pnpm mobile:ios       # Сборка и запуск на iOS-симуляторе
pnpm mobile:android   # Сборка и запуск на Android-эмуляторе
```

## Скрипты

### Монорепозиторий (root)

| Команда             | Описание                             |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Запуск всех dev-серверов параллельно |
| `pnpm build`        | Сборка всех пакетов и приложений     |
| `pnpm lint`         | ESLint по всему workspace            |
| `pnpm test`         | Запуск всех тестов                   |
| `pnpm typecheck`    | TypeScript проверка всех пакетов     |
| `pnpm format`       | Prettier — автоисправление           |
| `pnpm format:check` | Prettier — только проверка           |
| `pnpm clean`        | Очистка кешей turbo                  |

### Команды для отдельных приложений

| Команда               | Описание                    |
| --------------------- | --------------------------- |
| `pnpm mobile:start`   | Запуск Metro bundler        |
| `pnpm mobile:ios`     | Запуск на iOS-симуляторе    |
| `pnpm mobile:android` | Запуск на Android-эмуляторе |
| `pnpm web:dev`        | Запуск Vite dev-сервера     |
| `pnpm web:build`      | Продакшн-сборка веба        |
| `pnpm server:dev`     | Запуск Hono API (порт 3000) |
| `pnpm server:build`   | Сборка сервера              |
| `pnpm db:up`          | Поднять PostgreSQL          |
| `pnpm db:down`        | Остановить PostgreSQL       |
| `pnpm db:migrate`     | Применить миграции БД       |

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
└── [infra]
    ├── .github/         # GitHub Actions CI
    ├── .husky/          # Git-хуки (lint-staged, commitlint)
    ├── .vscode/         # Настройки редактора + рекомендуемые расширения
    └── docker-compose.yml # PostgreSQL контейнер
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
