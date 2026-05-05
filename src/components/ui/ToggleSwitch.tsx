"use client";

import { motion } from "framer-motion";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({ enabled, onChange, disabled }: ToggleSwitchProps) {
  return (
    <motion.button
      className={`relative w-[52px] h-[28px] rounded-full cursor-pointer transition-all duration-300 border ${
        enabled
          ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] border-[var(--accent)] shadow-[var(--neon-glow)]"
          : "bg-slate-800 border-[var(--border-color)]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={() => !disabled && onChange(!enabled)}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <motion.div
        className="absolute w-[22px] h-[22px] bg-white rounded-full top-[2px]"
        animate={{ x: enabled ? 26 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}
