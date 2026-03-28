import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";

import { SUPPORTED_LANGUAGES } from "@mindflow/copy";

import { useCopy, useLanguage } from "@/app/providers/language-provider";
import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui";
import styles from "./language-toggle.module.css";

export function LanguageToggle() {
  const [open, setOpen] = useState(false);
  const copy = useCopy();
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.wrap}>
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger asChild>
          <button
            aria-label={copy.language.label}
            className={styles.trigger}
            type="button"
          >
            <Icon className={styles.triggerIcon} name="language" size={16} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            className={styles.popover}
            side="bottom"
            sideOffset={12}
          >
            <div aria-label={copy.language.label} className={styles.options} role="group">
              {SUPPORTED_LANGUAGES.map((item) => (
                <button
                  className={cn(styles.option, language === item && styles.optionActive)}
                  key={item}
                  onClick={() => {
                    setLanguage(item);
                    setOpen(false);
                  }}
                  type="button"
                >
                  <span className={styles.optionLabel}>
                    {item === "ru" ? "Русский" : "English"}
                  </span>
                </button>
              ))}
            </div>
            <Popover.Arrow className={styles.popoverArrow} height={10} width={18} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
