import * as Popover from "@radix-ui/react-popover";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { DayPicker } from "react-day-picker";

import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/icons";
import styles from "./date-picker-field.module.css";

export interface DatePickerFieldProps {
  id?: string;
  ariaLabelledBy?: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange: (value: string) => void;
}

function formatDateLabel(value: string) {
  if (!value) {
    return "Выберите дату";
  }

  return format(parseISO(value), "d MMMM yyyy", { locale: ru });
}

export function DatePickerField({
  ariaLabelledBy,
  className,
  disabled = false,
  id,
  onChange,
  placeholder = "Выберите дату",
  value
}: DatePickerFieldProps) {
  const selectedDate = value ? parseISO(value) : undefined;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          aria-labelledby={ariaLabelledBy}
          className={cn(styles.trigger, className)}
          disabled={disabled}
          id={id}
          type="button"
        >
          <span className={styles.triggerValue}>
            <Icon name="today" size={16} tone={value ? "lime" : "muted"} />
            {value ? formatDateLabel(value) : placeholder}
          </span>
          <Icon name="chevron-down" size={16} tone="muted" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" className={styles.content} sideOffset={10}>
          <div className={styles.header}>
            {value ? (
              <button
                className={styles.clearButton}
                onClick={() => {
                  onChange("");
                }}
                type="button"
              >
                Очистить
              </button>
            ) : null}
          </div>
          <DayPicker
            className={styles.calendar}
            classNames={{
              button_next: styles.navButton,
              button_previous: styles.navButton,
              caption_label: styles.captionLabel,
              chevron: styles.chevron,
              day: styles.day,
              day_button: styles.dayButton,
              disabled: styles.dayDisabled,
              month: styles.month,
              month_caption: styles.monthCaption,
              months: styles.months,
              selected: styles.daySelected,
              today: styles.dayToday,
              weekday: styles.weekday,
              weekdays: styles.weekdays,
              week: styles.week
            }}
            locale={ru}
            mode="single"
            onSelect={(date) => {
              if (date == null) {
                return;
              }

              onChange(format(date, "yyyy-MM-dd"));
            }}
            selected={selectedDate}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
