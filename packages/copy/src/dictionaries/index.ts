import type { CopyDictionary, AppLanguage } from "../types";

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
  theme: {
    label: "Тема",
    graphite: "Графит",
    gilded: "Позолота",
    minimal: "Минимал"
  },
  common: {
    save: "Сохранить",
    restore: "Вернуть",
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
    saving: "Сохраняем",
    logout: "Выйти"
  },
  navigation: {
    mainAriaLabel: "Основная навигация",
    sectionAriaLabel: "Переключение разделов",
    inbox: "Входящие",
    lists: "Списки",
    today: "Сегодня",
    search: "Поиск",
    archive: "Архив"
  },
  drawer: {
    title: "Меню"
  },
  app: {
    greeting: "Привет,",
    subtitle: "Сфокусируемся на главном сегодня",
    addTaskAriaLabel: "Открыть создание задачи",
    addProjectAriaLabel: "Открыть создание списка",
    activeStat: "В работе",
    inboxStat: "Во входящих",
    hydrationTitle: "Загружаем локальное пространство",
    hydrationDescription:
      "Поднимаем локальное хранилище и готовим офлайн-рабочее пространство."
  },
  auth: {
    title: "Войдите в своё рабочее пространство",
    subtitle:
      "Локальный аккаунт хранит ваши задачи и списки отдельно в этом браузере.",
    signInTab: "Вход",
    signUpTab: "Регистрация",
    signInHint: "Войдите в существующий локальный аккаунт.",
    signUpHint: "Создайте новый локальный аккаунт без сервера и облака.",
    nameLabel: "Имя",
    namePlaceholder: "Как к вам обращаться?",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Пароль",
    passwordPlaceholder: "Не меньше 8 символов",
    confirmPasswordLabel: "Подтвердите пароль",
    confirmPasswordPlaceholder: "Повторите пароль",
    signInSubmit: "Войти",
    signUpSubmit: "Создать аккаунт",
    invalidEmailError: "Введите корректный email.",
    passwordTooShortError: "Пароль должен содержать не меньше 8 символов.",
    passwordMismatchError: "Пароли не совпадают.",
    nameRequiredError: "Добавьте имя для локального аккаунта.",
    duplicateEmailError: "Аккаунт с этим email уже существует.",
    invalidCredentialsError: "Неверный email или пароль.",
    signOutAriaLabel: "Выйти из локального аккаунта",
    signOutLabel: "Выйти"
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
    emptyDescription:
      "Добавьте задачу через быстрое поле, и она появится здесь.",
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
  search: {
    title: "Поиск",
    fieldPlaceholder: "Ищите задачи и списки",
    idleTitle: "Начните поиск",
    idleDescription:
      "Введите название задачи или списка, чтобы быстро открыть нужное место.",
    emptyTitle: "Ничего не найдено",
    emptyDescription:
      "Попробуйте изменить запрос. В результатах показываются только активные задачи и списки.",
    tasksTitle: "Задачи",
    projectsTitle: "Списки",
    sortLabel: "Сортировка:",
    sortByRelevance: "По релевантности",
    sortByDate: "По дате"
  },
  archive: {
    title: "Архив",
    tasksTitle: "Задачи",
    projectsTitle: "Списки",
    emptyTitle: "Архив пуст",
    emptyDescription: "Архивированные задачи и списки появятся здесь."
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
    restoredToastTitle: "Задача восстановлена",
    restoredToastDescription: "Она больше не помечена как архивная.",
    deletedToastTitle: "Задача удалена",
    deletedToastDescription: "Мы убрали её из локального плана.",
    titleRequired:
      "Добавьте короткое название задачи, чтобы сохранить изменения.",
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
    createdToastDescription:
      "Теперь в него можно переносить задачи из Входящих.",
    updatedToastTitle: "Список обновлён",
    updatedToastDescription: "Изменения списка сохранены локально.",
    archivedToastTitle: "Список архивирован",
    archivedToastDescription:
      "Он скрыт из активных экранов вместе со своими задачами.",
    restoredToastTitle: "Список восстановлен",
    restoredToastDescription: "Он снова доступен в активных экранах.",
    createTitle: "Создать список",
    editTitle: "Редактировать список",
    createCloseAriaLabel: "Закрыть создание списка",
    editCloseAriaLabel: "Закрыть редактирование списка",
    titlePlaceholder: "Название списка",
    titleRequired:
      "У списка должно быть название, чтобы его можно было сохранить.",
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
  projectSelector: {
    title: "Список",
    inbox: "Входящие",
    favoritesSection: "Избранное",
    allListsSection: "Все списки"
  },
  colorPicker: {
    title: "Выберите цвет"
  },
  messages: {
    movedTasksTitle: "Задачи перенесены",
    movedTasksDescriptionExistingProject:
      "Выбранные задачи перенесены в нужный список.",
    movedTasksDescriptionCreatedProject:
      "Новый список создан и сразу заполнен задачами."
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
  confirmation: {
    cancel: "Отмена",
    confirm: "Подтвердить",
    delete_: "Удалить"
  },
  systemStatus: {
    notificationsLabel: "Системные уведомления",
    saveErrorTitle: "Ошибка сохранения"
  },
  errorBoundary: {
    title: "Ошибка",
    description: "Произошла непредвиденная ошибка.",
    resetButton: "Перезагрузить",
    maxResetTitle: "Не удалось восстановить",
    maxResetDescription: "Попробуйте перезапустить приложение."
  },
  taskReorder: {
    title: "Ручной порядок задач",
    description:
      "Перетаскивайте задачи и задавайте фактическую последовательность работы.",
    saving: "Сохраняем порядок",
    saved: "Порядок обновлён",
    emptyTitle: "Пусто",
    emptyDescription:
      "Добавьте задачи в список, чтобы задать им ручной порядок."
  }
};

const en: CopyDictionary = {
  language: {
    label: "Language",
    ru: "Russian",
    en: "English"
  },
  theme: {
    label: "Theme",
    graphite: "Graphite",
    gilded: "Gilded",
    minimal: "Minimal"
  },
  common: {
    save: "Save",
    restore: "Restore",
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
    saving: "Saving",
    logout: "Log out"
  },
  navigation: {
    mainAriaLabel: "Main navigation",
    sectionAriaLabel: "Section switcher",
    inbox: "Inbox",
    lists: "Lists",
    today: "Today",
    search: "Search",
    archive: "Archive"
  },
  drawer: {
    title: "Menu"
  },
  app: {
    greeting: "Hello,",
    subtitle: "Let's focus on what matters today",
    addTaskAriaLabel: "Open task creation",
    addProjectAriaLabel: "Open list creation",
    activeStat: "Active",
    inboxStat: "In inbox",
    hydrationTitle: "Loading local workspace",
    hydrationDescription:
      "Starting local storage and preparing the offline workspace."
  },
  auth: {
    title: "Sign in to your workspace",
    subtitle:
      "A local account keeps your tasks and lists isolated in this browser.",
    signInTab: "Sign in",
    signUpTab: "Sign up",
    signInHint: "Sign in to an existing local account.",
    signUpHint: "Create a new local account without a server or cloud.",
    nameLabel: "Name",
    namePlaceholder: "What should we call you?",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 8 characters",
    confirmPasswordLabel: "Confirm password",
    confirmPasswordPlaceholder: "Repeat the password",
    signInSubmit: "Sign in",
    signUpSubmit: "Create account",
    invalidEmailError: "Enter a valid email address.",
    passwordTooShortError: "Password must be at least 8 characters long.",
    passwordMismatchError: "Passwords do not match.",
    nameRequiredError: "Add a name for the local account.",
    duplicateEmailError: "An account with this email already exists.",
    invalidCredentialsError: "Incorrect email or password.",
    signOutAriaLabel: "Sign out of the local account",
    signOutLabel: "Sign out"
  },
  quickCapture: {
    title: "Quick task capture",
    inboxDescription: "Add tasks without priority during the day.",
    todayDescription: "Add tasks for today.",
    taskPlaceholder: "New task...",
    createProjectTitle: "Create list",
    createProjectDescription: "Create a list and plan tasks.",
    projectPlaceholder: "Create a new project list...",
    dueDateLabel: "",
    deadlineLabel: ""
  },
  inbox: {
    title: "Inbox",
    emptyTitle: "Empty",
    emptyDescription:
      "Add a task using the quick field and it will show up here.",
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
  search: {
    title: "Search",
    fieldPlaceholder: "Search tasks and lists",
    idleTitle: "Start searching",
    idleDescription:
      "Type a task or list name to quickly open the right place.",
    emptyTitle: "Nothing found",
    emptyDescription:
      "Try a different query. Results include only active tasks and lists.",
    tasksTitle: "Tasks",
    projectsTitle: "Lists",
    sortLabel: "Sort:",
    sortByRelevance: "By relevance",
    sortByDate: "By date"
  },
  archive: {
    title: "Archive",
    tasksTitle: "Archived tasks",
    projectsTitle: "Archived lists",
    emptyTitle: "Archive is empty",
    emptyDescription: "Archived tasks and lists will appear here."
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
    restoredToastTitle: "Task restored",
    restoredToastDescription: "It is no longer marked as archived.",
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
    restoredToastTitle: "List restored",
    restoredToastDescription: "It is available in active screens again.",
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
  projectSelector: {
    title: "List",
    inbox: "Inbox",
    favoritesSection: "Favorites",
    allListsSection: "All lists"
  },
  colorPicker: {
    title: "Choose a color"
  },
  messages: {
    movedTasksTitle: "Tasks moved",
    movedTasksDescriptionExistingProject:
      "Selected tasks were moved to the chosen list.",
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
  confirmation: {
    cancel: "Cancel",
    confirm: "Confirm",
    delete_: "Delete"
  },
  systemStatus: {
    notificationsLabel: "System notifications",
    saveErrorTitle: "Save error"
  },
  errorBoundary: {
    title: "Error",
    description: "An unexpected error occurred.",
    resetButton: "Reload",
    maxResetTitle: "Could not recover",
    maxResetDescription: "Try restarting the application."
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
