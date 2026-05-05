"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NeonCard from "@/components/ui/NeonCard";

export default function AdminPage() {
  const { t } = useI18n();
  const { data: session, status } = useSession();
  const router = useRouter();
  

  useEffect(() => {
    if (status === "authenticated" && !session?.isAdmin) {
      router.push("/dashboard");
    }
  }, [status, session?.isAdmin, router]);

  const sidebarItems = [
    { label: t("adminPanel.title"), href: "/admin", icon: "🏠" },
    { label: t("adminPanel.promoCodes"), href: "/admin/promo-codes", icon: "🎟️" },
    { label: t("adminPanel.subscribers"), href: "/admin/subscribers", icon: "👥" },
  ];

  const cards = [
    {
      icon: "🎟️",
      title: t("adminPanel.promoCodes"),
      desc: t("promo.title"),
      href: "/admin/promo-codes",
    },
    {
      icon: "👥",
      title: t("adminPanel.subscribers"),
      desc: t("subscribers.title"),
      href: "/admin/subscribers",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar
        user={session?.user}
        isAdmin={session?.isAdmin}
        onLogout={() => signOut({ callbackUrl: "/" })}
      />

      <div className="flex">
        <Sidebar items={sidebarItems} />

        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-[var(--text-bright)]">
              {t("adminPanel.title")}
            </h1>
            <p className="text-[var(--text-muted)] mb-8">
              {t("adminPanel.title")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, i) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <NeonCard
                  className="p-8 cursor-pointer"
                  onClick={() => router.push(card.href)}
                >
                  <div className="text-5xl mb-4">{card.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-[var(--text-bright)]">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">{card.desc}</p>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
