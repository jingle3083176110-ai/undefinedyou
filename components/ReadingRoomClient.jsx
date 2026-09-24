"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

export default function ReadingRoomClient({ books }) {
	const { t } = useLocale();
  const shelfRef = useRef(null);
  const [active, setActive] = useState(0);
  const [offsets, setOffsets] = useState(() => books.map((_, index) => index));
  const book = books[active];

  const updateActiveBook = () => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const center = shelf.scrollLeft + shelf.clientWidth / 2;
    const cards = [...shelf.querySelectorAll("[data-book-index]")];
    const distances = cards.map((card) => (card.offsetLeft + card.offsetWidth / 2 - center) / (card.offsetWidth + 20));
    setOffsets(distances);
    const nearest = distances.reduce((current, distance, index) => {
      const absolute = Math.abs(distance);
      return absolute < current.distance ? { index, distance: absolute } : current;
    }, { index: active, distance: Number.POSITIVE_INFINITY });
    setActive(nearest.index);
  };

  useEffect(() => {
    const frame = requestAnimationFrame(updateActiveBook);
    window.addEventListener("resize", updateActiveBook);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", updateActiveBook); };
  }, []);

  const shelfCaption = useMemo(() => `${String(active + 1).padStart(2, "0")} / ${String(books.length).padStart(2, "0")}`, [active, books.length]);

  return (
    <main className="min-h-screen bg-[#1c1a18] px-6 pb-28 pt-32 text-[#f5f0e8] md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <Link href="/journal" className="font-mono text-xs uppercase tracking-[0.24em] text-[#c9c0b5] transition-colors hover:text-white">← {t("journal.back")}</Link>

        <header className="mt-14 border-b border-white/20 pb-10">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#c9c0b5]">02 / {t("journal.readingLabel")}</p>
          <h1 className="mt-6 font-display text-[clamp(3.5rem,8vw,7rem)] leading-[1.02] tracking-normal">{t("journal.reading")}</h1>
          <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-[#c9c0b5]">{t("journal.readingSummary")}</p>
        </header>

        <section className="py-14 md:py-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#c9c0b5]">{t("journal.onShelf")} / {shelfCaption}</p>
              <p className="mt-3 text-sm text-[#a9a095]">{t("journal.swipe")}</p>
            </div>
            <div className="hidden gap-2 md:flex" aria-hidden="true">
              {books.map((item, index) => <span key={item.slug} className={`h-px w-8 ${index === active ? "bg-[#f5f0e8]" : "bg-white/25"}`} />)}
            </div>
          </div>

          <div ref={shelfRef} onScroll={updateActiveBook} className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 pt-5 [scrollbar-color:#776f66_transparent] [scrollbar-width:thin] md:-mx-16 lg:-mx-24" style={{ paddingLeft: "calc(50% - clamp(130px, 18vw, 150px))", paddingRight: "calc(50% - clamp(130px, 18vw, 150px))" }}>
            {books.map((item, index) => {
              const distance = Math.min(Math.abs(offsets[index] ?? index), 2.5);
              const peripheralDistance = Math.max(0, distance - 0.58);
              const opacity = 1 - Math.min(peripheralDistance * 0.2, 0.38);
              const blur = Math.min(peripheralDistance * 2.2, 3.5);
              return <article data-book-index={index} key={item.slug} className="relative flex h-[390px] w-[260px] shrink-0 snap-center flex-col justify-between overflow-hidden p-7 md:h-[450px] md:w-[300px] md:p-8" style={{ backgroundColor: item.color, opacity, filter: `blur(${blur}px) saturate(${1 - Math.min(peripheralDistance * 0.08, 0.15)})`, transition: "opacity 90ms linear, filter 90ms linear", boxShadow: distance < 0.15 ? "0 30px 55px rgba(0,0,0,.42)" : "0 15px 32px rgba(0,0,0,.18)" }}>
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,.18),transparent_40%),linear-gradient(145deg,transparent,rgba(0,0,0,.24))]" />
                <span className="absolute inset-4 border border-white/35" />
                <div className="relative"><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/70">{String(index + 1).padStart(2, "0")} / {t("journal.readingNotes")}</p><p className="mt-4 font-sans text-sm text-white/75">{item.author}</p></div>
                <div className="relative"><h2 className="font-display text-5xl leading-[1.02] tracking-normal text-white">{item.title}</h2><p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-white/70">{t("journal.rating")} {item.rating}/10</p></div>
              </article>;
            })}
          </div>
        </section>

        <section className="border-t border-white/20 pt-12">
          <div className="max-w-3xl"><p className="font-mono text-xs uppercase tracking-[0.28em] text-[#c9c0b5]">{t("journal.notes")} / {book.title}</p><h2 className="mt-5 font-display text-5xl leading-none md:text-6xl">{book.title}</h2><p className="mt-4 font-sans text-lg text-[#c9c0b5]">{book.author}</p></div>
          {book.image ? <img src={book.image} alt="《认知觉醒》笔记中的图片" className="mt-10 max-h-72 w-full rounded-sm object-cover" /> : null}
          <div className="mt-12 max-w-3xl divide-y divide-white/15">
            {book.sections.map((section) => <article key={section.heading} className="py-10 first:pt-0"><h3 className="font-serif text-3xl leading-tight text-[#f5f0e8] md:text-4xl">{section.heading}</h3><div className="mt-6 space-y-4 font-sans text-[1.02rem] leading-8 text-[#d4cec3]">{section.body.map((line, i) => {
              if (line.type === "subheading") return <h4 key={`${section.heading}-${i}`} className="mt-8 border-l-2 border-[#ba9a68] pl-4 font-serif text-2xl leading-tight text-[#f1e6d7]">{line.text}</h4>;
              const content = (line.parts ?? [{ text: line.text, emphasis: false }]).map((part, partIndex) => part.emphasis ? <strong key={partIndex} className="font-medium text-[#e6c78f]">{part.text}</strong> : <span key={partIndex}>{part.text}</span>);
              return line.type === "list" ? <p key={`${section.heading}-${i}`} className="border-l border-[#9e8c74] pl-4">{content}</p> : <p key={`${section.heading}-${i}`}>{content}</p>;
            })}</div></article>)}
          </div>
        </section>
      </div>
    </main>
  );
}
