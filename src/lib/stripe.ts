import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
});

export const PLANS = {
  free: {
    name: { en: "Free", ar: "مجاني" },
    price: 0,
    features: {
      en: ["Basic templates", "2 plugins", "Standard support"],
      ar: ["قوالب أساسية", "إضافتان", "دعم عادي"],
    },
  },
  elite: {
    name: { en: "Elite", ar: "إيليت" },
    price: 9.99,
    stripePriceId: process.env.STRIPE_ELITE_PRICE_ID,
    features: {
      en: ["All templates", "All plugins", "Priority support", "Custom fonts"],
      ar: ["جميع القوالب", "جميع الإضافات", "دعم أولوية", "خطوط مخصصة"],
    },
  },
  premium: {
    name: { en: "Premium", ar: "بريميوم" },
    price: 19.99,
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: {
      en: [
        "All Elite features",
        "White-label branding",
        "Custom bot name & avatar",
        "24/7 support",
      ],
      ar: [
        "جميع مميزات إيليت",
        "هوية مخصصة (White-label)",
        "تغيير اسم وصورة البوت",
        "دعم على مدار الساعة",
      ],
    },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
