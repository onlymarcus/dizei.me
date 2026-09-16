"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

import { trackEvent, type MetaEvent } from "@/lib/meta-pixel";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: MetaEvent;
};

// Link normal que avisa a Meta antes de sair da pagina. Existe como client
// component separado para que home-page.tsx continue servindo tanto a rota
// client (/) quanto a rota server (/en).
export function TrackedLink({
  event,
  onClick,
  children,
  ...anchorProps
}: TrackedLinkProps) {
  function handleClick(nativeEvent: MouseEvent<HTMLAnchorElement>) {
    trackEvent(event);
    onClick?.(nativeEvent);
  }

  return (
    <a {...anchorProps} onClick={handleClick}>
      {children}
    </a>
  );
}
