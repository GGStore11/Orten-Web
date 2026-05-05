"use client";

import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  user?: { name?: string | null; image?: string | null } | null;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export default function Navbar({ user, isAdmin, onLogout }: NavbarProps) {
  const { locale, setLocale, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-0 z-50 glass-bg border-b border-[var(--border-color)]"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center text-black font-bold text-lg">
            O
          </div>
          <span className="text-xl font-bold neon-text">Orten</span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <motion.button
            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            whileTap={{ scale: 0.95 }}
          >
            {locale === "ar" ? "EN" : "عربي"}
          </motion.button>

          {user ? (
            <div className="relative">
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-color)] cursor-pointer hover:border-[var(--accent)] transition-all"
                onClick={() => setMenuOpen(!menuOpen)}
                whileTap={{ scale: 0.97 }}
              >
                {user.image && (
                  <img
                    src={user.image}
                    alt=""
                    className="w-7 h-7 rounded-full"
                  />
                )}
                <span className="text-sm font-medium">{user.name}</span>
              </motion.div>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="absolute top-full mt-2 end-0 w-48 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-2xl z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 hover:bg-[rgba(0,240,255,0.05)] transition-colors text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("common.dashboard")}
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-3 hover:bg-[rgba(0,240,255,0.05)] transition-colors text-sm text-[var(--accent)]"
                        onClick={() => setMenuOpen(false)}
                      >
                        {t("common.admin")}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-start px-4 py-3 hover:bg-[rgba(239,68,68,0.05)] transition-colors text-sm text-red-400"
                    >
                      {t("common.logout")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login">
              <motion.button
                className="neon-button text-sm px-5 py-2"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {t("common.login")}
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
