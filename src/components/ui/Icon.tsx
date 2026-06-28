import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  name: string;
  size?: number;
};

/** Inner geometry per icon (24x24 grid, 1.5 stroke, currentColor). */
function inner(name: string) {
  switch (name) {
    case "voice":
      return (
        <>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v3" />
        </>
      );
    case "code":
      return (
        <>
          <path d="m8 8-4 4 4 4" />
          <path d="m16 8 4 4-4 4" />
        </>
      );
    case "automation":
      return (
        <>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
          <path d="M9 3v2.5M15 3v2.5M9 18.5V21M15 18.5V21M3 9h2.5M3 15h2.5M18.5 9H21M18.5 15H21" />
        </>
      );
    case "crm":
      return <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" />;
    case "spark":
      return <path d="M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z" />;
    case "shield":
      return <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />;
    case "bolt":
      return <path d="M13 2 4 14h7l-1 8 9-12h-7z" />;
    case "chart":
      return (
        <>
          <path d="M3 21h18" />
          <path d="M7 21V12M12 21V5M17 21v-6" />
        </>
      );
    case "arrow": // RTL forward (points left)
      return (
        <>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </>
      );
    case "arrow-ne": // outward link (up-left for RTL)
      return (
        <>
          <path d="M17 17 7 7" />
          <path d="M7 17V7h10" />
        </>
      );
    case "check":
      return <path d="M20 6 9 17l-5-5" />;
    case "menu":
      return <path d="M4 7h16M4 12h16M4 17h16" />;
    case "close":
      return <path d="M6 6l12 12M18 6 6 18" />;
    case "mail":
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      );
    case "pin":
      return (
        <>
          <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      );
    case "instagram":
      return (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
        </>
      );
    case "linkedin":
      return (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M7 10.5V17M7 7.2v.01M11 17v-3.5a2 2 0 0 1 4 0V17" />
        </>
      );
    case "whatsapp":
      return (
        <>
          <path d="M3 21l1.6-4.4A8 8 0 1 1 8 19.4z" />
          <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.6-2-1-1 .8c-1-.4-1.8-1.2-2.2-2.2l.8-1-1-2z" fill="currentColor" stroke="none" />
        </>
      );
    default:
      return null;
  }
}

export function Icon({ name, size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {inner(name)}
    </svg>
  );
}
