"use client";

import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
}

export default function PromoCodesPage() {
  const { t } = useI18n();
  const { data: session } = useSession();
  

  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    maxUses: "",
    expiresAt: "",
  });

  const sidebarItems = [
    { label: t("adminPanel.title"), href: "/admin", icon: "🏠" },
    { label: t("adminPanel.promoCodes"), href: "/admin/promo-codes", icon: "🎟️" },
    { label: t("adminPanel.subscribers"), href: "/admin/subscribers", icon: "👥" },
  ];

  const fetchCodes = () => {
    fetch("/api/admin/promo-codes")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCodes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(fetchCodes, []);

  const handleCreate = async () => {
    const res = await fetch("/api/admin/promo-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ code: "", discount: "", maxUses: "", expiresAt: "" });
      setShowForm(false);
      fetchCodes();
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    await fetch("/api/admin/promo-codes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    fetchCodes();
  };

  const deleteCode = async (id: string) => {
    await fetch(`/api/admin/promo-codes?id=${id}`, { method: "DELETE" });
    fetchCodes();
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
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-bright)]">
                {t("promo.title")}
              </h1>
            </div>
            <NeonButton onClick={() => setShowForm(!showForm)}>
              {showForm ? t("common.cancel") : t("promo.createCode")}
            </NeonButton>
          </motion.div>

          {/* Create Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <NeonCard className="p-6" hoverable={false}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm mb-2 text-[var(--text-muted)]">
                        {t("promo.codeName")}
                      </label>
                      <input
                        type="text"
                        className="neon-input"
                        placeholder="ORTEN50"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-[var(--text-muted)]">
                        {t("promo.discount")}
                      </label>
                      <input
                        type="number"
                        className="neon-input"
                        placeholder="50"
                        min="1"
                        max="100"
                        value={formData.discount}
                        onChange={(e) =>
                          setFormData({ ...formData, discount: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-[var(--text-muted)]">
                        {t("promo.maxUses")}
                      </label>
                      <input
                        type="number"
                        className="neon-input"
                        placeholder="0"
                        min="0"
                        value={formData.maxUses}
                        onChange={(e) =>
                          setFormData({ ...formData, maxUses: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-[var(--text-muted)]">
                        {t("promo.expiresAt")}
                      </label>
                      <input
                        type="datetime-local"
                        className="neon-input"
                        value={formData.expiresAt}
                        onChange={(e) =>
                          setFormData({ ...formData, expiresAt: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <NeonButton onClick={handleCreate}>
                    {t("common.create")}
                  </NeonButton>
                </NeonCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Codes List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <motion.div
                className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : codes.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">
              {t("common.noResults")}
            </div>
          ) : (
            <div className="space-y-3">
              {codes.map((code, i) => (
                <motion.div
                  key={code.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NeonCard className="p-5" hoverable={false}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-6">
                        <div>
                          <span className="font-mono text-lg font-bold neon-text">
                            {code.code}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-[var(--text-muted)]">
                            {t("promo.discount")}:{" "}
                          </span>
                          <span className="text-[var(--accent)] font-bold">
                            {code.discount}%
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-[var(--text-muted)]">
                            {t("promo.used")}:{" "}
                          </span>
                          <span>
                            {code.usedCount}
                            {code.maxUses > 0 ? ` / ${code.maxUses}` : ""}
                          </span>
                        </div>
                        {code.expiresAt && (
                          <div className="text-sm text-[var(--text-muted)]">
                            {new Date(code.expiresAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <NeonButton
                          variant={code.active ? "outline" : "primary"}
                          size="sm"
                          onClick={() => toggleActive(code.id, !code.active)}
                        >
                          {code.active ? t("promo.active") : t("promo.inactive")}
                        </NeonButton>
                        <NeonButton
                          variant="danger"
                          size="sm"
                          onClick={() => deleteCode(code.id)}
                        >
                          {t("common.delete")}
                        </NeonButton>
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
