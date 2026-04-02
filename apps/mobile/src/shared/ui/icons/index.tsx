import type { IconName, IconProps as SharedIconProps } from '@mindflow/ui';
import type { LucideIcon } from 'lucide-react-native';
import {
  Archive,
  Calendar,
  CalendarDays,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Eye,
  EyeOff,
  Flag,
  FolderKanban,
  GripVertical,
  Languages,
  ListTodo,
  LogOut,
  MoreHorizontal,
  Palette,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react-native';

import { useTheme } from '@shared/theme/use-theme';

export interface IconProps extends SharedIconProps {
  testID?: string;
}

const ICONS: Record<IconName, LucideIcon> = {
  add: Plus,
  archive: Archive,
  check: Check,
  'checkbox-empty': Circle,
  'checkbox-checked': CheckCircle2,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  eye: Eye,
  'eye-off': EyeOff,
  'priority-low': Flag,
  'priority-medium': Flag,
  'priority-high': Flag,
  restore: RotateCcw,
  search: Search,
  today: Calendar,
  overdue: CalendarClock,
  'toast-success': CheckCircle2,
  close: X,
  favorite: Star,
  flag: Flag,
  language: Languages,
  palette: Palette,
  'nav-inbox': ListTodo,
  'nav-lists': FolderKanban,
  'nav-today': CalendarDays,
  'sign-out': LogOut,
  drag: GripVertical,
  more: MoreHorizontal,
  trash: Trash2,
};

function resolveToneColor(
  tone: NonNullable<SharedIconProps['tone']>,
  theme: ReturnType<typeof useTheme>['theme'],
) {
  switch (tone) {
    case 'muted':
      return theme.colors.textSecondary;
    case 'accent':
      return theme.colors.accentPrimary;
    case 'alert':
      return theme.colors.accentAlert;
    case 'success':
      return theme.colors.accentSuccessBright ?? theme.colors.accentSuccessDeep;
    case 'contrast':
      return theme.colors.background;
    case 'default':
    default:
      return theme.colors.textPrimary;
  }
}

export function Icon({
  decorative = true,
  name,
  size = 18,
  testID,
  tone = 'default',
}: IconProps) {
  const { theme } = useTheme();
  const color = resolveToneColor(tone, theme);
  const Component = ICONS[name];

  return (
    <Component
      accessibilityElementsHidden={decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessible={!decorative}
      color={color}
      size={size}
      strokeWidth={2}
      testID={testID}
    />
  );
}
