import * as Popover from "@radix-ui/react-popover";
import { HexColorPicker } from "react-colorful";

import { useCopy } from "@/app/providers/language-provider";
import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/icons";
import { MetaText } from "@/shared/ui/typography";
import styles from "./color-picker-field.module.css";

export interface ColorPickerPreset {
  value: string;
  label: string;
}

export interface ColorPickerFieldProps {
  id?: string;
  ariaLabelledBy?: string;
  value: string;
  onChange: (value: string) => void;
  presets?: ColorPickerPreset[];
  className?: string;
}

function normalizeHex(value: string) {
  if (!value.startsWith("#")) {
    return `#${value.toUpperCase()}`;
  }

  return value.toUpperCase();
}

function isValidHex(value: string) {
  return /^#([0-9A-F]{6})$/i.test(value);
}

export function ColorPickerField({
  ariaLabelledBy,
  className,
  id,
  onChange,
  presets = [],
  value
}: ColorPickerFieldProps) {
  const copy = useCopy();
  const normalizedValue = isValidHex(value) ? normalizeHex(value) : "#7C3AED";

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-labelledby={ariaLabelledBy}
        className={cn(styles.trigger, className)}
        id={id}
        type="button"
      >
          <span className={styles.triggerValue}>
          <span className={styles.swatch} style={{ backgroundColor: normalizedValue }} />
          <span className={styles.triggerCopy}>
            <span className={styles.triggerLabel}>{copy.project.defaultMarkerLabel}</span>
            <MetaText className={styles.triggerHex}>{normalizedValue}</MetaText>
          </span>
        </span>
        <span className={styles.triggerIcon}>
          <Icon name="chevron-down" size={16} tone="muted" />
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className={styles.content}
          side="bottom"
          sideOffset={10}
        >
          <div className={styles.header}>
            <div>
              <MetaText className={styles.eyebrow}>{copy.project.changeMarkerTrigger}</MetaText>
              <strong className={styles.valueLabel}>{normalizedValue}</strong>
            </div>
            <span className={styles.headerSwatch} style={{ backgroundColor: normalizedValue }} />
          </div>

          <HexColorPicker
            className={styles.picker}
            color={normalizedValue}
            onChange={(nextColor) => {
              onChange(normalizeHex(nextColor));
            }}
          />

          {presets.length === 0 ? null : (
            <div className={styles.presets}>
              <MetaText className={styles.presetsLabel}>{copy.project.defaultMarkerLabel}</MetaText>
              <div className={styles.presetGrid}>
                {presets.map((preset) => {
                  const isActive = normalizeHex(preset.value) === normalizedValue;

                  return (
                    <button
                      key={preset.value}
                      className={cn(styles.preset, isActive && styles.presetActive)}
                      onClick={() => {
                        onChange(normalizeHex(preset.value));
                      }}
                      type="button"
                    >
                      <span
                        className={styles.presetSwatch}
                        style={{ backgroundColor: preset.value }}
                      />
                      <span className={styles.presetLabel}>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Popover.Arrow className={styles.arrow} height={10} width={18} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
