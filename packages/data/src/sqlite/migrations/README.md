# SQLite Migrations

Этот каталог содержит систему миграций для SQLite-базы MindFlow.

## Как это работает

Миграции применяются автоматически при инициализации `createSqliteRepositoryBundle()`.
Система использует `PRAGMA user_version` для отслеживания текущей версии схемы.

SQL миграций определён в `runner.ts` как массив строк (embedded для простоты).

## Как добавить новую миграцию

1. Добавьте SQL в массив `MIGRATIONS` в `runner.ts` (следующий индекс).
2. Используйте `ALTER TABLE` — НЕ `DROP TABLE` / `CREATE TABLE` с перезаписью данных.
3. Увеличьте `SCHEMA_VERSION` в `constants.ts`.

### Пример

```ts
// В runner.ts, добавить в конец массива MIGRATIONS:
`
  ALTER TABLE projects ADD COLUMN ownerId TEXT;
`,
```

## Правила

- Миграции применяются в транзакции: всё или ничего.
- Если миграция падает — app не крашится, ошибка логируется.
- `CREATE TABLE IF NOT EXISTS` допустим в первой миграции.
- Все последующие — только `ALTER TABLE`, `CREATE INDEX`.
- Не удаляйте старые миграции — они нужны для пользователей со старой версией.

## Список миграций

| Версия | Описание                                   |
| ------ | ------------------------------------------ |
| 1      | Начальная схема: tasks + projects          |
| 2      | isDirty, changeType для offline-first sync |
