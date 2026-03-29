import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";

import { useCopy } from "@/app/providers/language-provider";
import { LanguageToggle } from "@/app/ui/language-toggle";
import { ThemeOptions, ThemeToggle } from "@/app/ui/theme-toggle";
import { cn } from "@/shared/lib/cn";
import { IconButton } from "@/shared/ui/primitives";
import styles from "./index.module.css";

interface AppHeaderActionsProps {
  createAriaLabel: string;
  isArchive: boolean;
  isSearch: boolean;
  onCreate: () => void;
  onNavigate: (path: "/search" | "/archive") => void;
  onSignOut: () => void;
}

export function AppHeaderActions({
  createAriaLabel,
  isArchive,
  isSearch,
  onCreate,
  onNavigate,
  onSignOut
}: AppHeaderActionsProps) {
  const copy = useCopy();
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  return (
    <>
      <div className={styles.headerActions}>
        <IconButton
          ariaLabel={copy.navigation.search}
          className={cn(
            styles.headerUtilityButton,
            isSearch && styles.headerUtilityButtonActive
          )}
          icon="search"
          iconTone="lime"
          onClick={() => {
            onNavigate("/search");
          }}
          variant="secondary"
        />
        <IconButton
          ariaLabel={copy.navigation.archive}
          className={cn(
            styles.headerUtilityButton,
            isArchive && styles.headerUtilityButtonActive
          )}
          icon="archive"
          iconTone="lime"
          onClick={() => {
            onNavigate("/archive");
          }}
          variant="secondary"
        />
        <ThemeToggle />
        <LanguageToggle />
        <IconButton
          ariaLabel={copy.auth.signOutAriaLabel}
          className={styles.signOutButton}
          icon="sign-out"
          iconTone="lime"
          onClick={onSignOut}
          variant="secondary"
        />
        <IconButton ariaLabel={createAriaLabel} icon="add" onClick={onCreate} />
      </div>
      <div className={styles.headerMenuMobile}>
        <IconButton ariaLabel={createAriaLabel} icon="add" onClick={onCreate} />
        <Popover.Root onOpenChange={setIsHeaderMenuOpen} open={isHeaderMenuOpen}>
          <Popover.Trigger asChild>
            <IconButton
              ariaLabel={copy.task.moreActionsTrigger}
              className={styles.headerMenuIcon}
              icon="more"
              iconTone="lime"
              variant="secondary"
            />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              align="end"
              className={styles.headerMenuPopover}
              side="bottom"
              sideOffset={12}
            >
              <div className={styles.headerMenuActions}>
                <div className={styles.headerMenuNavRow}>
                  <IconButton
                    ariaLabel={copy.navigation.search}
                    className={cn(
                      styles.headerMenuAction,
                      isSearch && styles.headerMenuActionActive
                    )}
                    icon="search"
                    iconTone="lime"
                    onClick={() => {
                      setIsHeaderMenuOpen(false);
                      onNavigate("/search");
                    }}
                    variant="secondary"
                  />
                  <IconButton
                    ariaLabel={copy.navigation.archive}
                    className={cn(
                      styles.headerMenuAction,
                      isArchive && styles.headerMenuActionActive
                    )}
                    icon="archive"
                    iconTone="lime"
                    onClick={() => {
                      setIsHeaderMenuOpen(false);
                      onNavigate("/archive");
                    }}
                    variant="secondary"
                  />
                </div>
                <div className={styles.headerMenuUtilityRow}>
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <IconButton
                        ariaLabel={copy.theme.label}
                        className={styles.headerMenuAction}
                        icon="palette"
                        iconTone="lime"
                        variant="secondary"
                      />
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        align="end"
                        className={styles.headerMenuThemePopover}
                        side="bottom"
                        sideOffset={12}
                      >
                        <ThemeOptions
                          className={styles.headerMenuThemeOptions}
                          onSelect={() => {
                            setIsHeaderMenuOpen(false);
                          }}
                        />
                        <Popover.Arrow
                          className={styles.headerMenuPopoverArrow}
                          height={10}
                          width={18}
                        />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                  <LanguageToggle />
                  <IconButton
                    ariaLabel={copy.auth.signOutAriaLabel}
                    className={styles.headerMenuAction}
                    icon="sign-out"
                    iconTone="lime"
                    onClick={() => {
                      setIsHeaderMenuOpen(false);
                      onSignOut();
                    }}
                    variant="secondary"
                  />
                </div>
              </div>
              <Popover.Arrow
                className={styles.headerMenuPopoverArrow}
                height={10}
                width={18}
              />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </>
  );
}
