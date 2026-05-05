"use client";

import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";

interface Subscriber {
  id: string;
  discordId: string;
  username: string;
  avatar: string | null;
  subscription: {
    plan: string;
    status: string;
  } | null;
}

export default function SubscribersPage() {
  const { t, locale } = useI18n();
  const { data: session } = useSession();
  

  const [users, setUsers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activatingUser, setActivatingUser] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("elite");

  const sidebarItems = [
    { label: t("adminPanel.title"), href: "/admin", icon: "🏠" },
    { label: t("adminPanel.promoCodes"), href: "/admin/promo-codes", icon: "🎟️" },
    { label: t("adminPanel.subscribers"), href: "/admin/subscribers", icon: "👥" },
  ];

  const fetchUsers = (searchQuery?: string) => {
    const qs = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : "";
    fetch(`/api/admin/subscribers${qs}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetchUsers(search);
  };

  const handleActivate = async (userId: string) => {
    await fetch("/api/admin/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, plan: selectedPlan }),
    });
    setActivatingUser(null);
    fetchUsers(search);
  };

  const planBadge = (plan: string) => {
    const colors: Record<string, string> = {
      free: "bg-slate-700 text-slate-300",
      elite: "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
      premium: "bg-gradient-to-r from-yellow-600 to-orange-600 text-white",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[plan] || colors.free}`}>
        {plan.toUpperCase()}
      </span>
    );
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
            <h1 className="text-3xl font-bold mb-8 text-[var(--text-bright)]">
              {t("subscribers.title")}
            </h1>
          </motion.div>

          {/* Search */}
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              className="neon-input flex-1"
              placeholder={t("subscribers.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <NeonButton onClick={handleSearch}>
              {t("common.search")}
            </NeonButton>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <motion.div
                className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">
              {t("common.noResults")}
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NeonCard className="p-5" hoverable={false}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        {user.avatar ? (
                          <img
                            src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                            {user.username.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[var(--text-bright)]">
                            {user.username}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] font-mono">
                            {user.discordId}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {planBadge(user.subscription?.plan || "free")}

                        {activatingUser === user.id ? (
                          <AnimatePresence>
                            <motion.div
                              className="flex items-center gap-2"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <select
                                className="neon-input py-1 px-2 w-28"
                                value={selectedPlan}
                                onChange={(e) => setSelectedPlan(e.target.value)}
                              >
                                <option value="elite">Elite</option>
                                <option value="premium">Premium</option>
                                <option value="free">Free</option>
                              </select>
                              <NeonButton
                                size="sm"
                                onClick={() => handleActivate(user.id)}
                              >
                                {t("common.confirm")}
                              </NeonButton>
                              <NeonButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setActivatingUser(null)}
                              >
                                {t("common.cancel")}
                              </NeonButton>
                            </motion.div>
                          </AnimatePresence>
                        ) : (
                          <NeonButton
                            variant="outline"
                            size="sm"
                            onClick={() => setActivatingUser(user.id)}
                          >
                            {t("subscribers.manualActivate")}
                          </NeonButton>
                        )}
                      </div>
                    </div>
                  </NeonCard>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
