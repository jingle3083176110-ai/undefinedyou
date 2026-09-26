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
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true" fill="none">
        <path d="M16.8 5.5C10.9 5.5 6 9.2 6 13.8c0 2.6 1.5 5 4.1 6.5l-1 3.6 3.7-2.2c1.1.3 2.2.4 3.4.4 5.9 0 10.8-3.7 10.8-8.3S22.7 5.5 16.8 5.5Z" fill="currentColor" />
        <path d="M10.8 13.8h.1m4.3 0h.1m7.2 5.2c-.9-2.5-3.6-4.2-6.9-4.2-4.1 0-7.4 2.5-7.4 5.6 0 1.8 1.1 3.4 2.7 4.4l-.6 2.2 2.5-1.4c.9.3 1.8.4 2.8.4 2.1 0 4-.7 5.3-1.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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
