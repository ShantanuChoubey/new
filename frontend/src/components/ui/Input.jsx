import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "../../utils/helpers";

/**
 * Accessible, feature-rich Input component.
 *
 * Supports: text, email, password (with show/hide toggle), number, tel, url.
 * Integrates cleanly with React Hook Form via forwardRef.
 *
 * @prop {string}    label       - visible label text
 * @prop {string}    error       - error message (shows below input)
 * @prop {string}    hint        - hint text below the input (hidden when error shown)
 * @prop {ReactNode} leftIcon    - icon inside left side of input
 * @prop {ReactNode} rightIcon   - icon inside right side of input
 * @prop {boolean}   fullWidth   - stretch input to container
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    fullWidth = true,
    type      = "text",
    id,
    className,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId      = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const isPassword   = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "w-full")}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-secondary-700"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-secondary-400 pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={!!error}
          aria-describedby={
            error  ? `${inputId}-error` :
            hint   ? `${inputId}-hint`  : undefined
          }
          className={cn(
            "block rounded-lg border bg-white text-secondary-900 placeholder-secondary-400",
            "text-sm transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 focus:border-transparent",
            leftIcon  ? "pl-10" : "pl-3.5",
            isPassword || rightIcon ? "pr-10" : "pr-3.5",
            "py-2.5",
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-secondary-300 hover:border-secondary-400",
            fullWidth && "w-full",
            className
          )}
          {...props}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 text-secondary-400 hover:text-secondary-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {/* Custom right icon (non-password) */}
        {!isPassword && rightIcon && (
          <span className="absolute right-3 text-secondary-400 pointer-events-none">
            {rightIcon}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="flex items-center gap-1 text-xs text-red-600 mt-0.5"
        >
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </p>
      )}

      {/* Hint */}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-secondary-500 mt-0.5">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
