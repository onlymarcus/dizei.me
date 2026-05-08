"use client";

import { PhoneIcon } from "@/components/landing/ui-icons";

export function StartDemoButton({
  children = "Ligar e testar agora",
}: {
  children?: React.ReactNode;
}) {
  function handleClick() {
    document
      .getElementById("demonstracao")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

    window.setTimeout(() => {
      window.dispatchEvent(new Event("dizei:start-demo"));
    }, 450);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_18px_45px_rgba(16,185,129,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-300 sm:w-auto"
    >
      <PhoneIcon />
      {children}
    </button>
  );
}
