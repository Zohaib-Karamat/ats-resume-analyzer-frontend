import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { IconButton } from "./IconButton";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, className }) {
  const dialogRef = useRef(null);
  const titleId = `modal-title-${title?.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Allow native Escape key to call our onClose so state stays in sync
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e) => {
      e.preventDefault();
      onClose?.();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-modal="true"
      className={cn(
        "backdrop:bg-zinc-950/50 backdrop:backdrop-blur-sm",
        "m-auto max-h-[92dvh] w-[calc(100%-1rem)] max-w-lg overflow-hidden rounded-[var(--radius-xl)] bg-white p-0 shadow-lg sm:w-[calc(100%-2rem)] dark:bg-zinc-900",
        "open:animate-in open:fade-in-90 open:zoom-in-95",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
        <h2 id={titleId} className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </h2>
        <IconButton variant="ghost" size="sm" onClick={onClose} aria-label="Close dialog">
          <X className="h-4 w-4" aria-hidden="true" />
        </IconButton>
      </div>
      <div className="max-h-[calc(92dvh-73px)] overflow-y-auto p-4 sm:p-6">
        {children}
      </div>
    </dialog>
  );
}
