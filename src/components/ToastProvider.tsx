"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastVariant = "info" | "success" | "error";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  notify: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function createId(): string {
  return `toast_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export function ToastProvider({
  children
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const notify = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = createId();
    setToasts((prev) => [...prev, { id, message, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.variant}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return value;
}
