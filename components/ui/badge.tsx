import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-neutral-800 text-neutral-200": variant === "default",
          "bg-neutral-700 text-neutral-300": variant === "secondary",
          "bg-green-500/10 text-green-400 border border-green-500/20": variant === "success",
          "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20": variant === "warning",
          "bg-red-500/10 text-red-400 border border-red-500/20": variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
}
