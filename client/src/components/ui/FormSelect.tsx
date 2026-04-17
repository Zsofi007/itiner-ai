import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

export type FormSelectOption = { value: string; label: string };

const triggerClass =
  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-900 shadow-sm outline-none ring-teal-500/30 transition focus-visible:border-teal-500 focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

const listClass =
  "absolute left-0 right-0 z-[60] mt-1 max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-950";

const optionClass =
  "flex w-full cursor-pointer items-center px-4 py-2.5 text-left text-sm text-slate-900 transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none dark:text-slate-100 dark:hover:bg-slate-800/80 dark:focus:bg-slate-800/80";

const optionSelectedClass =
  "bg-teal-50 font-medium text-teal-950 dark:bg-teal-950/40 dark:text-teal-50";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly FormSelectOption[];
  disabled?: boolean;
};

export function FormSelect({
  id,
  value,
  onChange,
  options,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const label = selected?.label ?? value;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close();
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={triggerClass}
        onClick={() => {
          if (disabled) return;
          setOpen((o) => !o);
        }}
      >
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-400 ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      {open ? (
        <ul id={listId} role="listbox" tabIndex={-1} className={listClass}>
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`${optionClass} ${isSelected ? optionSelectedClass : ""}`}
                  onClick={() => {
                    onChange(opt.value);
                    close();
                  }}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
