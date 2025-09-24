"use client"

import React from "react"
import { cn } from "@/lib/utils"

type AlertVariant = "default" | "destructive" | "success" | "warning"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = "default",
  ...props
}) => {
  const variantClasses: Record<AlertVariant, string> = {
    default: "border-gray-200 bg-white text-gray-900",
    destructive: "border-red-200 bg-red-50 text-red-900",
    success: "border-green-200 bg-green-50 text-green-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
  }

  return (
    <div
      role="alert"
      className={cn(
        "w-full rounded-lg border p-4 text-sm",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => {
  return <p className={cn("leading-relaxed", className)} {...props} />
}









