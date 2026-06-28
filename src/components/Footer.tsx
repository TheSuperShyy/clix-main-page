import { brand, contact, footer, nav } from "../data/content";
import { Icon } from "./ui/Icon";

const socialIcon: Record<string, string> = {
  Instagram: "instagram",
  LinkedIn: "linkedin",
  WhatsApp: "whatsapp",
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg pb-10 pt-20">
      <div className="container-x">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* brand + contact */}
          <div className="max-w-sm">
            <a href="#top" aria-label={brand.full} className="text-5xl font-black lowercase text-fg">
              {brand.name}
            </a>
            <p className="mt-5 leading-relaxed text-muted">{footer.blurb}</p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-6 inline-block text-lg font-semibold text-fg underline-offset-4 transition-colors hover:text-brand hover:underline"
            >
              {contact.email}
            </a>
          </div>

          {/* link columns */}
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h3 className="text-sm font-semibold tracking-[0.15em] text-faint">ניווט</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {nav.items.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-muted transition-colors hover:text-fg">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-[0.15em] text-faint">צרו קשר</h3>
              <ul className="mt-5 flex flex-col gap-3 text-muted">
                <li>{contact.locationLine}</li>
                <li className="nums">{contact.hours}</li>
                <li>
                  <a href={contact.instagramUrl} className="transition-colors hover:text-fg">
                    {contact.instagramHandle}
                  </a>
                </li>
              </ul>
              <div className="mt-5 flex gap-2.5">
                {footer.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-10 place-items-center rounded-full border border-border text-muted transition-all hover:border-border-strong hover:text-fg"
                  >
                    <Icon name={socialIcon[s.label] ?? "spark"} size={17} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-7 sm:flex-row">
          <p className="text-sm text-faint">{footer.copyright}</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-faint">
            {footer.legal.map((l) => (
              <li key={l}>
                <a href="#" className="transition-colors hover:text-muted">
                  {l}
                </a>
              </li>
            ))}
            <li>
              <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-fg">
                {footer.backToTop}
                <Icon name="arrow" size={14} className="rotate-90" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
