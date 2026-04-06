import { useCallback, useEffect, useRef, useState } from 'react';

const AUTOSAVE_DELAY_MS = 480;

export function useAutoSaveDraft<Draft extends object, Result>({
  draft,
  isValid,
  buildPayload,
  onSave,
  onClose,
}: {
  draft: Draft | null;
  isValid: (draft: Draft) => boolean;
  buildPayload: (draft: Draft) => Result;
  onSave: (payload: Result) => Promise<boolean>;
  onClose: () => void;
}) {
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncedSignatureRef = useRef('');

  // Debounced auto-save
  useEffect(() => {
    if (draft == null) return;

    const signature = JSON.stringify(draft);
    if (signature === lastSyncedSignatureRef.current) return;
    if (!isValid(draft)) return;

    const payload = buildPayload(draft);

    autosaveTimeoutRef.current = setTimeout(async () => {
      const saved = await onSave(payload);
      if (saved) {
        lastSyncedSignatureRef.current = signature;
      }
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autosaveTimeoutRef.current != null) {
        clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
    };
  }, [draft, isValid, buildPayload, onSave]);

  // Flush pending changes immediately (bypass debounce)
  const flushAutosave = useCallback(async (): Promise<boolean> => {
    if (draft == null) return false;

    const signature = JSON.stringify(draft);
    if (signature === lastSyncedSignatureRef.current) return true;
    if (!isValid(draft)) return false;

    const payload = buildPayload(draft);
    const saved = await onSave(payload);
    if (saved) {
      lastSyncedSignatureRef.current = signature;
    }
    return saved;
  }, [draft, isValid, buildPayload, onSave]);

  // Close handler: flush then close
  const handleClose = useCallback(async () => {
    if (autosaveTimeoutRef.current != null) {
      clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = null;
    }
    await flushAutosave();
    onClose();
  }, [flushAutosave, onClose]);

  // Reset on draft becoming null (entity closed/changed)
  useEffect(() => {
    if (draft == null) {
      lastSyncedSignatureRef.current = '';
      if (autosaveTimeoutRef.current != null) {
        clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
    }
  }, [draft]);

  return { flushAutosave, handleClose };
}
