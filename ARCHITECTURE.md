# Архитектура MindFlow

## Диаграмма слоёв (Feature-Sliced Design)

```
┌─────────────────────────────────────────────────────────────┐
│                         APP LAYER                           │
│  apps/mobile/  ·  apps/web/  ·  apps/server/               │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌────────┐ ┌───────┐ │
│  │ pages   │ │ features │ │ widgets │ │entities│ │shared │ │
│  │ Экраны  │ │ Потоки   │ │ Композ. │ │Модели  │ │Утилиты│ │
│  └─────────┘ └──────────┘ └─────────┘ └────────┘ └───────┘ │
├─────────────────────────────────────────────────────────────┤
│                     REUSABLE PACKAGES                       │
│                                                             │
│  @mindflow/domain    @mindflow/data    @mindflow/ui         │
│  ┌──────────────┐   ┌─────────────┐   ┌───────────────┐    │
│  │ types        │   │ contracts   │   │ токены тем    │    │
│  │ use-cases    │   │ sqlite impl │   │ UI-примитивы  │    │
│  │ selectors    │   │ dexie impl  │   │ типографика   │    │
│  │ sort helpers │   │ in-memory   │   │ градиенты     │    │
│  │ validators   │   │             │   │               │    │
│  └──────────────┘   └─────────────┘   └───────────────┘    │
│                                                             │
│  @mindflow/copy        @mindflow/config                     │
│  ┌────────────────┐   ┌────────────────┐                   │
│  │ RU/EN словарь  │   │ TS-превенты    │                   │
│  │ i18n типы      │   │ vite/eslint    │                   │
│  └────────────────┘   └────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                     PERSISTENCE LAYER                       │
│                                                             │
│  Mobile: SQLite (@op-engineering/op-sqlite)                │
│  Web:    IndexedDB (dexie)                                 │
│  Server: PostgreSQL (postgres + Drizzle ORM)               │
│  Test:   In-memory maps                                     │
└─────────────────────────────────────────────────────────────┘
```

## Пакеты

### `@mindflow/domain` — Бизнес-слой (без внешних зависимостей)

Единственный источник правды для бизнес-логики. Оба приложения импортируют отсюда — дублирования нет.

### `@mindflow/data` — Граница персистентности

Паттерн Repository с взаимозаменяемыми реализациями за единым интерфейсом `RepositoryBundle`.

```typescript
interface RepositoryBundle {
  tasks: TaskRepository; // getById, listAll, listActive, listArchived, save, saveMany, delete
  projects: ProjectRepository; // та же структура
  transaction: Transaction; // run(work) — атомарная запись
  sync: SyncPort; // push(), pull()
}
```

Три реализации поставляются из пакета:

| Фабрика                            | Цель         | Хранилище          |
| ---------------------------------- | ------------ | ------------------ |
| `createSqliteRepositoryBundle()`   | React Native | SQLite (op-sqlite) |
| `createDexieRepositoryBundle()`    | Web SPA      | IndexedDB (dexie)  |
| `createInMemoryRepositoryBundle()` | Тесты        | Plain JS maps      |

### `@mindflow/ui` — Дизайн-токены и примитивы

| Поверхность | Роль                                                                              |
| ----------- | --------------------------------------------------------------------------------- |
| `themes/`   | `ThemeDefinition`, светлая/тёмная темы, градиенты                                 |
| Components  | Платформенно-безопасные примитивы (`SurfaceCard`, `StateCard`, `SectionTitle`, …) |

### `@mindflow/copy` — i18n словарь

Типизированный строковый словарь с переключением языка в рантайме. Сейчас: `ru` + `en`.

### `@mindflow/config` — Общие превенты

TS compiler configs, Vite-превенты, ESLint-конфиги, используемые между пакетами.

## Слои приложений

### Мобильный (`apps/mobile/`)

```
src/
├── navigation/        # Оболочка React Navigation (табы + drawer)
├── app/               # Точка входа + провайдеры
├── pages/             # Полные экраны: inbox, today, lists, archive, search, settings
│   └── inbox/
│       └── ui/
│           ├── inbox-page.tsx              (слой композиции)
│           ├── inbox-content/              (empty state / маршрутизация по группам)
│           ├── inbox-active-group/         (список активных задач)
│           ├── inbox-completed-group/      (сворачиваемый блок выполненных)
│           └── …
├── entities/          # Доменные сущности, маппинг на UI (task-row, project-card, …)
├── features/          # Пользовательские потоки: task-create, task-edit, project-create, …
└── shared/
    ├── model/          # Zustand store: app-store-provider
    ├── lib/            # Сквозные утилиты: date, ids, auth, connectivity, copy
    ├── ui/             # Локальные примитивы: иконки, типографика, компоненты
    └── theme/          # Провайдер темы (оборачивает темы @mindflow/ui)
```

### Веб (`apps/web/`)

```
src/
├── app/               # Точка входа + провайдеры (auth, language, theme)
├── pages/             # Роут-уровень страниц (тонкие делегаторы)
├── widgets/           # Виджеты уровня страниц: inbox-view, today-view, lists-view
├── entities/          # UI-сущности, привязанные к домену: task-list, task-create-form, project-card
├── features/          # Потоки, инициируемые пользователем
└── shared/
    ├── model/          # Zustand store: app-store-provider
    ├── lib/            # Сквозные утилиты
    └── ui/             # Локальные примитивы
```

### Сервер (`apps/server/`)

```
src/
├── db/                # Drizzle ORM подключение
│   ├── index.ts        # postgres client + drizzle instance
│   └── schema.ts       # схемы таблиц tasks + projects
└── index.ts           # Hono API — CRUD endpoints + serve
```

## Поток данных

### Клиенты (mobile / web)

```
Действие пользователя (тап/ввод)
    │
    ▼
Feature-компонент (task-create-sheet, task-edit-sheet, …)
    │
    │  вызывает
    ▼
App Actions (createAppActions)
    │
    │  domain use-case       RepositoryBundle (sqlite / dexie)
    │  ┌──────────────┐     ┌────────────────────┐
    ├─►│ createTask() │────►│ tasks.save(task)   │
    │  └──────────────┘     └────────────────────┘
    ▼
Обновление стейта Zustand (patchState)
    │
    │  перевычисление derived-селекторов
    ▼
UI перерисовывается (TaskRow, ProjectCard, …)
```

### Сервер (API)

```
HTTP запрос (GET/POST/PUT/DELETE)
    │
    ▼
Hono route handler
    │
    │  вызывает
    ▼
Drizzle ORM (postgres)
    │
    │  SQL запрос
    ▼
PostgreSQL (tasks / projects)
    │
    ▼
JSON ответ клиенту
```

### Ключевые принципы

1. **Domain — чистый** — use case'ы принимают сущности и возвращают сущности, без I/O
2. **Repository — единственный I/O** — `tasks.save()`, `projects.listAll()` и т.д.
3. **Store владеет стейтом** — Zustand `patchState` — единственный путь записи
4. **Derived вычисляется** — селекторы работают на каждом чтении, нет устаревших данных
5. **Приложения делят пакеты** — нет дублирования бизнес-логики между мобильным и вебом

## Навигация

### Мобильный

React Navigation 7: Bottom tabs (Входящие · Сегодня · Списки) + Drawer (Архив · Поиск · Настройки). Каждый таб — стек с модальными листами для создания/редактирования задач и проектов.

### Веб

React Router 7: Вложенные роуты (`/inbox`, `/today`, `/lists/:id`, `/archive`, `/search`). Layout-оболочка обеспечивает боковую навигацию.

## Управление состоянием

Один Zustand store на приложение (`AppStore`):

```typescript
interface AppStore {
  state: AppState; // сырые данные: задачи, проекты, ui-флаги
  derived: AppDerived; // вычисляемые: inboxTasks, todayFeed, projectSections
  actions: AppActions; // мутации: addInboxTask, toggleTask, saveTaskEdit, …
}
```

Стейт сохраняется при каждой мутации через debounce-снимок (`persistState`). При гидрации store читает снимок из репозитория и восстанавливает состояние.

## Тема оформления

Тема общая через `@mindflow/ui` — оба приложения используют один `ThemeDefinition`. Мобильный оборачивает его в React Context + MMKV персистентность; веб использует CSS-in-JS через CSS-модули + контекст.
