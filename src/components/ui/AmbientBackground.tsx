/** Fixed, full-bleed ambient glows behind all content. Decorative only. */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div
        className="absolute -top-[15%] right-[-12%] h-[58vh] w-[58vh] rounded-full opacity-30 blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--color-brand), transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-18%] left-[-12%] h-[52vh] w-[52vh] rounded-full opacity-20 blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--color-cyan), transparent 70%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
