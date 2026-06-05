import { cn } from "../../utils/helpers";

const sizeMap = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
  xl: "h-16 w-16 border-4",
};

/**
 * Accessible spinner component.
 *
 * @prop {"xs"|"sm"|"md"|"lg"|"xl"} size
 * @prop {"primary"|"white"|"current"} color
 * @prop {string} label - accessible label (default "Loading…")
 */
function Loader({ size = "md", color = "primary", label = "Loading…", className }) {
  const colorClass =
    color === "white"   ? "border-white/30 border-t-white" :
    color === "current" ? "border-current/30 border-t-current" :
    "border-primary-200 border-t-primary-600";

  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block rounded-full animate-spin",
        sizeMap[size] ?? sizeMap.md,
        colorClass,
        className
      )}
    />
  );
}

/**
 * Full-page loading overlay.
 */
export function PageLoader({ message = "Loading…" }) {
  return (
    <div
      role="status"
      className="min-h-screen flex flex-col items-center justify-center gap-4 bg-secondary-50"
    >
      <Loader size="xl" />
      <p className="text-secondary-500 text-sm animate-pulse">{message}</p>
    </div>
  );
}

export default Loader;
