"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useLocale } from "@/components/LocaleProvider";

const contacts = [
  { id: "github", labelKey: "contact.github", icon: faGithub, value: "github.com/jingle3083176110-ai", href: "https://github.com/jingle3083176110-ai" },
  {
    id: "email",
    labelKey: "contact.email",
    icon: faEnvelope,
    emails: [
      { label: "Gmail", value: "jingle3083176110@gmail.com" },
      { label: "QQ Mail", value: "3083176110@qq.com" },
      { label: "Outlook", value: "undefinedfrancis@outlook.com" },
    ],
  },
  { id: "xiaohongshu", labelKey: "contact.xiaohongshu", icon: null, value: "undefined · 小红书号 18109314385", href: "", media: "/contact/xiaohongshu.jpg" },
  { id: "wechat", labelKey: "contact.wechat", icon: null, value: "非人池令", href: "", media: "/contact/wechat-qr.jpg" },
];

function ContactIcon({ item }) {
  if (item.id === "xiaohongshu") {
    return <img src="https://cdn.simpleicons.org/xiaohongshu/f5f0e8" alt="" className="h-7 w-7" />;
  }
  if (item.id === "wechat") {
    return (
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="currentColor">
        <path d="M23.541 12.748c-.609-1.38-1.758-2.476-3.092-3.151-2.354-1.192-5.281-1.185-7.629.03-1.631.837-2.993 2.337-3.379 4.162-.318 1.344-.033 2.791.68 3.961 1.061 1.762 2.979 2.887 4.971 3.248 1.443.293 2.936.119 4.338-.285.842.326 1.592.854 2.408 1.246-.211-.707-.436-1.406-.676-2.102.916-.65 1.746-1.461 2.244-2.479.744-1.415.789-3.171.135-4.63zm-9.924-9.466c-2.495-1.404-5.602-1.615-8.286-.645-1.764.635-3.36 1.815-4.346 3.42-.895 1.45-1.23 3.258-.799 4.917.433 1.84 1.711 3.383 3.262 4.413-.3.85-.585 1.699-.855 2.555.975-.51 1.95-1.043 2.926-1.561 1.17.375 2.415.559 3.66.518-.33-.943-.405-1.965-.255-2.951.225-1.371.975-2.625 1.994-3.554 1.726-1.615 4.171-2.296 6.496-2.131-.436-2.135-1.936-3.939-3.824-4.98h.027z" />
      </svg>
    );
  }
  return <FontAwesomeIcon icon={item.icon} className="text-lg" aria-hidden="true" />;
}

export default function ContactOrbit() {
	const { t } = useLocale();
  const [activeId, setActiveId] = useState("github");
  const active = contacts.find((item) => item.id === activeId);

  return (
    <div className="mt-12 max-w-3xl">
      <div className="flex flex-wrap gap-3">
        {contacts.map((item, index) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              aria-pressed={selected}
              aria-label={`${t("contact.show")} ${t(item.labelKey)}`}
              className={`group relative flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 ${selected ? "border-[#e6c78f] bg-[#292722] text-[#f5f0e8] shadow-[0_0_0_4px_rgba(230,199,143,.08)]" : "border-offwhite/30 text-offwhite hover:-translate-y-1 hover:border-offwhite hover:bg-offwhite/10"}`}
            >
              <ContactIcon item={item} />
              <span className="sr-only">{t(item.labelKey)}</span>
              <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.13em] text-softgray opacity-0 transition-opacity group-hover:opacity-100">
                0{index + 1}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-10 flex min-h-16 items-start justify-between gap-6 border-y border-offwhite/20 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-softgray">{t(active.labelKey)}</p>
          {active.emails ? (
            <div className="mt-3 space-y-2">
              {active.emails.map((email) => (
                <p key={email.value} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-sans text-sm text-offwhite">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-softgray">{email.label}</span>
                  <a href={`mailto:${email.value}`} className="underline decoration-offwhite/40 underline-offset-4 transition-colors hover:text-[#e6c78f]">{email.value}</a>
                </p>
              ))}
            </div>
          ) : <p className="mt-2 font-sans text-sm text-offwhite">{active.valueKey ? t(active.valueKey) : active.value}</p>}
          {active.media && <img src={active.media} alt={active.id === "wechat" ? `${t(active.labelKey)} QR code` : "Xiaohongshu profile"} className="mt-5 max-h-72 w-auto rounded-lg" />}
        </div>
        {active.href ? <a href={active.href} target="_blank" rel="noreferrer" className="font-mono text-[10px] uppercase tracking-[0.18em] text-offwhite underline underline-offset-4">{t("contact.open")} ↗</a> : active.emails ? <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-softgray">{t("contact.chooseAddress")}</span> : active.media ? null : <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-softgray">{t("contact.awaiting")}</span>}
      </div>
    </div>
  );
}
