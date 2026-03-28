import * as Select from "@radix-ui/react-select";

import { useCopy } from "@/app/providers/language-provider";
import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/icons";
import styles from "./select-field.module.css";

export interface SelectFieldOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  id?: string;
  ariaLabelledBy?: string;
  value: string;
  options: SelectFieldOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  onValueChange: (value: string) => void;
}

export function SelectField({
  ariaLabelledBy,
  className,
  contentClassName,
  disabled = false,
  id,
  onValueChange,
  options,
  placeholder,
  value
}: SelectFieldProps) {
  const copy = useCopy();
  const resolvedPlaceholder = placeholder ?? copy.common.chooseValue;

  return (
    <Select.Root disabled={disabled} onValueChange={onValueChange} value={value}>
      <Select.Trigger
        aria-labelledby={ariaLabelledBy}
        className={cn(styles.trigger, className)}
        id={id}
      >
        <Select.Value placeholder={resolvedPlaceholder} />
        <Select.Icon asChild>
          <span className={styles.iconWrap}>
            <Icon name="chevron-down" size={16} tone="muted" />
          </span>
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className={cn(styles.content, contentClassName)}
          position="popper"
          sideOffset={10}
        >
          <Select.Viewport className={styles.viewport}>
            {options.map((option) => (
              <Select.Item className={styles.item} key={option.value} value={option.value}>
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className={styles.itemIndicator}>
                  <Icon name="check" size={14} tone="lime" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
