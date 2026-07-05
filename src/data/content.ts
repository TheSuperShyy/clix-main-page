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

// Ref navbar skeleton: Solutions · Features · Services · Pricing · CTA —
// plain links (no dropdowns), labels mirror the section eyebrows below.
export const nav = {
  items: [
    { label: "פתרונות", href: "#solutions" },
    { label: "יכולות", href: "#features" },
    { label: "שירותים", href: "#services" },
    { label: "הרצאות", href: "#training" },
  ],
  cta: { label: "בואו נדבר", href: "#contact" },
  menuLabel: "תפריט",
} as const;

export const hero = {
  // Full accessible sentence — used as the h1 aria-label / for SEO.
  headline: "מערכות AI מהונדסות לעסק שלכם.",
  // Visual display lines — the big bottom-start headline (ref: "The future of /
  // AI Finance."), rendered in pure white to match the reference.
  headlineLines: ["מערכות AI מהונדסות", "לעסק שלכם."],
  // Small tagline under the headline (ref: "Banking of Tomorrow.").
  tagline: "העסק של מחר, כבר היום.",
  // Short supporting paragraph in the bottom-end corner (ref: the lead sentence).
  subcopy:
    "אנחנו מתמחים בהנדסת מערכות AI שמשנות את הדרך שבה העסק שלכם פועל ומקבל החלטות.",
  // Bottom-end action cluster: white primary pill + dark ghost (ref: "Sign Up" /
  // "Discover More").
  ctas: [
    { label: "בואו נדבר", href: "#contact", primary: true },
    { label: "גלו עוד", href: "#services", primary: false },
  ],
} as const;

// Solutions — the floating glass panel that slides in over the hero's scrubbed
// scene (ref: SOLUTIONS · "Revolutionize your financial workflows." + the
// dashboard mock). Clix mapping: our AI solutions overview + an ops dashboard.
export const solutions = {
  eyebrow: "פתרונות",
  // Full sentence for a11y; visual two-line lockup below.
  title: "מהפכה בתהליכי העבודה שלכם.",
  titleLines: ["מהפכה בתהליכי", "העבודה שלכם."],
  body: "פתרונות ה-AI שלנו הופכים תהליכים עסקיים מורכבים לאוטומטיים, מצמצמים טעויות ידניות ומחדדים את קבלת ההחלטות בכל הארגון.",
  ctas: [
    { label: "בואו נתחיל", href: "#contact", primary: true },
    { label: "צפו בדמו", href: "#work", primary: false },
  ],
  // Hebrew UI strings for the placeholder ops dashboard (swappable mock —
  // don't hardwire real data; ref: the trading "Main Dashboard").
  dashboard: {
    breadcrumb: "סוכני AI / לוח בקרה",
    title: "לוח בקרה ראשי",
    searchPlaceholder: "חיפוש",
    nav: [
      { label: "לוח בקרה", active: true },
      { label: "שיחות", active: false },
      { label: "לידים", active: false, badge: "חדש" },
      { label: "אוטומציות", active: false },
    ],
    navSecondary: ["פרופיל", "הגדרות", "תמיכה"],
    unlock: "שדרוג ל-Clix Pro",
    kpi: {
      label: "שיחות שטופלו",
      value: "22,193",
      delta: "+47.3%",
      // Range pills, active last (ref: 1D · 7D · 1M · [1Y]).
      ranges: ["יום", "שבוע", "חודש", "שנה"],
    },
    quick: {
      title: "מבט מהיר",
      rows: [
        { value: "181", label: "לידים חדשים השבוע" },
        { value: "64", label: "פגישות שנקבעו" },
      ],
      cta: "צפו בפירוט",
    },
    channels: {
      title: "ערוצים",
      cols: ["ערוץ", "שיחות", "המרה", "מגמה"],
      rows: [
        { name: "סוכן קולי", calls: "12,634", conv: "38%", delta: "+13,581", up: true },
        { name: "וואטסאפ", calls: "7,319", conv: "24%", delta: "+2,716", up: true },
        { name: "אתר", calls: "2,240", conv: "9%", delta: "-500", up: false },
      ],
    },
    repartition: {
      title: "התפלגות",
      legend: ["סוכן קולי", "וואטסאפ", "אתר"],
    },
    // Faded, clipped teaser row at the panel base (ref: Recent transactions /
    // Market / Articles peeking out).
    ghostRow: ["פעילות אחרונה", "תובנות", "מאמרים"],
  },
} as const;

// Partners logo strip — floats over the hero's scrubbed scene after Solutions
// (ref: OUR PARTNERS · "Trusted by leading financial institutions." + a row of
// glass logo tiles). Clix mapping: the platforms we build on and connect to.
export const partners = {
  eyebrow: "השותפים שלנו",
  // Full sentence for a11y; visual two-line lockup below.
  title: "עובדים עם הטכנולוגיות המובילות בעולם.",
  titleLines: ["עובדים עם הטכנולוגיות", "המובילות בעולם."],
  // Rendered via <BrandMark> (simple-icons; wordmark fallback for OpenAI/Vapi).
  logos: ["OpenAI", "Claude", "Gemini", "Vapi", "n8n", "Make", "WhatsApp", "HubSpot"],
} as const;

// Features — the solid dark section right after the hero scene region (ref:
// FEATURES · "The future of finance is here." + 3 cards, each a glass panel
// with a rendered globe image, a title and a one-line description). Clix
// mapping: the three core capabilities. Card art is a procedural placeholder
// (swap for real renders later).
export const features = {
  eyebrow: "יכולות",
  // Full sentence for a11y; visual two-line lockup below.
  title: "העתיד של העסק שלכם כבר כאן.",
  titleLines: ["העתיד של העסק שלכם", "כבר כאן."],
  subcopy: "אנחנו מספקים כלי AI מתקדמים שמייעלים את הביצועים של העסק שלכם.",
  // Card art = client-supplied globe renders (uploaded as feature-1/2/3.png,
  // mapped to the cards in numerical order; optimized webp copies live in
  // /public/features, raw PNGs parked in gitignored /assets-src/features).
  items: [
    {
      title: "סוכנים קוליים חכמים",
      desc: "מענה אנושי לכל שיחה, 24/7.",
      img: "/features/feature-1.webp",
    },
    {
      title: "אוטומציות חכמות",
      desc: "תהליכים שרצים מעצמם, בלי טעויות.",
      img: "/features/feature-2.webp",
    },
    {
      title: "תובנות בזמן אמת",
      desc: "החלטות מבוססות נתונים, בכל רגע.",
      img: "/features/feature-3.webp",
    },
  ],
} as const;

// Key Features — the numbered 01–03 sequence after Features (ref: "ABOUT OUR
// SOLUTIONS · Key Features" header, then three ~70vh alternating rows — text
// beside a large numbered image — each with its own eyebrow, statement
// headline, body and a small dark CTA). Clix mapping: each row goes one level
// deeper into a core capability. Row art is a procedural placeholder (swap
// for real renders later).
export const keyFeatures = {
  eyebrow: "על הפתרונות שלנו",
  title: "יכולות מרכזיות",
  subcopy: "הצצה ליכולות הליבה שמניעות את הצמיחה והיעילות של העסק שלכם.",
  // Row art = client-supplied renders (uploaded as solution-1/2/3.png, mapped
  // to rows 01–03 in numerical order; webp copies in /public/key-features, raw
  // PNGs parked in gitignored /assets-src/key-features). The baked-in corner
  // numbers were cropped out of the assets — the component's own 01/02/03
  // overlay does the numbering (RTL-correct at every viewport).
  items: [
    {
      eyebrow: "יכולת 1",
      title: "סוכן קולי שלא מפספס שיחה.",
      body: "סוכן AI קולי שעונה בעברית טבעית, מתאם פגישות ומטפל בלקוחות — בכל שעה, גם כשאתם עסוקים.",
      number: "01",
      img: "/key-features/solution-1.webp",
    },
    {
      eyebrow: "יכולת 2",
      title: "אוטומציה שמריצה את העסק.",
      body: "תהליכים שלמים — ממעקב לידים ועד חשבוניות — רצים מעצמם, מסונכרנים בין כל המערכות שלכם.",
      number: "02",
      img: "/key-features/solution-2.webp",
    },
    {
      eyebrow: "יכולת 3",
      title: "תובנות שמניעות החלטות.",
      body: "כל הנתונים של העסק במקום אחד, מנותחים בזמן אמת — כדי שתדעו בדיוק מה עובד ומה הצעד הבא.",
      number: "03",
      img: "/key-features/solution-3.webp",
    },
  ],
  cta: { label: "בואו נדבר", href: "#contact" },
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
  // Second paragraph for the static integration-showcase band (reference-style).
  body:
    "כל כלי מדבר עם האחרים דרך שכבת אוטומציה אחת — בלי העברות ידניות ובלי מידע שהולך לאיבוד. הליבה מבינה הקשר, מקבלת החלטות בזמן אמת, ומתעדכנת מעצמה ככל שהעסק גדל.",
  // --- "One brain" orbit (Integrations section) — repositioned as the SERVICES
  //     INTRO for #services. Self-contained copy: it renders `kicker` + the intro*
  //     fields below, NOT the shared `title`/`subtitle` (those stay ZoomReveal's,
  //     and `title`/`titleAccent` are also read by the parked Stack/ScrollReveal).
  // Small-caps kicker above the heading on the light orbit band.
  kicker: "השירותים שלנו · ליבה אחת",
  // Split headline (base near-black + gradient accent) + lead. The subtitle
  // previews the four service categories that orbit the core — the same four as
  // the `pillars` ring and the Services section — so the band reads as the lead-in.
  introTitle: "כל היכולות שהעסק שלכם צריך,",
  introTitleAccent: "מהונדסות לליבה אחת.",
  introSubtitle:
    "סוכנים קוליים, אפליקציות ואתרים, אוטומציות ומערכות CRM — אנחנו מהנדסים את כל השירותים סביב ליבת AI אחת, שמבינה הקשר ופועלת אוטומטית.",
  // The four capability pillars that orbit the central "one brain" core
  // (the CyberCrest orbit-label analog). Short labels so the ring nodes stay tidy.
  pillars: [
    { label: "סוכנים קוליים", icon: "voice" },
    { label: "אפליקציות ואתרים", icon: "code" },
    { label: "אוטומציות", icon: "automation" },
    { label: "CRM ו-WhatsApp", icon: "crm" },
  ],
  // Lead for the platform credential strip at the bottom (CyberCrest's badge row).
  integratesLabel: "בנוי על ומחובר ל־",
  // Alt text for the central 3D emblem (the "one brain" core).
  emblemAlt: "הליבה החכמה של Clix — מוח אחד",
  ctas: [
    { label: "בואו נתחיל", href: "#contact", primary: true },
    { label: "גלו את Clix לעומק", href: "#services", primary: false },
  ],
  // Tools Clix connects & automates. The Integrations marquee renders real
  // brand marks via <BrandMark> (simple-icons, keyed by `name`); `mono`/`tint`
  // only feed the parked Stack.tsx cards.
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

// Services — the sticky-header + glass-cards band (ref: SERVICES · "Tailored
// for every…"). Header start-side, 4 tall glass cards scrolling past it.
// `art` picks the redrawn ref vignette: tiles (lit tile + cursor) · prompt
// (bottom prompt-bar UI, text at top) · none (bare) · nodes (branch diagram).
export const services = {
  eyebrow: "שירותים",
  title: "פתרון מותאם לכל עסק.",
  subcopy:
    "צוות הנדסה שהופך את החזון שלכם למערכת AI שעובדת — מותאמת לגודל, לתחום ולקצב של העסק שלכם.",
  items: [
    {
      title: "סוכני AI קוליים",
      body: "Voice AI ברמת ייצור: עונה לשיחות נכנסות, מאמת לידים, קובע פגישות ומעביר לנציג אנושי בדיוק כשצריך.",
      art: "tiles" as const,
    },
    {
      title: "אפליקציות ואתרים",
      body: "מוצרי Full-stack מהונדסים כמערכות — ממערכות CRM ופורטלי לקוחות ועד אפליקציות מובייל נייטיב ואתרים ייעודיים.",
      art: "prompt" as const,
    },
    {
      title: "אוטומציות ואינטגרציות",
      body: "מחברים את הכלים שכבר יש לכם לזרימת עבודה אחת, עם Vapi, n8n, Make, OpenAI ו-Claude.",
      art: "none" as const,
    },
    {
      title: "CRM ואוטומציית WhatsApp",
      body: "אוטומציות WhatsApp ומערכות CRM מותאמות אישית שמלוות את הלקוח מהליד הראשון ועד הסגירה.",
      art: "nodes" as const,
    },
  ],
} as const;

// Benefits — the sticky-header + stat-cards band (ref: BENEFITS · +48%/−21%/…).
// First card inverted white, the rest glass.
// ⚠️ Stat values are PLACEHOLDER marketing numbers — confirm real figures
// with the client before launch.
export const benefits = {
  eyebrow: "יתרונות",
  // Full sentence for a11y; visual two-line lockup below.
  title: "חכם. מאובטח. גדל איתכם. ברוכים הבאים ל-Clix.",
  titleLines: ["חכם. מאובטח. גדל איתכם.", "ברוכים הבאים ל-Clix."],
  stats: [
    { value: "+40%", label: "יותר פגישות ביומן" },
    { value: "24/7", label: "מענה לכל שיחה, בלי להחמיץ ליד" },
    { value: "-65%", label: "פחות עבודה ידנית על תהליכים" },
    { value: "x3", label: "טיפול מהיר יותר בלידים חדשים" },
  ],
} as const;

export const voiceAI = {
  eyebrow: "Voice AI",
  kicker: "Voice AI ברמת ייצור לצוותים מודרניים.",
  title: "סוכנים קוליים שמנהלים את כל השיחה.",
  body: "הסוכן עונה לשיחות נכנסות, מאמת לידים, קובע פגישות ומעביר שיחות לנציג אנושי כשצריך, בלי להחמיץ אף הזדמנות.",
  cta: { label: "בנו את הסוכן הקולי שלכם", href: "#contact" },
  // ZettaJoule-style spec block flanking the scroll-scrub waveform (top · RTL end).
  specs: [
    { k: "סוג סוכן", v: "קולי · זמן־אמת" },
    { k: "שפות", v: "עברית · אנגלית · ערבית" },
    { k: "זמן תגובה", v: "עד 500ms" },
  ],
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

// Testimonials — centered header + 4 client VIDEO cards (real phone-shot
// clips from /client-testimonials; compressed web copies + posters live in
// /public/testimonials). The videos replaced the ref's text-quote columns.
export const testimonials = {
  eyebrow: "המלצות",
  title: "מה הלקוחות שלנו אומרים.",
  playLabel: "נגן המלצה של",
  pauseLabel: "השהה את ההמלצה של",
  // ⚠️ נבו's role is a PLACEHOLDER — confirm the real title with the client.
  videos: [
    {
      name: "אסף פרץ",
      role: "מייסד, SalesIQ",
      src: "/testimonials/asaf-peretz.mp4",
      poster: "/testimonials/asaf-peretz-poster.jpg",
    },
    {
      name: "אדיר פרץ",
      role: "בעלים, סטודיו צילום ווידאו",
      src: "/testimonials/adir-peretz.mp4",
      poster: "/testimonials/adir-peretz-poster.jpg",
    },
    {
      name: "נועם תובי",
      role: "בעלים, השקעות",
      src: "/testimonials/noam-tovi.mp4",
      poster: "/testimonials/noam-tovi-poster.jpg",
    },
    {
      name: "נבו יהלומן",
      role: "לקוח Clix",
      src: "/testimonials/nevo-yahaloman.mp4",
      poster: "/testimonials/nevo-yahaloman-poster.jpg",
    },
  ],
  // Text quotes — superseded by the video cards; kept for reuse (captions /
  // a future press band).
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
        "האוטומציות חסכו לנו שעות עבודה כל יום. הצוות של Clix פשוט מבין עסקים.",
      name: "נועם תובי",
      role: "בעלים, השקעות",
    },
  ],
} as const;

// Pricing — 3 tiers (ref: PRICING · "Plans for every scale."), middle tier
// featured: raised black card with a white CTA.
// ⚠️ Tiers, features and prices are PLACEHOLDER — Clix has no published
// pricing; confirm real packages and figures with the client before launch.
export const pricing = {
  eyebrow: "תמחור",
  title: "מסלול לכל שלב.",
  perMonth: "/לחודש",
  ctaHref: "#contact",
  tiers: [
    {
      name: "בסיס",
      desc: "לעסקים קטנים שעושים צעד ראשון עם AI.",
      price: "₪1,490",
      features: [
        "סוכן קולי אחד",
        "אוטומציה לתהליך מרכזי אחד",
        "הטמעה והדרכה לצוות",
        "תמיכה בשעות העבודה",
      ],
      cta: "בואו נתחיל",
      featured: false,
    },
    {
      name: "מקצועי",
      desc: "לעסקים צומחים שרוצים מערכת שלמה.",
      price: "₪3,900",
      features: [
        "עד 3 סוכני AI",
        "אוטומציות ואינטגרציות ללא הגבלה",
        "CRM ואוטומציית WhatsApp",
        "תמיכה בעדיפות גבוהה",
      ],
      cta: "דברו איתנו",
      featured: true,
    },
    {
      name: "ארגוני",
      desc: "לארגונים גדולים עם צרכים מורכבים.",
      price: "₪7,900",
      features: [
        "סוכנים ומשתמשים ללא הגבלה",
        "פיתוח מותאם אישית",
        "אבטחה ותאימות ארגונית",
        "מנהל לקוח ייעודי",
      ],
      cta: "דברו איתנו",
      featured: false,
    },
  ],
} as const;

// Closing band — full-viewport CTA + footer in ONE section (ref: the last
// scene band). id="contact", so every "דברו איתנו"/#contact link lands here.
// ⚠️ LinkedIn / WhatsApp links are placeholders — swap for the real profiles.
export const closing = {
  // Full sentence for a11y; visual two-line lockup below.
  title: "צומחים עם Clix. מתחילים את המסע עוד היום.",
  titleLines: ["צומחים עם Clix.", "מתחילים את המסע עוד היום."],
  ctas: [
    { label: "דברו איתנו", href: "mailto:info@clixsolution.com", primary: true },
    { label: "למידע נוסף", href: "#solutions", primary: false },
  ],
  footer: {
    menuHeading: "תפריט",
    menu: [
      { label: "פתרונות", href: "#solutions" },
      { label: "יכולות", href: "#features" },
      { label: "שירותים", href: "#services" },
      { label: "הרצאות", href: "#training" },
    ],
    connectHeading: "בואו נתחבר",
    connect: [
      { label: "Instagram", href: "https://instagram.com/clix_solution" },
      { label: "LinkedIn", href: "#" },
      { label: "WhatsApp", href: "#" },
    ],
  },
} as const;

// Training / lectures — REPLACES the placeholder Pricing band (client call):
// copy block opposite an autoplaying muted stage-clip card (real footage from
// /ido-talk; web copy + poster in /public/training). Format follows the old
// site's lectures section, restyled onto the current dark palette.
export const training = {
  eyebrow: "הרצאות והדרכות",
  title: "מביאים את צוות המומחים אל החדר שלכם.",
  body: "הרצאות, הדרכות וייעוץ לארגונים שרוצים לפעול עם AI, לא רק לדבר עליו. נשאיר את הצוות שלכם עם כלים שאפשר להפעיל כבר מחר בבוקר.",
  cta: { label: "קבעו מפגש", href: "#contact" },
  video: {
    src: "/training/lecture-preview.mp4",
    poster: "/training/lecture-preview-poster.jpg",
    badge: "ON STAGE",
    caption: "RECENT · Q3 KEYNOTE",
    ariaLabel: "הצצה מהרצאה על הבמה",
  },
  // Legacy bullet list from the old card layout — unused in the video band,
  // kept for reuse.
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
