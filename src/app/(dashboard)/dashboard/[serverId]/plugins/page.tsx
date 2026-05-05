"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NeonCard from "@/components/ui/NeonCard";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

interface PluginState {
  name: string;
  enabled: boolean;
}

const pluginMeta: Record<string, { icon: string; translationKey: string }> = {
  tickets: { icon: "🎫", translationKey: "tickets" },
  levels: { icon: "📊", translationKey: "levels" },
  protection: { icon: "🛡️", translationKey: "protection" },
  invites: { icon: "📨", translationKey: "invites" },
};

export default function PluginsPage() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const params = useParams();
  const serverId = params.serverId as string;
  
  const [plugins, setPlugins] = useState<PluginState[]>([]);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { label: t("dashboard.overview"), href: `/dashboard/${serverId}`, icon: "📊" },
    { label: t("dashboard.templates"), href: `/dashboard/${serverId}/templates`, icon: "🎨" },
    { label: t("dashboard.plugins"), href: `/dashboard/${serverId}/plugins`, icon: "⚡" },
    { label: t("dashboard.branding"), href: `/dashboard/${serverId}/branding`, icon: "🎭" },
  ];

  useEffect(() => {
    fetch(`/api/plugins?serverId=${serverId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPlugins(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [serverId]);

  const togglePlugin = async (name: string, enabled: boolean) => {
    setPlugins((prev) =>
      prev.map((p) => (p.name === name ? { ...p, enabled } : p))
    );

    await fetch("/api/plugins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverId, pluginName: name, enabled }),
    });
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
              {t("plugins.title")}
            </h1>
            <p className="text-[var(--text-muted)] mb-8">
              {t("plugins.subtitle")}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <motion.div
                className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {plugins.map((plugin, i) => {
                const meta = pluginMeta[plugin.name] || {
                  icon: "⚙️",
                  translationKey: plugin.name,
                };
                return (
                  <motion.div
                    key={plugin.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <NeonCard className="p-6" hoverable={false}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{meta.icon}</span>
                          <div>
                            <h3 className="text-lg font-bold text-[var(--text-bright)]">
                              {t(`plugins.${meta.translationKey}`)}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)]">
                              {t(`plugins.${meta.translationKey}Desc`)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-medium ${
                              plugin.enabled
                                ? "text-[var(--success)]"
                                : "text-[var(--text-muted)]"
                            }`}
                          >
                            {plugin.enabled
                              ? t("common.enabled")
                              : t("common.disabled")}
                          </span>
                          <ToggleSwitch
                            enabled={plugin.enabled}
                            onChange={(enabled) =>
                              togglePlugin(plugin.name, enabled)
                            }
                          />
                        </div>
                      </div>
                    </NeonCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
