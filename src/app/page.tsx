"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import { useRouter } from "next/navigation";
import { PLANS } from "@/lib/stripe";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";

export default function LandingPage() {
  const { t, locale } = useI18n();
  const { data: session } = useSession();
  const router = useRouter();

  const handleCTA = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      signIn("discord");
    }
  };

  const features = [
    { icon: "🎨", title: t("landing.feature1Title"), desc: t("landing.feature1Desc") },
    { icon: "⚡", title: t("landing.feature2Title"), desc: t("landing.feature2Desc") },
    { icon: "🛡️", title: t("landing.feature3Title"), desc: t("landing.feature3Desc") },
  ];

  return (
    <div className="min-h-screen">
      <Navbar
        user={session?.user}
        isAdmin={session?.isAdmin}
        onLogout={() => signIn("discord")}
      />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] opacity-5 blur-[100px]"
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            style={{ top: "10%", left: "20%" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent)] opacity-5 blur-[100px]"
            animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            style={{ bottom: "10%", right: "20%" }}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-black mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent-pink)] bg-clip-text text-transparent">
                {t("landing.title")}
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-[var(--text-muted)] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t("landing.subtitle")}
            </motion.p>

            <motion.p
              className="text-base text-[var(--text-muted)] mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t("landing.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <NeonButton size="lg" onClick={handleCTA}>
                {t("landing.cta")}
              </NeonButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 neon-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t("landing.features")}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <NeonCard className="p-8 text-center h-full">
                  <div className="text-5xl mb-6">{feat.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-[var(--text-bright)]">
                    {feat.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </NeonCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6" id="pricing">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 neon-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t("landing.pricing")}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(
              ([key, plan], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <NeonCard
                    className={`p-8 text-center h-full flex flex-col ${
                      key === "premium"
                        ? "border-[var(--accent)] shadow-[var(--neon-glow)]"
                        : ""
                    }`}
                  >
                    <h3 className="text-2xl font-bold mb-2 text-[var(--text-bright)]">
                      {plan.name[locale]}
                    </h3>
                    <div className="text-4xl font-black mb-6 neon-text">
                      {plan.price === 0 ? (
                        locale === "ar" ? "مجاني" : "Free"
                      ) : (
                        <>
                          ${plan.price}
                          <span className="text-sm text-[var(--text-muted)]">
                            /{locale === "ar" ? "شهر" : "mo"}
                          </span>
                        </>
                      )}
                    </div>
                    <ul className="flex-1 mb-8 space-y-3">
                      {plan.features[locale].map((feat: string, fi: number) => (
                        <li
                          key={fi}
                          className="flex items-center gap-2 text-sm text-[var(--text-muted)]"
                        >
                          <span className="text-[var(--accent)]">✓</span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <NeonButton
                      variant={key === "premium" ? "primary" : "outline"}
                      onClick={handleCTA}
                      className="w-full"
                    >
                      {t("landing.cta")}
                    </NeonButton>
                  </NeonCard>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-[var(--text-muted)] text-sm">
          <p>© 2024 Orten. {locale === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
}
