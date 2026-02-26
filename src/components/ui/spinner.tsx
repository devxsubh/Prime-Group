import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  /** Optional text shown below the spinner (e.g. "Loading...") */
  label?: string;
  /** "sm" for inline/button use, "md" for full-page loading */
  size?: "sm" | "md";
}

export function Spinner({ className, label, size = "md" }: SpinnerProps) {
  const sizeClass = size === "sm" ? "h-5 w-5" : "h-8 w-8";
  return (
    <div
      className={cn(
        size === "sm" ? "inline-flex items-center justify-center" : "flex flex-col items-center gap-4",
        className
      )}
      role="status"
      aria-label={label ?? "Loading"}
    >
      <svg
        className={cn(sizeClass, "animate-spin")}
        style={{ color: "var(--primary-blue)" }}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="32 24"
        />
      </svg>
      {label && size === "md" && (
        <p className="font-montserrat text-sm" style={{ color: "var(--primary-blue)" }}>
          {label}
        </p>
      )}
    </div>
  );
}
