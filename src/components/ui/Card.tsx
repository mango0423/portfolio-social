import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className = "", variant = "default", padding = "md", children, ...props },
    ref
  ) => {
    const variants = {
      default: "bg-[var(--color-background)] border border-[var(--color-border)]",
      elevated: "bg-[var(--color-background)] shadow-[var(--shadow-soft)]",
      outlined: "bg-transparent border-2 border-[var(--color-border)]",
    };

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    };

    return (
      <div
        ref={ref}
        className={`
          rounded-[var(--radius-lg)] overflow-hidden
          ${variants[variant]}
          ${paddings[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
