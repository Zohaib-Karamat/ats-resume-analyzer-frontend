import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Briefcase, Zap, ArrowRight, Sparkles } from "lucide-react";
import { useOnboarding } from "./OnboardingContext";

const steps = [
  {
    icon: FileText,
    emoji: "📄",
    title: "Upload Resume",
    description: "Upload your existing resume in PDF or DOCX format.",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/30",
  },
  {
    icon: Briefcase,
    emoji: "📝",
    title: "Add Job Description",
    description: "Paste a real job description for accurate AI analysis.",
    color: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-500",
    borderColor: "border-violet-500/30",
  },
  {
    icon: Zap,
    emoji: "🤖",
    title: "Run AI Analysis",
    description: "Compare your resume against the job and get detailed ATS insights.",
    color: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500/30",
  },
];

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modal = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 28, delay: 0.05 } },
  exit: { opacity: 0, scale: 0.94, y: 12, transition: { duration: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export function WelcomeModal() {
  const { showWelcome, skip, dismiss, start } = useOnboarding();

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl dark:bg-zinc-900/80 dark:border-zinc-700/50"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
          >
            {/* Header gradient band */}
            <div className="relative h-2 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />

            {/* Close button */}
            <button
              onClick={dismiss}
              aria-label="Dismiss onboarding"
              className="absolute right-4 top-5 rounded-full p-2 text-zinc-500 bg-white/50 backdrop-blur-md transition-colors hover:bg-zinc-200 hover:text-zinc-800 dark:bg-zinc-800/50 dark:hover:bg-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-6 pt-6 pb-3 sm:px-8 sm:pt-8">
              {/* Sparkles badge */}
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 dark:border-violet-800/50 dark:bg-violet-900/20 dark:text-violet-300">
                <Sparkles className="h-3 w-3" />
                Welcome aboard!
              </div>

              <h1
                id="onboarding-title"
                className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50"
              >
                Welcome to ATS Resume Analyzer
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-base">
                Let&apos;s get your account ready. We&apos;ll guide you through three quick steps to help you get the
                best AI-powered ATS analysis.
              </p>
            </div>

            {/* Step cards */}
            <div className="grid grid-cols-1 gap-3 px-6 py-4 sm:grid-cols-3 sm:px-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 ${step.borderColor} ${step.color}`}
                >
                  <div className={`mb-2 text-2xl`}>{step.emoji}</div>
                  <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{step.description}</p>
                  <div className="absolute -right-2 -top-2 text-3xl opacity-10">{step.emoji}</div>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 px-6 py-4 sm:flex-row sm:justify-between sm:px-8 dark:border-zinc-800">
              <button
                onClick={skip}
                className="text-sm text-zinc-500 underline-offset-2 transition-colors hover:text-zinc-800 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Skip Setup
              </button>
              <motion.button
                onClick={start}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-shadow hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
