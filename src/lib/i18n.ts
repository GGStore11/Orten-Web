"use client";

import { createContext, useContext } from "react";

export type Locale = "ar" | "en";

export interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

export const I18nContext = createContext<I18nContextType>({
  locale: "ar",
  setLocale: () => {},
  t: (key: string) => key,
  dir: "rtl",
});

export const useI18n = () => useContext(I18nContext);

type NestedRecord = { [key: string]: string | NestedRecord };

export const translations: Record<Locale, NestedRecord> = {
  ar: {
    common: {
      login: "تسجيل الدخول عبر Discord",
      logout: "تسجيل الخروج",
      dashboard: "لوحة التحكم",
      admin: "لوحة الإدارة",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      create: "إنشاء",
      search: "بحث",
      loading: "جاري التحميل...",
      noResults: "لا توجد نتائج",
      success: "تم بنجاح",
      error: "حدث خطأ",
      confirm: "تأكيد",
      back: "رجوع",
      next: "التالي",
      enabled: "مفعّل",
      disabled: "معطّل",
    },
    landing: {
      title: "Orten",
      subtitle: "منصة إدارة سيرفرات Discord الاحترافية",
      description: "أدر سيرفرك بضغطة زر واحدة مع قوالب جاهزة وإضافات متقدمة",
      cta: "ابدأ الآن",
      features: "المميزات",
      pricing: "الأسعار",
      feature1Title: "قوالب جاهزة",
      feature1Desc: "طبّق هيكلة جاهزة لسيرفرك بضغطة واحدة",
      feature2Title: "إضافات متقدمة",
      feature2Desc: "نظام تذاكر، لفل، حماية، ودعوات",
      feature3Title: "تخصيص كامل",
      feature3Desc: "غيّر هوية البوت وزخرفة أسماء الرومات",
    },
    auth: {
      loginTitle: "مرحباً بك في Orten",
      loginSubtitle: "سجّل دخولك عبر Discord للبدء",
      connectAccount: "ربط الحساب",
    },
    servers: {
      title: "سيرفراتك",
      subtitle: "اختر السيرفر الذي تريد إدارته",
      addBot: "إضافة البوت",
      openDashboard: "لوحة التحكم",
      noServers: "لا توجد سيرفرات بصلاحيات إدارية",
      botStatus: "حالة البوت",
      botActive: "البوت موجود",
      botInactive: "البوت غير موجود",
    },
    dashboard: {
      templates: "القوالب",
      plugins: "الإضافات",
      branding: "التخصيص",
      overview: "نظرة عامة",
    },
    templates: {
      title: "القوالب الجاهزة",
      subtitle: "اختر قالباً لتطبيقه على سيرفرك",
      apply: "تطبيق القالب",
      warning: "سيتم مسح الرومات القديمة وإنشاء هيكلة جديدة",
      store: "متجر",
      storeDesc: "هيكلة متجر احترافية مع قنوات للمنتجات والطلبات والدعم",
      gaming: "ألعاب",
      gamingDesc: "سيرفر ألعاب مع قنوات للفرق والبطولات والتصنيفات",
      community: "مجتمع",
      communityDesc: "مجتمع متكامل مع قنوات للمناقشات والإعلانات والفعاليات",
      support: "دعم فني",
      supportDesc: "سيرفر دعم فني مع نظام تذاكر وقنوات مساعدة",
    },
    plugins: {
      title: "الإضافات",
      subtitle: "فعّل أو عطّل الإضافات حسب حاجتك",
      tickets: "نظام التذاكر",
      ticketsDesc: "نظام تذاكر دعم متكامل مع تصنيفات وأرشيف",
      levels: "نظام اللفل",
      levelsDesc: "نظام مستويات مع رتب تلقائية ولوحة متصدرين",
      protection: "نظام الحماية",
      protectionDesc: "حماية من السبام والريد مع فلاتر ذكية",
      invites: "نظام الدعوات",
      invitesDesc: "تتبع الدعوات مع مكافآت ولوحة إحصائيات",
    },
    branding: {
      title: "التخصيص",
      subtitle: "خصّص هوية البوت الخاص بك",
      botName: "اسم البوت",
      botAvatar: "صورة البوت",
      nameStyle: "تنسيق الأسماء",
      uploadAvatar: "رفع صورة",
      premiumOnly: "متاح للمشتركين فقط",
      nameStyles: {
        default: "افتراضي",
        fancy: "مزخرف",
        bold: "عريض",
        italic: "مائل",
        mono: "أحادي",
      },
    },
    adminPanel: {
      title: "لوحة الإدارة",
      promoCodes: "أكواد الخصم",
      subscribers: "المشتركين",
    },
    promo: {
      title: "إدارة أكواد الخصم",
      createCode: "إنشاء كود جديد",
      codeName: "اسم الكود",
      discount: "نسبة الخصم (%)",
      maxUses: "عدد مرات الاستخدام (0 = غير محدود)",
      expiresAt: "تاريخ الانتهاء",
      used: "مرات الاستخدام",
      status: "الحالة",
      active: "فعّال",
      inactive: "معطّل",
    },
    subscribers: {
      title: "إدارة المشتركين",
      searchPlaceholder: "بحث بـ Discord ID...",
      discordId: "Discord ID",
      username: "اسم المستخدم",
      plan: "الباقة",
      status: "الحالة",
      manualActivate: "تفعيل يدوي",
      selectPlan: "اختر الباقة",
    },
  },
  en: {
    common: {
      login: "Login with Discord",
      logout: "Logout",
      dashboard: "Dashboard",
      admin: "Admin Panel",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      search: "Search",
      loading: "Loading...",
      noResults: "No results",
      success: "Success",
      error: "An error occurred",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      enabled: "Enabled",
      disabled: "Disabled",
    },
    landing: {
      title: "Orten",
      subtitle: "Professional Discord Server Management Platform",
      description:
        "Manage your server with one click using ready-made templates and advanced plugins",
      cta: "Get Started",
      features: "Features",
      pricing: "Pricing",
      feature1Title: "Ready Templates",
      feature1Desc: "Apply ready-made structures to your server with one click",
      feature2Title: "Advanced Plugins",
      feature2Desc: "Tickets, levels, protection, and invite systems",
      feature3Title: "Full Customization",
      feature3Desc: "Change bot identity and channel name decorations",
    },
    auth: {
      loginTitle: "Welcome to Orten",
      loginSubtitle: "Login with Discord to get started",
      connectAccount: "Connect Account",
    },
    servers: {
      title: "Your Servers",
      subtitle: "Select a server to manage",
      addBot: "Add Bot",
      openDashboard: "Dashboard",
      noServers: "No servers with admin permissions",
      botStatus: "Bot Status",
      botActive: "Bot Active",
      botInactive: "Bot Inactive",
    },
    dashboard: {
      templates: "Templates",
      plugins: "Plugins",
      branding: "Branding",
      overview: "Overview",
    },
    templates: {
      title: "Ready Templates",
      subtitle: "Choose a template to apply to your server",
      apply: "Apply Template",
      warning: "This will delete existing channels and create a new structure",
      store: "Store",
      storeDesc: "Professional store structure with product, order, and support channels",
      gaming: "Gaming",
      gamingDesc: "Gaming server with team, tournament, and ranking channels",
      community: "Community",
      communityDesc: "Full community with discussion, announcement, and event channels",
      support: "Support",
      supportDesc: "Support server with ticket system and help channels",
    },
    plugins: {
      title: "Plugins",
      subtitle: "Enable or disable plugins as needed",
      tickets: "Ticket System",
      ticketsDesc: "Full support ticket system with categories and archive",
      levels: "Level System",
      levelsDesc: "Level system with auto-roles and leaderboard",
      protection: "Protection System",
      protectionDesc: "Anti-spam and anti-raid protection with smart filters",
      invites: "Invite System",
      invitesDesc: "Invite tracking with rewards and statistics dashboard",
    },
    branding: {
      title: "Branding",
      subtitle: "Customize your bot identity",
      botName: "Bot Name",
      botAvatar: "Bot Avatar",
      nameStyle: "Name Style",
      uploadAvatar: "Upload Avatar",
      premiumOnly: "Premium subscribers only",
      nameStyles: {
        default: "Default",
        fancy: "Fancy",
        bold: "Bold",
        italic: "Italic",
        mono: "Monospace",
      },
    },
    adminPanel: {
      title: "Admin Panel",
      promoCodes: "Promo Codes",
      subscribers: "Subscribers",
    },
    promo: {
      title: "Manage Promo Codes",
      createCode: "Create New Code",
      codeName: "Code Name",
      discount: "Discount (%)",
      maxUses: "Max Uses (0 = unlimited)",
      expiresAt: "Expiry Date",
      used: "Times Used",
      status: "Status",
      active: "Active",
      inactive: "Inactive",
    },
    subscribers: {
      title: "Manage Subscribers",
      searchPlaceholder: "Search by Discord ID...",
      discordId: "Discord ID",
      username: "Username",
      plan: "Plan",
      status: "Status",
      manualActivate: "Manual Activate",
      selectPlan: "Select Plan",
    },
  },
};

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".");
  let result: string | NestedRecord = translations[locale];
  for (const k of keys) {
    if (typeof result === "object" && result !== null && k in result) {
      result = result[k];
    } else {
      return key;
    }
  }
  return typeof result === "string" ? result : key;
}
