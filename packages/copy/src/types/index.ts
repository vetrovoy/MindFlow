import type { Locale } from "date-fns";

export const SUPPORTED_LANGUAGES = ["ru", "en"] as const;
export const DEFAULT_LANGUAGE = "ru" as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type DateFnsLocale = Locale;

export interface CopyDictionary {
  language: {
    label: string;
    ru: string;
    en: string;
  };
  theme: {
    label: string;
    graphite: string;
    gilded: string;
    minimal: string;
  };
  common: {
    save: string;
    restore: string;
    close: string;
    clear: string;
    empty: string;
    chooseDate: string;
    chooseValue: string;
    unexpectedLocalDataError: string;
    loadingTitle: string;
    loadingMeta: string;
    successMeta: string;
    errorMeta: string;
    saving: string;
    logout: string;
  };
  navigation: {
    mainAriaLabel: string;
    sectionAriaLabel: string;
    inbox: string;
    lists: string;
    today: string;
    search: string;
    archive: string;
  };
  drawer: {
    title: string;
  };
  app: {
    greeting: string;
    subtitle: string;
    addTaskAriaLabel: string;
    addProjectAriaLabel: string;
    activeStat: string;
    inboxStat: string;
    hydrationTitle: string;
    hydrationDescription: string;
  };
  auth: {
    title: string;
    subtitle: string;
    signInTab: string;
    signUpTab: string;
    signInHint: string;
    signUpHint: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    signInSubmit: string;
    signUpSubmit: string;
    invalidEmailError: string;
    passwordTooShortError: string;
    passwordMismatchError: string;
    nameRequiredError: string;
    duplicateEmailError: string;
    invalidCredentialsError: string;
    signOutAriaLabel: string;
    signOutLabel: string;
  };
  quickCapture: {
    title: string;
    inboxDescription: string;
    todayDescription: string;
    taskPlaceholder: string;
    createProjectTitle: string;
    createProjectDescription: string;
    projectPlaceholder: string;
    dueDateLabel: string;
    deadlineLabel: string;
  };
  inbox: {
    title: string;
    emptyTitle: string;
    emptyDescription: string;
    completedTitle: string;
    completedEmptyDescription: string;
  };
  today: {
    title: string;
    overdueTitle: string;
    sectionTitle: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  lists: {
    favoritesTitle: string;
    favoritesSubtitle: string;
    allTitle: string;
    emptyTitle: string;
    emptyDescription: string;
    favoriteEmptyDescription: string;
  };
  search: {
    title: string;
    fieldPlaceholder: string;
    idleTitle: string;
    idleDescription: string;
    emptyTitle: string;
    emptyDescription: string;
    tasksTitle: string;
    projectsTitle: string;
    sortLabel: string;
    sortByRelevance: string;
    sortByDate: string;
  };
  archive: {
    title: string;
    tasksTitle: string;
    projectsTitle: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  task: {
    inbox: string;
    noDueDate: string;
    addedToastTitle: string;
    addedToastDescription: string;
    updatedToastTitle: string;
    updatedToastDescription: string;
    archivedToastTitle: string;
    archivedToastDescription: string;
    restoredToastTitle: string;
    restoredToastDescription: string;
    deletedToastTitle: string;
    deletedToastDescription: string;
    titleRequired: string;
    createTitle: string;
    editTitle: string;
    createCloseAriaLabel: string;
    titlePlaceholder: string;
    descriptionPlaceholder: string;
    changeProjectTrigger: string;
    changeDueDateTrigger: string;
    priorityAriaLabel: string;
    statusAriaLabel: string;
    moreActionsTrigger: string;
    archiveAriaLabel: string;
    deleteAriaLabel: string;
    archiveConfirmTitle: string;
    archiveConfirmDescription: string;
    deleteConfirmTitle: string;
    deleteConfirmDescription: string;
    editCloseAriaLabel: string;
    toggleDoneAriaLabel: string;
    restoreAriaLabel: string;
    badgeToday: string;
    badgeOverdue: string;
  };
  project: {
    defaultMarkerLabel: string;
    noDeadline: string;
    createdToastTitle: string;
    createdToastDescription: string;
    updatedToastTitle: string;
    updatedToastDescription: string;
    archivedToastTitle: string;
    archivedToastDescription: string;
    restoredToastTitle: string;
    restoredToastDescription: string;
    createTitle: string;
    editTitle: string;
    createCloseAriaLabel: string;
    editCloseAriaLabel: string;
    titlePlaceholder: string;
    titleRequired: string;
    changeMarkerTrigger: string;
    changeDeadlineTrigger: string;
    addFavoriteAriaLabel: string;
    removeFavoriteAriaLabel: string;
    moreActionsTrigger: string;
    archiveAriaLabel: string;
    archiveConfirmTitle: string;
    archiveConfirmDescription: string;
    colors: {
      violet: string;
      blue: string;
      green: string;
      orange: string;
    };
    emptyProject: string;
    progressLabel: (done: number, total: number) => string;
    inProgressLabel: (count: number) => string;
    deadlineLabel: (value: string) => string;
    taskCount: (count: number) => string;
  };
  editor: {
    confirmCancelAriaLabel: string;
    confirmAriaLabel: string;
    selectListPlaceholder: string;
    selectDatePlaceholder: string;
    selectDeadlinePlaceholder: string;
  };
  projectSelector: {
    title: string;
    inbox: string;
    favoritesSection: string;
    allListsSection: string;
  };
  colorPicker: {
    title: string;
  };
  messages: {
    movedTasksTitle: string;
    movedTasksDescriptionExistingProject: string;
    movedTasksDescriptionCreatedProject: string;
  };
  priority: {
    low: string;
    medium: string;
    high: string;
  };
  status: {
    todo: string;
    done: string;
  };
  systemStatus: {
    notificationsLabel: string;
    saveErrorTitle: string;
  };
  taskReorder: {
    title: string;
    description: string;
    saving: string;
    saved: string;
    emptyTitle: string;
    emptyDescription: string;
  };
}
