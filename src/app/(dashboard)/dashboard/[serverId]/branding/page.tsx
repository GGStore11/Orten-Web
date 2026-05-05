"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";

const NAME_STYLES = [
  { id: "default", preview: "channel-name" },
  { id: "fancy", preview: "𝒸𝒽𝒶𝓃𝓃𝑒𝓁-𝓃𝒶𝓂𝑒" },
  { id: "bold", preview: "𝗰𝗵𝗮𝗻𝗻𝗲𝗹-𝗻𝗮𝗺𝗲" },
  { id: "italic", preview: "𝘤𝘩𝘢𝘯𝘯𝘦𝘭-𝘯𝘢𝘮𝘦" },
  { id: "mono", preview: "𝚌𝚑𝚊𝚗𝚗𝚎𝚕-𝚗𝚊𝚖𝚎" },
];

export default function BrandingPage() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const params = useParams();
  const serverId = params.serverId as string;
  
  const plan = (session?.plan) || "free";
  const isPremium = plan === "premium" || plan === "elite";

  const [botName, setBotName] = useState("");
  const [botAvatar, setBotAvatar] = useState("");
  const [nameStyle, setNameStyle] = useState("default");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const sidebarItems = [
    { label: t("dashboard.overview"), href: `/dashboard/${serverId}`, icon: "📊" },
    { label: t("dashboard.templates"), href: `/dashboard/${serverId}/templates`, icon: "🎨" },
    { label: t("dashboard.plugins"), href: `/dashboard/${serverId}/plugins`, icon: "⚡" },
    { label: t("dashboard.branding"), href: `/dashboard/${serverId}/branding`, icon: "🎭" },
  ];

  useEffect(() => {
    fetch(`/api/branding?serverId=${serverId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.botName) setBotName(data.botName);
        if (data.botAvatar) setBotAvatar(data.botAvatar);
        if (data.nameStyle) setNameStyle(data.nameStyle);
      });
  }, [serverId]);

  const handleSave = async () => {
    setSaving(true);
    setResult(null);

    try {
      const res = await fetch("/api/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverId, botName, botAvatar, nameStyle }),
      });

      if (res.ok) {
        setResult(t("common.success"));
      } else {
        const data = await res.json();
        setResult(data.error || t("common.error"));
      }
    } catch {
      setResult(t("common.error"));
    }
    setSaving(false);
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

        <main className="flex-1 p-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2 text-[var(--text-bright)]">
              {t("branding.title")}
            </h1>
            <p className="text-[var(--text-muted)] mb-8">
              {t("branding.subtitle")}
            </p>
          </motion.div>

          {!isPremium && (
            <motion.div
              className="mb-8 p-4 rounded-xl border border-[var(--warning)] bg-[rgba(245,158,11,0.1)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-[var(--warning)] text-sm font-medium">
                ⚠️ {t("branding.premiumOnly")}
              </p>
            </motion.div>
          )}

          <div className="space-y-6">
            {/* Bot Name */}
            <NeonCard className="p-6" hoverable={false}>
              <label className="block text-sm font-medium mb-2 text-[var(--text-bright)]">
                {t("branding.botName")}
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="neon-input"
                placeholder="Orten Bot"
                disabled={!isPremium}
              />
            </NeonCard>

            {/* Bot Avatar */}
            <NeonCard className="p-6" hoverable={false}>
              <label className="block text-sm font-medium mb-2 text-[var(--text-bright)]">
                {t("branding.botAvatar")}
              </label>
              <div className="flex items-center gap-4">
                {botAvatar && (
                  <img
                    src={botAvatar}
                    alt="Bot Avatar"
                    className="w-16 h-16 rounded-xl border border-[var(--border-color)]"
                  />
                )}
                <input
                  type="url"
                  value={botAvatar}
                  onChange={(e) => setBotAvatar(e.target.value)}
                  className="neon-input flex-1"
                  placeholder="https://example.com/avatar.png"
                  disabled={!isPremium}
                />
              </div>
            </NeonCard>

            {/* Name Style */}
            <NeonCard className="p-6" hoverable={false}>
              <label className="block text-sm font-medium mb-4 text-[var(--text-bright)]">
                {t("branding.nameStyle")}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {NAME_STYLES.map((style) => (
                  <motion.button
                    key={style.id}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      nameStyle === style.id
                        ? "border-[var(--accent)] bg-[rgba(0,240,255,0.1)]"
                        : "border-[var(--border-color)] hover:border-[var(--border-color-hover)]"
                    } ${!isPremium ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    onClick={() => isPremium && setNameStyle(style.id)}
                    whileTap={isPremium ? { scale: 0.97 } : {}}
                  >
                    <p className="text-xs text-[var(--text-muted)] mb-1">
                      {t(`branding.nameStyles.${style.id}`)}
                    </p>
                    <p className="text-sm font-medium">{style.preview}</p>
                  </motion.button>
                ))}
              </div>
            </NeonCard>

            {/* Save */}
            <div className="flex items-center gap-4">
              <NeonButton
                onClick={handleSave}
                disabled={!isPremium || saving}
              >
                {saving ? t("common.loading") : t("common.save")}
              </NeonButton>
              {result && (
                <motion.span
                  className="text-sm text-[var(--success)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {result}
                </motion.span>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
