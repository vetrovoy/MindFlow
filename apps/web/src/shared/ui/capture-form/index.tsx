import { type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { Body, Heading, Icon } from "..";
import { ActionButton, DatePickerField } from "@/shared/ui/primitives";
import styles from "./index.module.css";

interface CaptureFormProps {
  title: string;
  description?: string;
  placeholder: string;
  submitLabel?: string;
  disabled?: boolean;
  dateLabel?: string;
  onSubmitValue: (input: {
    value: string;
    date: string | null;
  }) => Promise<boolean>;
  afterSubmit?: () => void;
  leadingIcon?: ReactNode;
  showDatePicker?: boolean;
  preferredDate?: string | null;
}

interface CaptureFormValues {
  value: string;
  date: string;
}

export function CaptureForm({
  afterSubmit,
  dateLabel,
  description,
  disabled = false,
  leadingIcon,
  onSubmitValue,
  placeholder,
  preferredDate = null,
  submitLabel = "Создать",
  title,
  showDatePicker = true
}: CaptureFormProps) {
  const { handleSubmit, register, reset, setValue, watch } =
    useForm<CaptureFormValues>({
      defaultValues: {
        value: "",
        date: ""
      }
    });
  const value = watch("value") ?? "";
  const date = preferredDate ?? (watch("date") ?? "");

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(async ({ date: nextDate, value: nextValue }) => {
        const created = await onSubmitValue({
          value: nextValue,
          date: nextDate || null
        });
        if (created) {
          reset({
            value: "",
            date: preferredDate ?? ""
          });
          afterSubmit?.();
        }
      })}
    >
      <div className={styles.card}>
        <Heading as="h3" className={styles.title}>
          {title}
        </Heading>
        {description == null ? null : (
          <Body className={styles.description}>{description}</Body>
        )}
        <div className={styles.inputShell}>
          <label className={styles.inputWrap}>
            <span className={styles.inputLead}>
              {leadingIcon ?? <Icon name="add" size={14} tone="muted" />}
            </span>
            <input
              className={styles.input}
              placeholder={placeholder}
              {...register("value")}
            />
          </label>
          {date ? (
            <span className={styles.dateValue}>
              <Icon name="today" size={14} tone="lime" />
              {dateLabel ?? "Дата"}: {date}
            </span>
          ) : null}
          {showDatePicker && (
            <DatePickerField
              className={styles.dateTrigger}
              disabled={disabled}
              onChange={(nextValue) => {
                setValue("date", nextValue, {
                  shouldDirty: true,
                  shouldTouch: true
                });
              }}
              placeholder="Выберите дату"
              triggerVariant="icon"
              value={date}
            />
          )}
          <ActionButton
            className={styles.submitButton}
            disabled={!value.trim() || disabled}
            type="submit"
          >
            {submitLabel}
          </ActionButton>
        </div>
      </div>
    </form>
  );
}
