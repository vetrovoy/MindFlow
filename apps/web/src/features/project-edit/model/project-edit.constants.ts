import { PROJECT_DECORATIONS } from "@/shared/lib/projects";

export interface ProjectEditFormValues {
  name: string;
  color: string;
  deadline: string;
  isFavorite: boolean;
}

export const DEFAULT_PROJECT_EDIT_VALUES: ProjectEditFormValues = {
  name: "",
  color: PROJECT_DECORATIONS[0].color,
  deadline: "",
  isFavorite: false
};
