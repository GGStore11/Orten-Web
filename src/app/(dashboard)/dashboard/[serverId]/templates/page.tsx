"use client";

import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";

const templateKeys = ["store", "gaming", "community", "support"] as const;

export default function TemplatesPage() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const params = useParams();
  const serverId = params.serverId as string;
  
  const [applying, setApplying] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [result, setResult] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const sidebarItems = [
    { label: t("dashboard.overview"), href: `/dashboard/${serverId}`, icon: "📊" },
    { label: t("dashboard.templates"), href: `/dashboard/${serverId}/templates`, icon: "🎨" },
    { label: t("dashboard.plugins"), href: `/dashboard/${serverId}/plugins`, icon: "⚡" },
    { label: t("dashboard.branding"), href: `/dashboard/${serverId}/branding`, icon: "🎭" },
  ];

  const templates = templateKeys.map((key) => ({
    id: key,
    icon: key === "store" ? "🛒" : key === "gaming" ? "🎮" : key === "community" ? "👥" : "🎫",
    name: t(`templates.${key}`),
    desc: t(`templates.${key}Desc`),
  }));

  const handleApply = async (templateId: string) => {
    setApplying(templateId);
    setShowConfirm(null);
    setResult(null);

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId, templateId }),
      });

      if (res.ok) {
        setResult({ type: "success", msg: t("common.success") });
      } else {
        setResult({ type: "error", msg: t("common.error") });
      }
    } catch {
      setResult({ type: "error", msg: t("common.error") });
    }
    setApplying(null);
  };

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
              {t("templates.title")}
            </h1>
            <p className="text-[var(--text-muted)] mb-8">
              {t("templates.subtitle")}
            </p>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div
                className={`mb-6 p-4 rounded-xl border ${
                  result.type === "success"
                    ? "bg-[rgba(16,185,129,0.1)] border-[var(--success)] text-[var(--success)]"
                    : "bg-[rgba(239,68,68,0.1)] border-[var(--danger)] text-[var(--danger)]"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {result.msg}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((tmpl, i) => (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <NeonCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{tmpl.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-[var(--text-bright)]">
                        {tmpl.name}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] mb-4">
                        {tmpl.desc}
                      </p>

                      {showConfirm === tmpl.id ? (
                        <div className="flex gap-3">
                          <NeonButton
                            variant="danger"
                            size="sm"
                            onClick={() => handleApply(tmpl.id)}
                            disabled={applying !== null}
                          >
                            {applying === tmpl.id ? t("common.loading") : t("common.confirm")}
                          </NeonButton>
                          <NeonButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowConfirm(null)}
                          >
                            {t("common.cancel")}
                          </NeonButton>
                          <p className="text-xs text-[var(--warning)] mt-2">
                            {t("templates.warning")}
                          </p>
                        </div>
                      ) : (
                        <NeonButton
                          size="sm"
                          onClick={() => setShowConfirm(tmpl.id)}
                          disabled={applying !== null}
                        >
                          {t("templates.apply")}
                        </NeonButton>
                      )}
                    </div>
                  </div>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
