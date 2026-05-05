"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NeonCard from "@/components/ui/NeonCard";

export default function ServerDashboard() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const serverId = params.serverId as string;
  

  const sidebarItems = [
    { label: t("dashboard.overview"), href: `/dashboard/${serverId}`, icon: "📊" },
    { label: t("dashboard.templates"), href: `/dashboard/${serverId}/templates`, icon: "🎨" },
    { label: t("dashboard.plugins"), href: `/dashboard/${serverId}/plugins`, icon: "⚡" },
    { label: t("dashboard.branding"), href: `/dashboard/${serverId}/branding`, icon: "🎭" },
  ];

  const quickActions = [
    {
      icon: "🎨",
      title: t("dashboard.templates"),
      desc: t("templates.subtitle"),
      href: `/dashboard/${serverId}/templates`,
    },
    {
      icon: "⚡",
      title: t("dashboard.plugins"),
      desc: t("plugins.subtitle"),
      href: `/dashboard/${serverId}/plugins`,
    },
    {
      icon: "🎭",
      title: t("dashboard.branding"),
      desc: t("branding.subtitle"),
      href: `/dashboard/${serverId}/branding`,
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
              {t("dashboard.overview")}
            </h1>
            <p className="text-[var(--text-muted)] mb-8">
              Server ID: {serverId}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <NeonCard
                  className="p-6 cursor-pointer"
                  onClick={() => router.push(action.href)}
                >
                  <div className="text-4xl mb-4">{action.icon}</div>
                  <h3 className="text-lg font-bold mb-2 text-[var(--text-bright)]">
                    {action.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {action.desc}
                  </p>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
