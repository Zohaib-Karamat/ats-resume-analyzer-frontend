import { useState } from "react";
import { ChevronDown, SpellCheck, Briefcase } from "lucide-react";
import { cn } from "../../../lib/utils";

function AccordionItem({ title, icon: Icon, items = [], defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-zinc-50 px-4 py-3 text-left transition-colors hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-md bg-indigo-100 p-1.5 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            <Icon className="h-4 w-4" />
          </div>
          <span className="min-w-0 truncate font-semibold text-zinc-900 dark:text-zinc-100">{title}</span>
          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {items.length}
          </span>
        </div>
        <ChevronDown 
          className={cn("h-5 w-5 text-zinc-400 transition-transform duration-200", isOpen && "rotate-180")} 
        />
      </button>
      
      {isOpen && (
        <div className="border-t border-zinc-100 px-4 py-4 dark:border-zinc-800">
          <ul className="space-y-4">
            {items.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {i + 1}
                </span>
                <span className="mt-0.5">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SuggestionsAccordion({ suggestions }) {
  if (!suggestions) return null;

  return (
    <div className="space-y-4">
      <AccordionItem 
        title="ATS Optimization Rules" 
        icon={Briefcase} 
        items={suggestions.ats} 
        defaultOpen={true}
      />
      <AccordionItem 
        title="Grammar & Phrasing" 
        icon={SpellCheck} 
        items={suggestions.grammar} 
      />
    </div>
  );
}
