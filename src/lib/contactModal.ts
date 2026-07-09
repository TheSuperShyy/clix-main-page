import { useEffect, useState } from "react";

/**
 * Tiny global store for the contact-form popup so ANY CTA anywhere on the site
 * can open it without prop-drilling. The site-wide click interceptor inside
 * <ContactModal> also calls openContactModal() — it catches every
 * "בואו נדבר" / "דברו איתנו" link (href="#contact" or the contact mailto) so
 * existing CTAs open the form instead of scrolling/opening a mail client.
 */
type Listener = (open: boolean) => void;

let open = false;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l(open);
}

export function openContactModal() {
  if (!open) {
    open = true;
    emit();
  }
}

export function closeContactModal() {
  if (open) {
    open = false;
    emit();
  }
}

/** Subscribe a component to the modal's open/closed state. */
export function useContactModal() {
  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    listeners.add(setIsOpen);
    setIsOpen(open); // sync in case it changed before subscription
    return () => {
      listeners.delete(setIsOpen);
    };
  }, []);
  return { isOpen, open: openContactModal, close: closeContactModal };
}
