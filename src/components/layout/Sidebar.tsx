"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  items: SidebarItem[];
  serverName?: string;
}

export default function Sidebar({ items, serverName }: SidebarProps) {
  const pathname = usePathname();
  const { dir } = useI18n();

  return (
    <motion.aside
      className={`w-64 min-h-[calc(100vh-60px)] bg-[var(--bg-card)] border-${dir === "rtl" ? "l" : "r"} border-[var(--border-color)] p-4 flex flex-col gap-2`}
      initial={{ x: dir === "rtl" ? 100 : -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {serverName && (
        <div className="px-3 py-3 mb-4 border-b border-[var(--border-color)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">السيرفر</p>
          <p className="text-sm font-bold truncate">{serverName}</p>
        </div>
      )}

      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <motion.div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[rgba(0,240,255,0.15)] to-transparent border border-[var(--accent)] text-[var(--accent)]"
                  : "hover:bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
              whileHover={{ x: dir === "rtl" ? -4 : 4 }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          </Link>
        );
      })}
    </motion.aside>
  );
}
