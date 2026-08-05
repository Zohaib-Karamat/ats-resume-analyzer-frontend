import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { useOnboarding } from "./OnboardingContext";

const TOTAL_STEPS = 3;

const stepConfig = {
  1: {
    title: "Upload Your Resume",
    message: "Start by uploading your latest resume. We support PDF and DOCX files.",
    pulse: true,
  },
  2: {
    title: "Add a Job Description",
    message:
      "Paste the complete job description you want to apply for. The more complete it is, the better your ATS analysis will be.",
    pulse: true,
  },
  3: {
    title: "Run AI Analysis",
    message:
      "Select your resume and job description, then generate your first AI-powered ATS report.",
    pulse: false,
  },
};

export function CoachMark({ targetLabel }) {
  const { isActive, currentStep, dismiss } = useOnboarding();
  const config = stepConfig[currentStep];

  if (!isActive || !config) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={`coach-${currentStep}`}
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative w-full rounded-2xl border border-zinc-200/50 bg-white/80 p-5 shadow-2xl backdrop-blur-xl dark:border-zinc-700/50 dark:bg-zinc-900/80"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Step badge */}
            <div className="flex-shrink-0 mt-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-50 dark:ring-indigo-900/20">
                {currentStep}
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-0.5 flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Step {currentStep} of {TOTAL_STEPS}
                </p>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">{config.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{config.message}</p>
              {targetLabel && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span>{targetLabel}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={dismiss}
            aria-label="Dismiss onboarding"
            className="flex-shrink-0 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
