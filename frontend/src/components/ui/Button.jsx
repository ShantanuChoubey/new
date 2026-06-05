import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";
import Loader from "./Loader";

const variantStyles = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 focus-ring shadow-sm",
  secondary: "bg-secondary-800 text-white hover:bg-secondary-900 focus-ring shadow-sm",
  outline: "border border-secondary-300 text-secondary-700 bg-white hover:bg-secondary-50 focus-ring",
  ghost: "text-secondary-700 hover:bg-secondary-100 focus-ring",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-ring shadow-sm",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 focus-ring shadow-sm",
};

const sizeStyles = {
  xs: "px-2.5 py-1 text-xs rounded-md",
  sm: "px-3.5 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
};

/**
 * Polymorphic, accessible Button component.
 *
 * @prop {string}    variant   - primary | secondary | outline | ghost | danger | success
 * @prop {string}    size      - xs | sm | md | lg
 * @prop {boolean}   isLoading - show spinner and disable interaction
 * @prop {boolean}   fullWidth - stretch to container width
 * @prop {ReactNode} leftIcon  - icon rendered before label
 * @prop {ReactNode} rightIcon - icon rendered after label
 */
const Button = forwardRef(function Button(
  {
    children,
    variant   = "primary",
    size      = "md",
    isLoading = false,
    fullWidth = false,
    disabled  = false,
    leftIcon,
    rightIcon,
    className,
    type      = "button",
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
        "focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant] ?? variantStyles.primary,
        sizeStyles[size]       ?? sizeStyles.md,
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader size="sm" color="current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </motion.button>
  );
});

export default Button;
