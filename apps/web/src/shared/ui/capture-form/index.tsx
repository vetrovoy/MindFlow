import { type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { Body, Heading, Icon } from "..";
import { ActionButton } from "@/shared/ui/primitives";
import styles from "./index.module.css";

interface CaptureFormProps {
  title: string;
  description?: string;
  placeholder: string;
  submitLabel?: string;
  disabled?: boolean;
  onSubmitValue: (value: string) => Promise<boolean>;
  afterSubmit?: () => void;
  leadingIcon?: ReactNode;
}

interface CaptureFormValues {
  value: string;
}

export function CaptureForm({
  afterSubmit,
  description,
  disabled = false,
  leadingIcon,
  onSubmitValue,
  placeholder,
  submitLabel = "Создать",
  title
}: CaptureFormProps) {
  const { handleSubmit, register, reset, watch } = useForm<CaptureFormValues>({
    defaultValues: {
      value: ""
    }
  });
  const value = watch("value") ?? "";

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(async ({ value: nextValue }) => {
        const created = await onSubmitValue(nextValue);
        if (created) {
          reset();
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
