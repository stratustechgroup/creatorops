import { useEffect, useCallback, useState } from "react";
import { UseFormWatch, UseFormReset, FieldValues, DefaultValues } from "react-hook-form";

const AUTOSAVE_DEBOUNCE_MS = 500;

interface UseFormAutosaveOptions<T extends FieldValues> {
  watch: UseFormWatch<T>;
  reset: UseFormReset<T>;
  storageKey: string;
  defaultValues: DefaultValues<T>;
}

export function useFormAutosave<T extends FieldValues>({
  watch,
  reset,
  storageKey,
  defaultValues,
}: UseFormAutosaveOptions<T>) {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Load saved data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsedData = JSON.parse(saved) as Partial<T>;
        // Merge with default values to ensure all fields exist
        reset({ ...defaultValues, ...parsedData } as T);
        // Check for saved timestamp
        const savedTimestamp = localStorage.getItem(`${storageKey}_timestamp`);
        if (savedTimestamp) {
          setLastSavedAt(new Date(savedTimestamp));
        }
      }
    } catch (error) {
      // If parsing fails, clear corrupted data
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`${storageKey}_timestamp`);
    }
  }, [storageKey, reset, defaultValues]);

  // Auto-save on form changes with debouncing
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const subscription = watch((formData) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          // Only save if there's actual data
          const hasData = Object.values(formData).some(
            (value) => value !== undefined && value !== ""
          );
          if (hasData) {
            const now = new Date();
            localStorage.setItem(storageKey, JSON.stringify(formData));
            localStorage.setItem(`${storageKey}_timestamp`, now.toISOString());
            setLastSavedAt(now);
          }
        } catch (error) {
          // Silently fail if localStorage is full or unavailable
          console.warn("Failed to autosave form data:", error);
        }
      }, AUTOSAVE_DEBOUNCE_MS);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [watch, storageKey]);

  // Clear saved data (call on successful submit)
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}_timestamp`);
    setLastSavedAt(null);
  }, [storageKey]);

  // Check if there's saved data
  const hasSavedData = useCallback(() => {
    try {
      return localStorage.getItem(storageKey) !== null;
    } catch {
      return false;
    }
  }, [storageKey]);

  return { clearSavedData, hasSavedData, lastSavedAt };
}
