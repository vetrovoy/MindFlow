import * as RadioGroup from "@radix-ui/react-radio-group";

import { cn } from "@/shared/lib/cn";
import styles from "./index.module.css";

interface RadioCardOption<TValue extends string> {
  value: TValue;
  label: string;
  helper?: string;
}

interface RadioCardGroupProps<TValue extends string> {
  ariaLabel: string;
  value: TValue;
  options: Array<RadioCardOption<TValue>>;
  onValueChange: (value: TValue) => void;
  className?: string;
}

export function RadioCardGroup<TValue extends string>({
  ariaLabel,
  className,
  onValueChange,
  options,
  value
}: RadioCardGroupProps<TValue>) {
  return (
    <RadioGroup.Root
      aria-label={ariaLabel}
      className={cn(styles.radioCardGroup, className)}
      onValueChange={(nextValue) => {
        onValueChange(nextValue as TValue);
      }}
      value={value}
    >
      {options.map((option) => (
        <RadioGroup.Item
          className={cn(
            styles.radioCard,
            value === option.value && styles.radioCardActive
          )}
          key={option.value}
          value={option.value}
        >
          <div className={styles.radioCardCopy}>
            <span className={styles.radioCardTitle}>{option.label}</span>
            {option.helper ? (
              <span className={styles.radioCardDescription}>{option.helper}</span>
            ) : null}
          </div>
          <span className={styles.radioCardIndicatorWrap}>
            <RadioGroup.Indicator className={styles.radioCardIndicator} />
          </span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
