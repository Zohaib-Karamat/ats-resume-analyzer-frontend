import { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Select = forwardRef(({ options, placeholder = "Select an option", className, value, onChange, disabled, name, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-[var(--radius-md)] border border-zinc-200/80 bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer transition-all duration-200 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-white shadow-sm",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-indigo-500/50 border-indigo-500",
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
           if (e.key === 'Enter' || e.key === ' ') {
             e.preventDefault();
             !disabled && setIsOpen(!isOpen);
           }
        }}
      >
        <span className={!selectedOption ? "text-zinc-500 dark:text-zinc-400" : "truncate pr-4"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform duration-200", isOpen && "rotate-180")} />
      </div>

      {/* Hidden select for form submission and react-hook-form ref */}
      <select 
         ref={ref} 
         value={value || ""} 
         onChange={onChange} 
         name={name}
         className="hidden" 
         disabled={disabled}
         {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-zinc-200/80 bg-white/90 py-1 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/90 ring-1 ring-black/5 focus:outline-none glass-panel transition-all">
          {options.length === 0 ? (
            <div className="relative cursor-default select-none px-4 py-2 text-sm text-zinc-500">
              No options available
            </div>
          ) : (
            options.map((opt) => (
              <div
                key={opt.value}
                className={cn(
                  "relative cursor-pointer select-none py-2.5 pl-3 pr-9 text-sm text-zinc-900 transition-colors hover:bg-zinc-100/80 dark:text-zinc-100 dark:hover:bg-zinc-800/50 m-1 rounded-md",
                  value === opt.value && "bg-indigo-50/80 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-100 font-medium"
                )}
                onClick={() => {
                  if (onChange) {
                    onChange({ target: { value: opt.value, name } });
                  }
                  setIsOpen(false);
                }}
              >
                <span className="block truncate">{opt.label}</span>
                {value === opt.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600 dark:text-indigo-400">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
});
Select.displayName = "Select";
