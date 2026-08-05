import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useResumes } from "../../features/resumes/hooks/useResumes";
import { useJobDescriptions } from "../../features/job-descriptions/hooks/useJobDescriptions";
import { useUpdateOnboarding } from "../../features/auth/hooks/useUpdateOnboarding";

const OnboardingContext = createContext(undefined);

export function OnboardingProvider({ children }) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: resumes } = useResumes();
  const { data: jdsData } = useJobDescriptions();
  const { mutate: updateOnboarding } = useUpdateOnboarding();

  const onboardingStatus = user?.onboardingStatus || { completed: false, skipped: false };
  const isAuthenticated = !!token;
  const isOnboardingDone = onboardingStatus.completed || onboardingStatus.skipped;
  const isActive = isAuthenticated && !isOnboardingDone;

  const [currentStep, setCurrentStep] = useState(1);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Reset local state if user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setHasStarted(false);
      setShowWelcome(false);
      setShowCelebration(false);
    }
  }, [isAuthenticated]);

  const prevHasResume = useRef(false);
  const prevHasJD = useRef(false);

  const hasResume = Array.isArray(resumes) ? resumes.length > 0 : false;
  const hasJD = Array.isArray(jdsData?.data) ? jdsData.data.length > 0 : false;

  // Auto-advance step based on existing data
  useEffect(() => {
    if (!isActive) return;
    if (!hasResume) {
      setCurrentStep(1);
    } else if (!hasJD) {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }
  }, [isActive, hasResume, hasJD]);

  // Auto-navigate when resume is uploaded (step 1 → 2)
  useEffect(() => {
    if (!isActive) return;
    if (hasResume && !prevHasResume.current && !hasJD) {
      prevHasResume.current = true;
      navigate("/job-descriptions");
    } else {
      prevHasResume.current = hasResume;
    }
  }, [isActive, hasResume, hasJD, navigate]);

  // Auto-navigate when JD is created (step 2 → 3)
  useEffect(() => {
    if (!isActive) return;
    if (hasJD && !prevHasJD.current && hasResume) {
      prevHasJD.current = true;
      navigate("/analysis");
    } else {
      prevHasJD.current = hasJD;
    }
  }, [isActive, hasJD, hasResume, navigate]);

  // Show welcome modal on first entry when user has no resumes
  useEffect(() => {
    if (isActive && !hasStarted && !hasResume) {
      setShowWelcome(true);
    }
  }, [isActive, hasStarted, hasResume]);

  const skip = useCallback(() => {
    setShowWelcome(false);
    setHasStarted(true);
    updateOnboarding({ skipped: true });
  }, [updateOnboarding]);

  const dismiss = useCallback(() => {
    // Only closes the modal/coachmark for THIS session. Doesn't save to DB.
    setShowWelcome(false);
    setHasStarted(true);
  }, []);

  const complete = useCallback(() => {
    setShowCelebration(true);
    updateOnboarding({ completed: true });
  }, [updateOnboarding]);

  const start = useCallback(() => {
    setShowWelcome(false);
    setHasStarted(true);
    navigate("/resumes");
  }, [navigate]);

  const restartOnboarding = useCallback(() => {
    // Called from settings/profile to reset onboarding
    updateOnboarding({ completed: false, skipped: false });
    setCurrentStep(1);
    setHasStarted(false);
    setShowCelebration(false);
    setShowWelcome(true);
  }, [updateOnboarding]);

  return (
    <OnboardingContext.Provider
      value={{
        isActive,
        currentStep,
        hasResume,
        hasJD,
        skip,
        dismiss,
        complete,
        start,
        restartOnboarding,
        showWelcome,
        setShowWelcome,
        showCelebration,
        setShowCelebration,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
