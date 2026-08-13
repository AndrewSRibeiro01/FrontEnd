import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { SnackbarStack, type SnackbarKind, type SnackbarItem } from './Snackbar';

interface NotifyApi {
  success(message: string): void;
  error(message: string): void;
  info(message: string): void;
}

const NotifyContext = createContext<NotifyApi | null>(null);

const DEFAULT_DURATION_MS = 4000;

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SnackbarItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (kind: SnackbarKind, message: string) => {
      nextId.current += 1;
      const id = nextId.current;
      setItems((prev) => [...prev, { id, kind, message }]);
      setTimeout(() => dismiss(id), DEFAULT_DURATION_MS);
    },
    [dismiss],
  );

  const api = useMemo<NotifyApi>(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
    }),
    [push],
  );

  return (
    <NotifyContext.Provider value={api}>
      {children}
      <SnackbarStack items={items} onDismiss={dismiss} />
    </NotifyContext.Provider>
  );
}

export function useNotify(): NotifyApi {
  const ctx = useContext(NotifyContext);
  if (!ctx) {
    throw new Error('useNotify must be used within NotificationsProvider');
  }
  return ctx;
}
