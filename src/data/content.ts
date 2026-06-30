/**
 * content.ts — Single source of truth for ALL Hebrew copy (RTL).
 * Edit text here, never inline in components. (See CLAUDE.md conventions.)
 * Placeholder items are marked with `placeholder: true` where relevant.
 */

export type IconName =
  | "voice"
  | "code"
  | "automation"
  | "crm"
  | "spark"
  | "shield"
  | "bolt"
  | "chart";

export const brand = {
  name: "Clix",
  full: "Clix Solutions",
  tagline: "בינה מהונדסת לעסק שלכם",
  location: "תל אביב",
} as const;

export const nav = {
  items: [
    { label: "עבודות", href: "#work" },
    { label: "שירותים", href: "#services" },
    { label: "צרו קשר", href: "#contact" },
  ],
  cta: { label: "בואו נדבר", href: "#contact" },
  menuLabel: "תפריט",
} as const;

export const hero = {
  // The huge wordmark behind the render (SOHub: "sohub")
  wordmark: "clix",
  // Lower-start headline (SOHub: "Your story builds our history.")
  headline: "מערכות AI מהונדסות לעסק שלכם.",
  // Bottom-corner supporting line (on.energy: "ON.energy builds and operates…")
  subcopy:
    "Clix בונה ומתפעלת מערכות AI מהונדסות — סוכנים קוליים, אוטומציות ומוצרים דיגיטליים שפותרים את האתגרים האמיתיים של העסק.",
  // Bottom-corner "discover" card (on.energy: the DISCOVER AI UPS card)
  discover: {
    eyebrow: "Voice AI",
    title: "סוכנים קוליים שמנהלים את כל השיחה — מקצה לקצה.",
    href: "#services",
  },
  scroll: "גלול",
  dragHint: "גררו כדי לסובב",
} as const;

export const stack = {
  eyebrow: "הסטאק",
  title: "כל הכלים שאתם משתמשים בהם — מזינים מוח אחד",
  subtitle:
    "אנחנו מחברים את כל המערכות שלכם לליבה אחת חכמה, שמבינה הקשר ופועלת אוטומטית.",
  coreLabel: "Clix Core",
  coreSub: "מוח אחד",
  integrations: [
    "OpenAI",
    "Claude",
    "Gemini",
    "Vapi",
    "n8n",
    "Make",
    "WhatsApp",
    "Twilio",
    "HubSpot",
    "Slack",
    "Notion",
    "Zapier",
  ],
} as const;

export const services = {
  eyebrow: "שירותים",
  title: "מה אנחנו בונים",
  intro:
    "אנחנו לא עוד סוכנות. אנחנו צוות הנדסה שהופך את החזון שלכם למערכת AI שעובדת — מהיום הראשון.",
  subtitle: "תוכנה שעובדת, תוצאות שמדברות.",
  items: [
    {
      index: "01",
      icon: "voice" as IconName,
      title: "סוכני AI קוליים",
      desc: "Voice AI ברמת ייצור: עונה לשיחות נכנסות, מאמת לידים, קובע פגישות ומעביר לנציג אנושי בדיוק כשצריך.",
      points: ["מענה 24/7", "אימות לידים", "קביעת פגישות", "העברה חכמה"],
    },
    {
      index: "02",
      icon: "code" as IconName,
      title: "אפליקציות ואתרים",
      desc: "מוצרי Full-stack מהונדסים כמערכות — ממערכות CRM ופורטלי לקוחות ועד אפליקציות מובייל נייטיב ואתרים ייעודיים.",
      points: ["מערכות CRM", "פורטלי לקוחות", "iOS / Android", "אתרי תדמית"],
    },
    {
      index: "03",
      icon: "automation" as IconName,
      title: "אוטומציות ואינטגרציות",
      desc: "מחברים את הכלים שכבר יש לכם לזרימת עבודה אחת — עם Vapi, n8n, Make, OpenAI ו-Claude.",
      points: ["זרימות עבודה", "אינטגרציות API", "סנכרון נתונים", "ניטור חכם"],
    },
    {
      index: "04",
      icon: "crm" as IconName,
      title: "CRM ואוטומציית WhatsApp",
      desc: "אוטומציות WhatsApp ומערכות CRM מותאמות אישית שמלוות את הלקוח מהליד הראשון ועד הסגירה.",
      points: ["WhatsApp Business", "ניהול לידים", "פולו-אפ אוטומטי", "דשבורד מכירות"],
    },
  ],
} as const;

export const voiceAI = {
  eyebrow: "Voice AI",
  title: "סוכנים קוליים שמנהלים את כל השיחה",
  body: "Voice AI ברמת ייצור לצוותים מודרניים. הסוכן עונה לשיחות נכנסות, מאמת לידים, קובע פגישות ומעביר שיחות לנציג אנושי כשצריך — בלי להחמיץ אף הזדמנות.",
  points: [
    "מענה אנושי וטבעי בעברית",
    "אינטגרציה ישירה ל-CRM וליומן",
    "תמלול וסיכום אוטומטי של כל שיחה",
  ],
  panelTitle: "לוח בקרה · חי",
  metrics: [
    { value: 1200, display: "1.2k", label: "שיחות שנסגרו" },
    { value: 842, suffix: "ms", label: "זמן תגובה p50" },
    { value: 99.9, suffix: "%", label: "זמינות" },
    { value: 24, prefix: "+", suffix: "%", label: "שיעור סגירה" },
  ],
} as const;

export const webMobile = {
  eyebrow: "Web + Mobile",
  title: "אפליקציות ואתרים, מהונדסים כמערכות",
  body: "ממערכות ניהול CRM ועד פורטלי לקוחות, מאפליקציות מובייל נייטיב ועד אתרים ייעודיים — אנחנו בונים מוצרים שמחזיקים בעומס ונראים מצוין.",
  points: [
    { title: "מערכות CRM", desc: "פלטפורמות ניהול מותאמות לתהליך שלכם" },
    { title: "פורטלי לקוחות", desc: "חוויית לקוח מאובטחת ומהירה" },
    { title: "מובייל נייטיב", desc: "אפליקציות iOS ו-Android" },
    { title: "אתרים ייעודיים", desc: "אתרים מהירים שממירים" },
  ],
} as const;

export const work = {
  eyebrow: "עבודות",
  title: "הופכים רעיונות למציאות דיגיטלית",
  subtitle: "מבחר מתוך מה שבנינו לאחרונה. (תצוגה לדוגמה — יוחלף בפרויקטים אמיתיים.)",
  projects: [
    { title: "SalesIQ", category: "פלטפורמת מכירות + Voice AI", year: "2026", placeholder: true },
    { title: "סטודיו אדיר", category: "אתר תדמית + הזמנות אונליין", year: "2025", placeholder: true },
    { title: "Nevo Capital", category: "פורטל לקוחות + דשבורד", year: "2025", placeholder: true },
    { title: "Tubi Invest", category: "אוטומציית WhatsApp + CRM", year: "2026", placeholder: true },
  ],
} as const;

export const methodology = {
  eyebrow: "מתודולוגיה",
  title: "מהירות של מעבדה. משמעת של מפעל.",
  steps: [
    {
      num: "01",
      title: "אבחון",
      desc: "נפגשים עם הצוות שלכם, ממפים את המערכות הקיימות ומזהים איפה AI יוצר ערך עסקי אמיתי.",
    },
    {
      num: "02",
      title: "תכנון",
      desc: "מתכננים את המערכת הקומפקטית ביותר שפותרת את הבעיה הגדולה ביותר — לפי ROI, אבטחה ועמידוּת.",
    },
    {
      num: "03",
      title: "בנייה",
      desc: "מהנדסים בכירים משחררים גרסאות בקצב מהיר. מוצרים שמיש כל שבוע — לא מצגות.",
    },
    {
      num: "04",
      title: "הפעלה",
      desc: "מנטרים את המערכת, משפרים אותה ומכשירים את הצוות שלכם לתפעול עצמאי. שליטה מלאה, בלי תלות.",
    },
  ],
} as const;

export const testimonials = {
  eyebrow: "המלצות",
  title: "שמעו את זה ישירות מהאנשים שהעבודה שלהם השתנתה",
  items: [
    {
      quote:
        "הסוכן הקולי של Clix עונה לכל שיחה ומסנן לידים עוד לפני שאני מרים טלפון. סגרנו יותר עסקאות בפחות זמן.",
      name: "אסף פרץ",
      role: "מייסד, SalesIQ",
    },
    {
      quote:
        "בנו לי אתר ומערכת הזמנות שעובדים מושלם. כל הלקוחות מגיעים דרך WhatsApp באופן אוטומטי.",
      name: "אדיר פרץ",
      role: "בעלים, סטודיו צילום ווידאו",
    },
    {
      quote:
        "המקצועיות והמהירות מטורפות. תוך שבועות היה לנו מוצר עובד, לא מצגת יפה.",
      name: "נבו יהלומן",
      role: "מייסד",
    },
    {
      quote:
        "האוטומציות חסכו לנו שעות עבודה כל יום. הצוות של Clix פשוט מבין עסקים.",
      name: "נועם תובי",
      role: "בעלים, השקעות",
    },
  ],
} as const;

export const training = {
  eyebrow: "הרצאות והדרכות",
  title: "מביאים את צוות המומחים אל החדר שלכם",
  body: "הרצאות, הדרכות וייעוץ לארגונים שרוצים לפעול עם AI — לא רק לדבר עליו. נשאיר את הצוות שלכם עם כלים שאפשר להפעיל כבר מחר בבוקר.",
  points: ["הרצאות והכשרות", "ייעוץ אסטרטגי", "ליווי יישום בארגון"],
} as const;

export const cta = {
  title: "בואו נבנה משהו",
  subtitle: "אתם מביאים את העסק. אנחנו מביאים את הבינה.",
  buttons: [
    { label: "דברו איתנו", href: "#contact", primary: true },
    { label: "קביעת פגישה", href: `mailto:info@clixsolution.com`, primary: false },
  ],
} as const;

export const contact = {
  eyebrow: "צרו קשר",
  email: "info@clixsolution.com",
  locationLine: "תל אביב · שירות גלובלי",
  hours: "א׳–ה׳ · 09:00–18:00",
  instagramHandle: "@clix_solution",
  instagramUrl: "https://instagram.com/clix_solution",
} as const;

export const footer = {
  blurb: "סוכנות הנדסת AI שבונה מערכות שעובדות — מהונדסות לצמיחה.",
  socials: [
    { label: "Instagram", href: "https://instagram.com/clix_solution" },
    { label: "LinkedIn", href: "#" },
    { label: "WhatsApp", href: "#" },
  ],
  legal: ["מדיניות פרטיות", "תנאי שימוש", "הצהרת נגישות"],
  copyright: "© 2026 Clix Solutions. כל הזכויות שמורות.",
  backToTop: "חזרה למעלה",
} as const;
