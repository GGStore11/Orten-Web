export interface TemplateChannel {
  name: string;
  type: number; // 0=text, 2=voice, 4=category
  children?: TemplateChannel[];
}

export interface TemplateRole {
  name: string;
  color: number;
  permissions?: string;
}

export interface ServerTemplate {
  id: string;
  icon: string;
  channels: TemplateChannel[];
  roles: TemplateRole[];
}

export const TEMPLATES: Record<string, ServerTemplate> = {
  store: {
    id: "store",
    icon: "🛒",
    channels: [
      {
        name: "📢〡الإعلانات",
        type: 4,
        children: [
          { name: "📢〡إعلانات", type: 0 },
          { name: "🆕〡جديد", type: 0 },
          { name: "📋〡القوانين", type: 0 },
        ],
      },
      {
        name: "🛒〡المتجر",
        type: 4,
        children: [
          { name: "🛍️〡المنتجات", type: 0 },
          { name: "💰〡الأسعار", type: 0 },
          { name: "⭐〡التقييمات", type: 0 },
          { name: "🎫〡الطلبات", type: 0 },
        ],
      },
      {
        name: "💬〡التواصل",
        type: 4,
        children: [
          { name: "💬〡الدردشة-العامة", type: 0 },
          { name: "🎙️〡صوتي-عام", type: 2 },
        ],
      },
      {
        name: "📞〡الدعم",
        type: 4,
        children: [
          { name: "🎫〡فتح-تذكرة", type: 0 },
          { name: "❓〡أسئلة-شائعة", type: 0 },
        ],
      },
    ],
    roles: [
      { name: "مالك المتجر", color: 0xe74c3c },
      { name: "مشرف", color: 0x3498db },
      { name: "عميل VIP", color: 0xf1c40f },
      { name: "عميل", color: 0x95a5a6 },
    ],
  },
  gaming: {
    id: "gaming",
    icon: "🎮",
    channels: [
      {
        name: "📢〡الإعلانات",
        type: 4,
        children: [
          { name: "📢〡إعلانات", type: 0 },
          { name: "📋〡القوانين", type: 0 },
          { name: "🏆〡البطولات", type: 0 },
        ],
      },
      {
        name: "🎮〡الألعاب",
        type: 4,
        children: [
          { name: "🎮〡عام", type: 0 },
          { name: "🏅〡التصنيفات", type: 0 },
          { name: "👥〡البحث-عن-فريق", type: 0 },
          { name: "📊〡الإحصائيات", type: 0 },
        ],
      },
      {
        name: "🎙️〡الصوتيات",
        type: 4,
        children: [
          { name: "🎙️〡لوبي", type: 2 },
          { name: "🎮〡فريق-1", type: 2 },
          { name: "🎮〡فريق-2", type: 2 },
          { name: "🏆〡بطولة", type: 2 },
        ],
      },
      {
        name: "💬〡المجتمع",
        type: 4,
        children: [
          { name: "💬〡الدردشة-العامة", type: 0 },
          { name: "📸〡ميديا", type: 0 },
        ],
      },
    ],
    roles: [
      { name: "قائد", color: 0xe74c3c },
      { name: "بطل", color: 0xf39c12 },
      { name: "لاعب محترف", color: 0x9b59b6 },
      { name: "لاعب", color: 0x2ecc71 },
    ],
  },
  community: {
    id: "community",
    icon: "👥",
    channels: [
      {
        name: "📌〡المهم",
        type: 4,
        children: [
          { name: "📢〡إعلانات", type: 0 },
          { name: "📋〡القوانين", type: 0 },
          { name: "👋〡ترحيب", type: 0 },
          { name: "📊〡استطلاعات", type: 0 },
        ],
      },
      {
        name: "💬〡المناقشات",
        type: 4,
        children: [
          { name: "💬〡عام", type: 0 },
          { name: "🤖〡تقنية", type: 0 },
          { name: "🎨〡إبداعات", type: 0 },
          { name: "📚〡تعليم", type: 0 },
        ],
      },
      {
        name: "🎙️〡صوتيات",
        type: 4,
        children: [
          { name: "🎙️〡عام", type: 2 },
          { name: "🎵〡موسيقى", type: 2 },
          { name: "📖〡جلسة-نقاش", type: 2 },
        ],
      },
      {
        name: "🎉〡فعاليات",
        type: 4,
        children: [
          { name: "🎉〡فعاليات-قادمة", type: 0 },
          { name: "🎁〡مسابقات", type: 0 },
        ],
      },
    ],
    roles: [
      { name: "مؤسس", color: 0xe74c3c },
      { name: "إداري", color: 0x3498db },
      { name: "مشرف", color: 0x2ecc71 },
      { name: "عضو نشط", color: 0xf1c40f },
      { name: "عضو", color: 0x95a5a6 },
    ],
  },
  support: {
    id: "support",
    icon: "🎫",
    channels: [
      {
        name: "📌〡معلومات",
        type: 4,
        children: [
          { name: "📢〡إعلانات", type: 0 },
          { name: "📋〡القوانين", type: 0 },
          { name: "❓〡أسئلة-شائعة", type: 0 },
        ],
      },
      {
        name: "🎫〡الدعم",
        type: 4,
        children: [
          { name: "🎫〡فتح-تذكرة", type: 0 },
          { name: "📝〡دليل-الاستخدام", type: 0 },
          { name: "⚠️〡حالة-الخدمة", type: 0 },
        ],
      },
      {
        name: "💬〡المجتمع",
        type: 4,
        children: [
          { name: "💬〡عام", type: 0 },
          { name: "🎙️〡صوتي", type: 2 },
        ],
      },
    ],
    roles: [
      { name: "مدير الدعم", color: 0xe74c3c },
      { name: "فريق الدعم", color: 0x3498db },
      { name: "عميل مميز", color: 0xf1c40f },
    ],
  },
};
