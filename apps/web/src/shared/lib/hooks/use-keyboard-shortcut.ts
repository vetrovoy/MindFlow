import { useEffect } from "react";

interface UseKeyboardShortcutOptions {
  key: string;
  callback: () => void;
  modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  };
}

export function useKeyboardShortcut({
  key,
  callback,
  modifiers = {}
}: UseKeyboardShortcutOptions) {
  const { ctrl = true, shift = false, alt = false } = modifiers;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCtrlPressed = isMac ? event.metaKey : event.ctrlKey;

      if (ctrl && !isCtrlPressed) return;
      if (shift && !event.shiftKey) return;
      if (alt && !event.altKey) return;

      event.preventDefault();
      callback();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, callback, ctrl, shift, alt]);
}
