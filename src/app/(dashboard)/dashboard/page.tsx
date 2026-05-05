"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
import { signOut } from "next-auth/react";
import { getBotInviteUrl } from "@/lib/discord";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  iconUrl: string | null;
  botAdded: boolean;
}

export default function DashboardPage() {
  const { t } = useI18n();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [servers, setServers] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/servers")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setServers(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-[var(--accent)] border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  

  return (
    <div className="min-h-screen">
      <Navbar
        user={session?.user}
        isAdmin={session?.isAdmin}
        onLogout={() => signOut({ callbackUrl: "/" })}
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-[var(--text-bright)]">
            {t("servers.title")}
          </h1>
          <p className="text-[var(--text-muted)] mb-10">
            {t("servers.subtitle")}
          </p>
        </motion.div>

        {servers.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-[var(--text-muted)] text-lg">
              {t("servers.noServers")}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server, i) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <NeonCard className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {server.iconUrl ? (
                      <img
                        src={server.iconUrl}
                        alt={server.name}
                        className="w-14 h-14 rounded-xl"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center text-black text-xl font-bold">
                        {server.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate text-[var(--text-bright)]">
                        {server.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            server.botAdded
                              ? "bg-[var(--success)]"
                              : "bg-[var(--text-muted)]"
                          }`}
                        />
                        <span className="text-xs text-[var(--text-muted)]">
                          {server.botAdded
                            ? t("servers.botActive")
                            : t("servers.botInactive")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {server.botAdded ? (
                    <NeonButton
                      className="w-full"
                      onClick={() =>
                        router.push(`/dashboard/${server.id}`)
                      }
                    >
                      {t("servers.openDashboard")}
                    </NeonButton>
                  ) : (
                    <NeonButton
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "";
                        window.open(
                          getBotInviteUrl(clientId, server.id),
                          "_blank"
                        );
                      }}
                    >
                      {t("servers.addBot")}
                    </NeonButton>
                  )}
                </NeonCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
