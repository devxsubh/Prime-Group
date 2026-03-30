import { CheckCircle2, Circle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface OnboardingChecklistProps {
  currentStep: number;
  email?: string;
}

const STEP_LABELS = [
  "Basic Information",
  "Education & Work",
  "Your Gotra",
  "Family Details",
  "Contact & Location",
  "Partner Preference",
  "Photos",
];

export function OnboardingChecklist({ currentStep, email }: OnboardingChecklistProps) {
  const [completedPercentage, setCompletedPercentage] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch("/api/profile/progress", { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as { percent?: number };
        if (!cancelled && typeof data.percent === "number") {
          setCompletedPercentage(data.percent);
        }
      } catch {
        // ignore
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const fallbackPercentage = useMemo(() => {
    const totalSteps = STEP_LABELS.length;
    return Math.round((currentStep / totalSteps) * 100);
  }, [currentStep]);

  const pct = completedPercentage ?? fallbackPercentage;

  return (
    <div className="relative rounded-3xl bg-white p-4 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[rgba(198,167,94,0.3)] flex flex-col h-full w-full">
      <div className="mb-4 sm:mb-6">
        <h3 className="font-playfair-display text-lg sm:text-2xl font-bold text-[var(--primary-blue)] mb-1.5 sm:mb-2">
          Profile Progress
        </h3>
        {email && (
          <p className="text-xs sm:text-sm font-medium text-[var(--accent-gold)] mb-2">
            {email}
          </p>
        )}
        <p className="hidden sm:block text-sm text-gray-500">
          Complete your profile to unlock all features and find your perfect match.
        </p>
      </div>

      <div className="mb-0 sm:mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-medium text-gray-700">Completion</span>
          <span className="text-xl font-bold text-[var(--accent-gold)]">{pct}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent-gold)] transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct >= 80 && (
          <p className="text-xs text-green-600 font-medium mt-2">
            You can now proceed to Discovery!
          </p>
        )}
      </div>

      <div className="hidden sm:block space-y-4 flex-1">
        {STEP_LABELS.map((label, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          
          return (
            <div 
              key={index} 
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all",
                isCurrent ? "bg-[rgba(198,167,94,0.08)] border border-[rgba(198,167,94,0.3)] shadow-sm" : "border border-transparent",
                isCompleted ? "opacity-100" : (isCurrent ? "opacity-100" : "opacity-50")
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-[var(--accent-gold)] shrink-0" />
              ) : (
                <Circle className={cn(
                  "w-5 h-5 shrink-0", 
                  isCurrent ? "text-[var(--primary-blue)]" : "text-gray-300"
                )} />
              )}
              <span className={cn(
                "text-sm font-medium",
                isCurrent ? "text-[var(--primary-blue)]" : (isCompleted ? "text-gray-700" : "text-gray-400")
              )}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="hidden sm:block mt-8 pt-6 border-t border-gray-100">
        <div className="rounded-xl bg-[#F8FAFC] p-4 border border-[var(--primary-blue)]/10 text-center">
          <p className="text-sm font-semibold text-[var(--primary-blue)] mb-1">Need Help?</p>
          <p className="text-xs text-gray-600 mb-2">
            Contact Prime Group if you face any issues while filling the form.
          </p>
          <a href="tel:+919876543210" className="inline-block text-sm font-bold text-[var(--accent-gold)] tracking-wide">
            +91 98765 43210
          </a>
        </div>
      </div>
    </div>
  );
}
