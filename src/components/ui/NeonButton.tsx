"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

export default function NeonButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}: NeonButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-black font-bold hover:shadow-[var(--neon-glow-strong)]",
    outline:
      "bg-transparent text-[var(--accent)] border border-[var(--accent)] hover:bg-[rgba(0,240,255,0.1)] hover:shadow-[var(--neon-glow)]",
    danger:
      "bg-gradient-to-r from-red-600 to-red-500 text-white font-bold hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    ghost:
      "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[rgba(255,255,255,0.05)]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-xl",
  };

  return (
    <motion.button
      type={type}
      className={`${variants[variant]} ${sizes[size]} border-none cursor-pointer transition-all duration-300 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
