/**
 * content.ts - Single source of truth for ALL Hebrew copy (RTL).
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
    {
      label: "שירותים",
      href: "#services",
      menu: [
        { label: "סוכני AI קוליים", href: "#services" },
        { label: "אפליקציות ואתרים", href: "#services" },
        { label: "אוטומציות ואינטגרציות", href: "#services" },
        { label: "CRM ואוטומציית WhatsApp", href: "#services" },
      ],
    },
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
    "Clix בונה ומתפעלת מערכות AI מהונדסות, סוכנים קוליים, אוטומציות ומוצרים דיגיטליים שפותרים את האתגרים האמיתיים של העסק.",
  // Bottom-corner "discover" card (on.energy: the DISCOVER AI UPS card)
  discover: {
    eyebrow: "AI קולי",
    title: "סוכנים קוליים שמנהלים את כל השיחה, מקצה לקצה.",
    href: "#services",
  },
  scroll: "גלול",
  dragHint: "גררו כדי לסובב",
} as const;

// Full-bleed accent band right after the hero (on.energy's bold yellow statement).
export const valueProp = {
  body: "Clix בונה ומתפעלת מערכות AI מהונדסות שפותרות את האתגרים האמיתיים של העסק. מסוכנים קוליים ואוטומציות ועד אפליקציות ומערכות CRM, אנחנו מספקים פתרונות מותאמים אישית, מהונדסים לאמינות, למהירות ולצמיחה, שעובדים מהיום הראשון.",
} as const;

export const stack = {
  eyebrow: "הסטאק",
  index: "02",
  // Split headline: base (near-black) + accent (blue) — like the reference.
  title: "כל הכלים שאתם משתמשים בהם",
  titleAccent: "מזינים מוח אחד.",
  subtitle:
    "אנחנו מחברים את כל המערכות שלכם לליבה אחת חכמה, שמבינה הקשר ופועלת אוטומטית.",
  ctas: [
    { label: "בואו נתחיל", href: "#contact", primary: true },
    { label: "לכל היכולות שלנו", href: "#services", primary: false },
  ],
  // Tools Clix connects & automates. `tint` picks a pastel card color; `mono`
  // is the placeholder glyph until a real brand logo (/logos/*.svg) drops in.
  tools: [
    { name: "OpenAI", mono: "O", tint: "mint" },
    { name: "Claude", mono: "C", tint: "blush" },
    { name: "Gemini", mono: "G", tint: "sky" },
    { name: "Vapi", mono: "V", tint: "lavender" },
    { name: "n8n", mono: "n8n", tint: "blush" },
    { name: "Make", mono: "M", tint: "lavender" },
    { name: "WhatsApp", mono: "W", tint: "mint" },
    { name: "Google Calendar", mono: "31", tint: "sky" },
    { name: "monday.com", mono: "m", tint: "blush" },
    { name: "HubSpot", mono: "H", tint: "sky" },
  ],
} as const;

export const services = {
  eyebrow: "שירותים",
  title: "מה אנחנו בונים",
  intro:
    "אנחנו לא עוד סוכנות. אנחנו צוות הנדסה שהופך את החזון שלכם למערכת AI שעובדת, מהיום הראשון.",
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
      desc: "מוצרי Full-stack מהונדסים כמערכות, ממערכות CRM ופורטלי לקוחות ועד אפליקציות מובייל נייטיב ואתרים ייעודיים.",
      points: ["מערכות CRM", "פורטלי לקוחות", "iOS / Android", "אתרי תדמית"],
    },
    {
      index: "03",
      icon: "automation" as IconName,
      title: "אוטומציות ואינטגרציות",
      desc: "מחברים את הכלים שכבר יש לכם לזרימת עבודה אחת, עם Vapi, n8n, Make, OpenAI ו-Claude.",
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
  kicker: "Voice AI ברמת ייצור לצוותים מודרניים.",
  title: "סוכנים קוליים שמנהלים את כל השיחה.",
  body: "הסוכן עונה לשיחות נכנסות, מאמת לידים, קובע פגישות ומעביר שיחות לנציג אנושי כשצריך, בלי להחמיץ אף הזדמנות.",
  cta: { label: "בנו את הסוכן הקולי שלכם", href: "#contact" },
  points: [
    "מענה אנושי וטבעי בעברית",
    "אינטגרציה ישירה ל-CRM וליומן",
    "תמלול וסיכום אוטומטי של כל שיחה",
  ],
  // Labels for the phone-call demo mock.
  demo: {
    agent: "Clix · סוכן קולי",
    status: "שיחה נכנסת · הכשרת לידים",
    timer: "00:00",
    timerLabel: "משך השיחה",
    mute: "השתקה",
    badge: "Voice AI · הדגמה בזמן אמת",
    recommend: "מומלץ",
  },
  panelTitle: "לוח בקרה · חי",
  metrics: [
    { value: 1200, display: "1.2k", label: "שיחות שנסגרו" },
    { value: 842, suffix: "ms", label: "זמן תגובה p50" },
    { value: 99.9, suffix: "%", label: "זמינות" },
    { value: 24, prefix: "+", suffix: "%", label: "שיעור סגירה" },
  ],
} as const;

// "AI-as-a-Service" editorial band, modeled on the ZettaJoule / on.energy
// "24/7 Clean Energy as a Service" section: a light large statement heading +
// two supporting paragraphs + an arrow-box → pill CTA on the text side, and a
// big 3D isometric visual on the other side. RTL → the visual sits on the LEFT.
export const managedAI = {
  eyebrow: "AI as a Service",
  title: "בינה מלאכותית כשירות, מסביב לשעון.",
  body1:
    "אנחנו מספקים ללקוחות שלנו מגוון יתרונות תפעוליים ועסקיים, כולל האפשרות פשוט ליהנות מהתוצאות, בלי לנהל את המערכת בעצמכם.",
  body2:
    "בגישת ה-AI-as-a-Service, אנחנו בונים, מתפעלים ומתחזקים את מערכות הבינה שלכם, ומשחררים אתכם מכל המורכבות של הפעלת AI ברמת ייצור.",
  cta: { label: "דברו עם הצוות שלנו", href: "#contact" },
  // Looping 3D workflow-montage render (public/workflow-montage.mp4).
  video: { src: "/workflow-montage.mp4", alt: "מפת זרימת עבודה תלת-ממדית של מערכות Clix" },
} as const;

export const webMobile = {
  eyebrow: "Web + Mobile",
  title: "אפליקציות ואתרים, מהונדסים כמערכות",
  body: "ממערכות ניהול CRM ועד פורטלי לקוחות, מאפליקציות מובייל נייטיב ועד אתרים ייעודיים, אנחנו בונים מוצרים שמחזיקים בעומס ונראים מצוין.",
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
  subtitle: "מבחר מתוך מה שבנינו לאחרונה. (תצוגה לדוגמה, יוחלף בפרויקטים אמיתיים.)",
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
      desc: "מתכננים את המערכת הקומפקטית ביותר שפותרת את הבעיה הגדולה ביותר, לפי ROI, אבטחה ועמידוּת.",
    },
    {
      num: "03",
      title: "בנייה",
      desc: "מהנדסים בכירים משחררים גרסאות בקצב מהיר. מוצרים שמיש כל שבוע, לא מצגות.",
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
  body: "הרצאות, הדרכות וייעוץ לארגונים שרוצים לפעול עם AI, לא רק לדבר עליו. נשאיר את הצוות שלכם עם כלים שאפשר להפעיל כבר מחר בבוקר.",
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
  blurb: "סוכנות הנדסת AI שבונה מערכות שעובדות, מהונדסות לצמיחה.",
  socials: [
    { label: "Instagram", href: "https://instagram.com/clix_solution" },
    { label: "LinkedIn", href: "#" },
    { label: "WhatsApp", href: "#" },
  ],
  legal: ["מדיניות פרטיות", "תנאי שימוש", "הצהרת נגישות"],
  copyright: "© 2026 Clix Solutions. כל הזכויות שמורות.",
  backToTop: "חזרה למעלה",
} as const;
