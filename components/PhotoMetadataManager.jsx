"use client";

import { useMemo, useState } from "react";

const storageKey = "undefinedyou-photo-metadata";

function filename(src) {
  return src.split("/").pop() || src;
}

const locationTerms = [
  ["中国香港", "Hong Kong, China"], ["香港", "Hong Kong"], ["中国深圳", "Shenzhen, China"], ["深圳市", "Shenzhen"], ["深圳", "Shenzhen"], ["珠海市", "Zhuhai"], ["珠海", "Zhuhai"], ["逸夫书院", "Shaw College"], ["中大", "CUHK"], ["校园", "Campus"], ["大学城", "University Town"], ["海边", "Seaside"], ["湖边", "Lakeside"], ["公园", "Park"], ["书院", "College"], ["街道", "Street"], ["路", "Road"], ["山", "Mountain"], ["桥", "Bridge"], ["餐厅", "Restaurant"], ["中国", "China"],
];

function englishLocation(value) {
  let result = value.trim();
  for (const [source, target] of locationTerms) result = result.replaceAll(source, target);
  return result.replace(/[，、]/g, ", ").replace(/\s+/g, " ").trim();
}

export default function PhotoMetadataManager({ photos }) {
  const [query, setQuery] = useState("");
  const [metadata, setMetadata] = useState(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(window.localStorage.getItem(storageKey) || "{}"); } catch { return {}; }
  });

  const filtered = useMemo(() => photos.filter((photo) => {
    const text = `${photo.id} ${filename(photo.src)} ${photo.location || ""} ${photo.locationZh || ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  }), [photos, query]);

  const update = (id, field, value) => {
    const next = { ...metadata, [id]: { ...metadata[id], [field]: value } };
    setMetadata(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const exportMetadata = () => {
    const payload = photos.map((photo) => ({ id: photo.id, src: photo.src, date: photo.date, location: metadata[photo.id]?.location || photo.location || "", locationZh: metadata[photo.id]?.locationZh || photo.locationZh || "", note: metadata[photo.id]?.note || photo.note || "" }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "photo-metadata.json"; link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-12">
      <div className="mb-8 flex flex-col gap-4 border-b border-ink/15 pb-6 md:flex-row md:items-end md:justify-between">
        <label className="block flex-1 text-sm text-muted">Search by filename or ID<input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 w-full rounded border border-ink/20 bg-white px-4 py-3 text-ink outline-none focus:border-ink" placeholder="e.g. dsc00004 or landscape-..." /></label>
        <button type="button" onClick={exportMetadata} className="rounded-full border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[.16em] text-white transition hover:bg-transparent hover:text-ink">Export metadata JSON</button>
      </div>
      <p className="mb-6 text-sm text-muted">{filtered.length} photos · edits are saved in this browser only</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((photo) => {
          const saved = metadata[photo.id] || {};
          return <article key={photo.id} className="overflow-hidden rounded border border-ink/15 bg-white">
            <img src={photo.src} alt={photo.alt} className="aspect-[4/3] w-full object-cover" />
            <div className="space-y-3 p-4">
              <p className="break-all font-mono text-[11px] leading-5 text-muted">{photo.id}</p>
              <p className="break-all text-xs text-muted">{filename(photo.src)}</p>
              <label className="block text-xs uppercase tracking-[.12em] text-muted">Location<input value={saved.location ?? photo.location ?? ""} onChange={(event) => update(photo.id, "location", event.target.value)} className="mt-1 w-full border-b border-ink/20 bg-transparent py-1 text-sm normal-case tracking-normal text-ink outline-none focus:border-ink" /></label>
              <label className="block text-xs uppercase tracking-[.12em] text-muted">中文地点<input value={saved.locationZh ?? photo.locationZh ?? ""} onChange={(event) => { const value = event.target.value; const next = { ...metadata, [photo.id]: { ...metadata[photo.id], locationZh: value, location: englishLocation(value) } }; setMetadata(next); window.localStorage.setItem(storageKey, JSON.stringify(next)); }} className="mt-1 w-full border-b border-ink/20 bg-transparent py-1 text-sm normal-case tracking-normal text-ink outline-none focus:border-ink" /></label>
              <p className="text-xs text-muted">Date: {photo.date || "Not recorded"}</p>
            </div>
          </article>;
        })}
      </div>
    </div>
  );
}
