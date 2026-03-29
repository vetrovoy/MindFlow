import * as Popover from "@radix-ui/react-popover";
import { format, parseISO } from "date-fns";
import { getCopy, getDateFnsLocale } from "@mindflow/copy";
import { DayPicker } from "react-day-picker";

import { useLanguage } from "@/app/providers/language-provider";
import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/icons";
import styles from "./index.module.css";

export interface DatePickerFieldProps {
  id?: string;
  ariaLabelledBy?: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerVariant?: "default" | "icon";
  onChange: (value: string) => void;
}

function formatDateLabel(value: string, language: ReturnType<typeof useLanguage>["language"]) {
  if (!value) {
    return getCopy(language).common.chooseDate;
  }

  return format(parseISO(value), "d MMMM yyyy", { locale: getDateFnsLocale(language) });
}

export function DatePickerField({
  ariaLabelledBy,
  className,
  disabled = false,
  id,
  onChange,
  placeholder,
  triggerVariant = "default",
  value
}: DatePickerFieldProps) {
  const { language } = useLanguage();
  const copy = getCopy(language);
  const resolvedPlaceholder = placeholder ?? copy.common.chooseDate;
  const selectedDate = value ? parseISO(value) : undefined;
  const isIconTrigger = triggerVariant === "icon";

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          aria-labelledby={ariaLabelledBy}
          aria-label={isIconTrigger && !ariaLabelledBy ? copy.common.chooseDate : undefined}
          className={cn(
            styles.trigger,
            isIconTrigger && styles.triggerIcon,
            className
          )}
          disabled={disabled}
          id={id}
          type="button"
        >
          {isIconTrigger ? (
            <Icon name="today" size={16} tone={value ? "lime" : "muted"} />
          ) : (
            <>
              <span className={styles.triggerValue}>
                <Icon name="today" size={16} tone={value ? "lime" : "muted"} />
                {value ? formatDateLabel(value, language) : resolvedPlaceholder}
              </span>
              <Icon name="chevron-down" size={16} tone="muted" />
            </>
          )}
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
                {copy.common.clear}
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
            locale={getDateFnsLocale(language)}
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
