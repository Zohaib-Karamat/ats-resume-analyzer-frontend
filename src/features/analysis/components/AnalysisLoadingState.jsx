import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, FileSearch, Target, Sparkles } from "lucide-react";

const steps = [
  { icon: FileSearch, text: "Parsing your resume data..." },
  { icon: Target, text: "Extracting job description keywords..." },
  { icon: BrainCircuit, text: "Scoring semantic match via Gemini..." },
  { icon: Sparkles, text: "Generating actionable suggestions..." },
];

export function AnalysisLoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Cycle through steps to give the illusion of progress
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-800 dark:border-t-indigo-500"
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            {(() => {
              const Icon = steps[currentStep].icon;
              return <Icon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />;
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="h-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              {steps[currentStep].text}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              This usually takes a few seconds...
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
