"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function NeonCard({
  children,
  className = "",
  onClick,
  hoverable = true,
}: NeonCardProps) {
  return (
    <motion.div
      className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl backdrop-blur-xl 
        ${hoverable ? "hover:border-[var(--border-color-hover)] hover:shadow-[var(--neon-glow)]" : ""} 
        transition-all duration-300 ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      whileHover={hoverable ? { y: -2 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
