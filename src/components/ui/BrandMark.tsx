import type { CSSProperties } from "react";
import {
  siClaude,
  siGooglecalendar,
  siGooglegemini,
  siHubspot,
  siMake,
  siN8n,
  siWhatsapp,
} from "simple-icons";

/**
 * BrandMark — a real brand-logo lockup for the credential marquee.
 *
 * Icon paths come from `simple-icons` (tree-shaken named imports, 24×24
 * viewBox). At rest the mark renders in currentColor so the strip reads as ONE
 * grayscale logo row (reference-style, parent sets the tone); on hover of the
 * surrounding `group` (the marquee <li>) the icon floods with the brand's
 * OFFICIAL color (simple-icons' `hex`, exposed via a CSS var). Brands whose
 * marks simple-icons cannot distribute (OpenAI, monday.com — removed at the
 * trademark holders' request — and Vapi, absent) fall back to a bold wordmark,
 * which is those brands' primary logo form anyway.
 */

const ICONS: Record<string, { path: string; hex: string }> = {
  Claude: siClaude,
  Gemini: siGooglegemini,
  n8n: siN8n,
  Make: siMake,
  WhatsApp: siWhatsapp,
  "Google Calendar": siGooglecalendar,
  HubSpot: siHubspot,
};

export function BrandMark({ name }: { name: string }) {
  const icon = ICONS[name];

  if (!icon) {
    return (
      <span className="whitespace-nowrap text-lg font-bold tracking-tight sm:text-xl">
        {name}
      </span>
    );
  }

  return (
    <span
      className="flex items-center gap-2.5 sm:gap-3"
      style={{ "--brand-mark": `#${icon.hex}` } as CSSProperties}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-6 fill-current transition-[fill] duration-200 group-hover:fill-(--brand-mark) sm:size-7"
      >
        <path d={icon.path} />
      </svg>
      <span className="whitespace-nowrap text-base font-semibold sm:text-lg">{name}</span>
    </span>
  );
}
