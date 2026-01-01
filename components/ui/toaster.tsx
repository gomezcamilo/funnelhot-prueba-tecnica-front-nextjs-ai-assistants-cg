"use client";

import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => {
            if (toast.onClick) {
              toast.onClick();
            }
            dismiss(toast.id);
          }}
          className={cn(
            "relative flex w-full max-w-sm items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg animate-slide-up cursor-pointer hover:bg-card/90 transition-colors"
          )}
        >
          <div className="flex-1">
            {toast.title && <p className="text-sm font-semibold text-foreground">{toast.title}</p>}
            {toast.description && <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismiss(toast.id);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
