import { useState, type CSSProperties } from "react";
import * as Popover from "@radix-ui/react-popover";

import { getTheme, SUPPORTED_THEMES, type ThemeName } from "@mindflow/ui";

import { useCopy } from "@/app/providers/language-provider";
import { useTheme } from "@/app/providers/theme-provider";
import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui";
import styles from "./index.module.css";

interface ThemeOptionsProps {
  className?: string;
  onSelect?: () => void;
  compact?: boolean;
}

function getThemeLabel(copy: ReturnType<typeof useCopy>, theme: ThemeName) {
  return copy.theme[theme];
}

export function ThemeOptions({ className, compact = false, onSelect }: ThemeOptionsProps) {
  const copy = useCopy();
  const { theme, setTheme } = useTheme();

  return (
    <div
      aria-label={copy.theme.label}
      className={cn(styles.options, compact && styles.optionsCompact, className)}
      role="group"
    >
      {SUPPORTED_THEMES.map((item) => {
        const definition = getTheme(item);
        const swatchStyle = {
          "--preview-background": definition.preview[0],
          "--preview-surface": definition.preview[1],
          "--preview-accent": definition.preview[2]
        } as CSSProperties;

        return (
          <button
            className={cn(
              compact ? styles.optionCompact : styles.option,
              theme === item && styles.optionActive
            )}
            key={item}
            onClick={() => {
              setTheme(item);
              onSelect?.();
            }}
            type="button"
          >
            <span className={styles.swatch} style={swatchStyle}>
              <span className={styles.swatchBackground} />
              <span className={styles.swatchSurface} />
              <span className={styles.swatchAccent} />
            </span>
            {compact ? null : (
              <span className={styles.optionLabel}>{getThemeLabel(copy, item)}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const copy = useCopy();

  return (
    <div className={styles.wrap}>
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger asChild>
          <button aria-label={copy.theme.label} className={styles.trigger} type="button">
            <Icon className={styles.triggerIcon} name="palette" size={20} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            className={styles.popover}
            side="bottom"
            sideOffset={12}
          >
            <ThemeOptions
              onSelect={() => {
                setOpen(false);
              }}
            />
            <Popover.Arrow className={styles.popoverArrow} height={10} width={18} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
