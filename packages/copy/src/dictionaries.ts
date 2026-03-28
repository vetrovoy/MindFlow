import type { CopyDictionary, AppLanguage } from "./types";

function getRussianTaskCount(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} задача`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} задачи`;
  }

  return `${count} задач`;
}

function getEnglishTaskCount(count: number) {
  return `${count} ${count === 1 ? "task" : "tasks"}`;
}

const ru: CopyDictionary = {
  language: {
    label: "Язык",
    ru: "Русский",
    en: "English"
  },
  common: {
    save: "Сохранить",
    close: "Закрыть",
    clear: "Очистить",
    empty: "Пусто",
    chooseDate: "Выберите дату",
    chooseValue: "Выберите значение",
    unexpectedLocalDataError: "Непредвиденная ошибка в локальных данных",
    loadingTitle: "Сохранение...",
    loadingMeta: "ЗАГРУЗКА",
    successMeta: "УСПЕХ",
    errorMeta: "ОШИБКА",
    saving: "Сохраняем"
  },
  navigation: {
    mainAriaLabel: "Основная навигация",
    sectionAriaLabel: "Переключение разделов",
    inbox: "Входящие",
    lists: "Списки",
    today: "Сегодня"
  },
  app: {
    greeting: "Привет, Андрей",
    subtitle: "Сфокусируемся на главном сегодня",
    addTaskAriaLabel: "Открыть создание задачи",
    addProjectAriaLabel: "Открыть создание списка",
    inboxStat: "Входящие",
    listsStat: "В списках",
    hydrationTitle: "Загружаем локальное пространство",
    hydrationDescription:
      "Поднимаем локальное хранилище и готовим офлайн-рабочее пространство."
  },
  quickCapture: {
    title: "Быстрый захват задач",
    inboxDescription: "Добавляйте задачи без приоритета в течение дня.",
    todayDescription: "Добавляйте задачи на сегодня.",
    taskPlaceholder: "Новая задача...",
    createProjectTitle: "Создать список",
    createProjectDescription: "Создайте список и планируйте задачи.",
    projectPlaceholder: "Создайте новый список проекта...",
    dueDateLabel: "",
    deadlineLabel: ""
  },
  inbox: {
    title: "Входящие",
    emptyTitle: "Пусто",
    emptyDescription: "Добавьте задачу через быстрое поле, и она появится здесь.",
    completedTitle: "Выполненные",
    completedEmptyDescription: "Завершите задачу и она появится здесь."
  },
  today: {
    title: "Сегодня",
    overdueTitle: "Просрочено",
    sectionTitle: "Сегодня",
    emptyTitle: "Сегодня свободно",
    emptyDescription:
      "На сегодня сейчас нет задач. Важные входящие и задачи на сегодня появятся здесь автоматически."
  },
  lists: {
    favoritesTitle: "Избранное",
    favoritesSubtitle: "Избранные списки остаются сверху для быстрого доступа.",
    allTitle: "Все списки",
    emptyTitle: "Пусто",
    emptyDescription: "Создайте новый список.",
    favoriteEmptyDescription: "Привяжите задачи к этому списку."
  },
  task: {
    inbox: "Входящие",
    noDueDate: "Без срока",
    addedToastTitle: "Задача добавлена",
    addedToastDescription: "Новая задача уже ждёт во Входящих.",
    updatedToastTitle: "Задача обновлена",
    updatedToastDescription: "Изменения сохранены локально.",
    archivedToastTitle: "Задача архивирована",
    archivedToastDescription: "Она скрыта из активных экранов.",
    deletedToastTitle: "Задача удалена",
    deletedToastDescription: "Мы убрали её из локального плана.",
    titleRequired: "Добавьте короткое название задачи, чтобы сохранить изменения.",
    createTitle: "Создать задачу",
    editTitle: "Редактировать задачу",
    createCloseAriaLabel: "Закрыть создание задачи",
    titlePlaceholder: "Что именно нужно сделать?",
    descriptionPlaceholder: "Описание, детали или следующий шаг",
    changeProjectTrigger: "Изменить список",
    changeDueDateTrigger: "Изменить срок",
    priorityAriaLabel: "Приоритет задачи",
    statusAriaLabel: "Статус задачи",
    moreActionsTrigger: "Дополнительные действия",
    archiveAriaLabel: "Архивировать задачу",
    deleteAriaLabel: "Удалить задачу",
    archiveConfirmTitle: "Подтвердите архивацию",
    archiveConfirmDescription:
      "Задача исчезнет из активных экранов, но сохранится в архиве локально.",
    deleteConfirmTitle: "Подтвердите удаление",
    deleteConfirmDescription:
      "Удаление уберёт задачу из локального плана без возможности восстановить её из активного интерфейса.",
    editCloseAriaLabel: "Закрыть редактирование задачи",
    toggleDoneAriaLabel: "Отметить задачу выполненной",
    restoreAriaLabel: "Вернуть задачу в работу",
    badgeToday: "Сегодня",
    badgeOverdue: "Просрочено"
  },
  project: {
    defaultMarkerLabel: "Маркер",
    noDeadline: "Без дедлайна",
    createdToastTitle: "Список создан",
    createdToastDescription: "Теперь в него можно переносить задачи из Входящих.",
    updatedToastTitle: "Список обновлён",
    updatedToastDescription: "Изменения списка сохранены локально.",
    archivedToastTitle: "Список архивирован",
    archivedToastDescription:
      "Он скрыт из активных экранов вместе со своими задачами.",
    createTitle: "Создать список",
    editTitle: "Редактировать список",
    createCloseAriaLabel: "Закрыть создание списка",
    editCloseAriaLabel: "Закрыть редактирование списка",
    titlePlaceholder: "Название списка",
    titleRequired: "У списка должно быть название, чтобы его можно было сохранить.",
    changeMarkerTrigger: "Изменить маркер списка",
    changeDeadlineTrigger: "Изменить дедлайн",
    addFavoriteAriaLabel: "Добавить список в избранное",
    removeFavoriteAriaLabel: "Убрать список из избранного",
    moreActionsTrigger: "Дополнительные действия",
    archiveAriaLabel: "Архивировать список",
    archiveConfirmTitle: "Подтвердите архивацию",
    archiveConfirmDescription:
      "Список уйдёт из активных экранов, а задачи внутри станут видны только после восстановления из архива.",
    colors: {
      violet: "Фиолетовый",
      blue: "Синий",
      green: "Зелёный",
      orange: "Оранжевый"
    },
    emptyProject: "Пустой список",
    progressLabel: (done, total) =>
      total === 0 ? "Пустой список" : `${done} из ${total} выполнено`,
    inProgressLabel: (count) => `${count} в работе`,
    deadlineLabel: (value) => `до ${value}`,
    taskCount: getRussianTaskCount
  },
  editor: {
    confirmCancelAriaLabel: "Отменить подтверждение",
    confirmAriaLabel: "Подтвердить действие",
    selectListPlaceholder: "Выберите список",
    selectDatePlaceholder: "Выберите дату",
    selectDeadlinePlaceholder: "Выберите дедлайн"
  },
  messages: {
    movedTasksTitle: "Задачи перенесены",
    movedTasksDescriptionExistingProject: "Выбранные задачи перенесены в нужный список.",
    movedTasksDescriptionCreatedProject: "Новый список создан и сразу заполнен задачами."
  },
  priority: {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий"
  },
  status: {
    todo: "В работе",
    done: "Готово"
  },
  systemStatus: {
    notificationsLabel: "Системные уведомления",
    saveErrorTitle: "Ошибка сохранения"
  },
  taskReorder: {
    title: "Ручной порядок задач",
    description: "Перетаскивайте задачи и задавайте фактическую последовательность работы.",
    saving: "Сохраняем порядок",
    saved: "Порядок обновлён",
    emptyTitle: "Пусто",
    emptyDescription: "Добавьте задачи в список, чтобы задать им ручной порядок."
  }
};

const en: CopyDictionary = {
  language: {
    label: "Language",
    ru: "Russian",
    en: "English"
  },
  common: {
    save: "Save",
    close: "Close",
    clear: "Clear",
    empty: "Empty",
    chooseDate: "Choose a date",
    chooseValue: "Choose a value",
    unexpectedLocalDataError: "Unexpected local data error",
    loadingTitle: "Saving...",
    loadingMeta: "LOADING",
    successMeta: "SUCCESS",
    errorMeta: "ERROR",
    saving: "Saving"
  },
  navigation: {
    mainAriaLabel: "Main navigation",
    sectionAriaLabel: "Section switcher",
    inbox: "Inbox",
    lists: "Lists",
    today: "Today"
  },
  app: {
    greeting: "Hello, Andrey",
    subtitle: "Let’s focus on what matters today",
    addTaskAriaLabel: "Open task creation",
    addProjectAriaLabel: "Open list creation",
    inboxStat: "Inbox",
    listsStat: "In lists",
    hydrationTitle: "Loading local workspace",
    hydrationDescription:
      "Starting local storage and preparing the offline workspace."
  },
  quickCapture: {
    title: "Quick task capture",
    inboxDescription: "Add tasks without priority during the day.",
    todayDescription: "Add tasks for today.",
    taskPlaceholder: "New task...",
    createProjectTitle: "Create list",
    createProjectDescription: "Create a list and plan tasks.",
    projectPlaceholder: "Create a new project list...",
    dueDateLabel: "Due date",
    deadlineLabel: "Deadline"
  },
  inbox: {
    title: "Inbox",
    emptyTitle: "Empty",
    emptyDescription: "Add a task using the quick field and it will show up here.",
    completedTitle: "Completed",
    completedEmptyDescription: "Complete a task and it will show up here."
  },
  today: {
    title: "Today",
    overdueTitle: "Overdue",
    sectionTitle: "Today",
    emptyTitle: "Free today",
    emptyDescription:
      "There are no tasks for today right now. Important inbox items and tasks due today will appear here automatically."
  },
  lists: {
    favoritesTitle: "Favorites",
    favoritesSubtitle: "Favorite lists stay on top for quick access.",
    allTitle: "All lists",
    emptyTitle: "Empty",
    emptyDescription: "Create a new list.",
    favoriteEmptyDescription: "Move tasks into this list."
  },
  task: {
    inbox: "Inbox",
    noDueDate: "No due date",
    addedToastTitle: "Task added",
    addedToastDescription: "The new task is already waiting in Inbox.",
    updatedToastTitle: "Task updated",
    updatedToastDescription: "Changes were saved locally.",
    archivedToastTitle: "Task archived",
    archivedToastDescription: "It is now hidden from active views.",
    deletedToastTitle: "Task deleted",
    deletedToastDescription: "We removed it from the local plan.",
    titleRequired: "Add a short task name to save changes.",
    createTitle: "Create task",
    editTitle: "Edit task",
    createCloseAriaLabel: "Close task creation",
    titlePlaceholder: "What needs to be done?",
    descriptionPlaceholder: "Description, details, or the next step",
    changeProjectTrigger: "Change list",
    changeDueDateTrigger: "Change due date",
    priorityAriaLabel: "Task priority",
    statusAriaLabel: "Task status",
    moreActionsTrigger: "More actions",
    archiveAriaLabel: "Archive task",
    deleteAriaLabel: "Delete task",
    archiveConfirmTitle: "Confirm archive",
    archiveConfirmDescription:
      "The task will disappear from active views but remain available in the local archive.",
    deleteConfirmTitle: "Confirm deletion",
    deleteConfirmDescription:
      "Deletion removes the task from the local plan without restoring it from the active interface.",
    editCloseAriaLabel: "Close task editing",
    toggleDoneAriaLabel: "Mark task as done",
    restoreAriaLabel: "Return task to active work",
    badgeToday: "Today",
    badgeOverdue: "Overdue"
  },
  project: {
    defaultMarkerLabel: "Marker",
    noDeadline: "No deadline",
    createdToastTitle: "List created",
    createdToastDescription: "You can now move tasks into it from Inbox.",
    updatedToastTitle: "List updated",
    updatedToastDescription: "List changes were saved locally.",
    archivedToastTitle: "List archived",
    archivedToastDescription:
      "It is now hidden from active views together with its tasks.",
    createTitle: "Create list",
    editTitle: "Edit list",
    createCloseAriaLabel: "Close list creation",
    editCloseAriaLabel: "Close list editing",
    titlePlaceholder: "List name",
    titleRequired: "A list needs a name before it can be saved.",
    changeMarkerTrigger: "Change list marker",
    changeDeadlineTrigger: "Change deadline",
    addFavoriteAriaLabel: "Add list to favorites",
    removeFavoriteAriaLabel: "Remove list from favorites",
    moreActionsTrigger: "More actions",
    archiveAriaLabel: "Archive list",
    archiveConfirmTitle: "Confirm archive",
    archiveConfirmDescription:
      "The list will leave active views, and its tasks will be visible only after restoring it from archive.",
    colors: {
      violet: "Violet",
      blue: "Blue",
      green: "Green",
      orange: "Orange"
    },
    emptyProject: "Empty list",
    progressLabel: (done, total) =>
      total === 0 ? "Empty list" : `${done} of ${total} completed`,
    inProgressLabel: (count) => `${count} in progress`,
    deadlineLabel: (value) => `due ${value}`,
    taskCount: getEnglishTaskCount
  },
  editor: {
    confirmCancelAriaLabel: "Cancel confirmation",
    confirmAriaLabel: "Confirm action",
    selectListPlaceholder: "Choose a list",
    selectDatePlaceholder: "Choose a date",
    selectDeadlinePlaceholder: "Choose a deadline"
  },
  messages: {
    movedTasksTitle: "Tasks moved",
    movedTasksDescriptionExistingProject: "Selected tasks were moved to the chosen list.",
    movedTasksDescriptionCreatedProject:
      "A new list was created and filled with the selected tasks."
  },
  priority: {
    low: "Low",
    medium: "Medium",
    high: "High"
  },
  status: {
    todo: "In progress",
    done: "Done"
  },
  systemStatus: {
    notificationsLabel: "System notifications",
    saveErrorTitle: "Save error"
  },
  taskReorder: {
    title: "Manual task order",
    description: "Drag tasks to reflect the real working sequence.",
    saving: "Saving order",
    saved: "Order updated",
    emptyTitle: "Empty",
    emptyDescription: "Add tasks to this list to set a manual order."
  }
};

export const dictionaries: Record<AppLanguage, CopyDictionary> = {
  ru,
  en
};
