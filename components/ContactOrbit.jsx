"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const contacts = [
  { id: "github", label: "GitHub", icon: faGithub, value: "github.com/jingle3083176110-ai", href: "https://github.com/jingle3083176110-ai" },
  {
    id: "email",
    label: "Email",
    icon: faEnvelope,
    emails: [
      { label: "Gmail", value: "jingle3083176110@gmail.com" },
      { label: "QQ Mail", value: "3083176110@qq.com" },
    ],
  },
  { id: "xiaohongshu", label: "Xiaohongshu", icon: null, value: "undefined · 小红书号 18109314385", href: "", media: "/contact/xiaohongshu.jpg" },
  { id: "x", label: "X", icon: faXTwitter, value: "X account not added yet", href: "" },
];

function ContactIcon({ item }) {
  if (item.id === "xiaohongshu") {
    return <img src="https://cdn.simpleicons.org/xiaohongshu/f5f0e8" alt="" className="h-7 w-7" />;
  }
    return <FontAwesomeIcon icon={item.icon} className="text-lg" aria-hidden="true" />;
}

export default function ContactOrbit() {
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
              aria-label={`Show ${item.label}`}
              className={`group relative flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 ${selected ? "border-[#e6c78f] bg-[#292722] text-[#f5f0e8] shadow-[0_0_0_4px_rgba(230,199,143,.08)]" : "border-offwhite/30 text-offwhite hover:-translate-y-1 hover:border-offwhite hover:bg-offwhite/10"}`}
            >
              <ContactIcon item={item} />
              <span className="sr-only">{item.label}</span>
              <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.13em] text-softgray opacity-0 transition-opacity group-hover:opacity-100">
                0{index + 1}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-10 flex min-h-16 items-start justify-between gap-6 border-y border-offwhite/20 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-softgray">{active.label}</p>
          {active.emails ? (
            <div className="mt-3 space-y-2">
              {active.emails.map((email) => (
                <p key={email.value} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-sans text-sm text-offwhite">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-softgray">{email.label}</span>
                  <a href={`mailto:${email.value}`} className="underline decoration-offwhite/40 underline-offset-4 transition-colors hover:text-[#e6c78f]">{email.value}</a>
                </p>
              ))}
            </div>
          ) : <p className="mt-2 font-sans text-sm text-offwhite">{active.value}</p>}
          {active.media && <img src={active.media} alt="Xiaohongshu profile" className="mt-5 max-h-72 w-auto rounded-lg" />}
        </div>
        {active.href ? <a href={active.href} target="_blank" rel="noreferrer" className="font-mono text-[10px] uppercase tracking-[0.18em] text-offwhite underline underline-offset-4">Open ↗</a> : active.emails ? <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-softgray">Choose an address</span> : <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-softgray">Awaiting details</span>}
      </div>
    </div>
  );
}
