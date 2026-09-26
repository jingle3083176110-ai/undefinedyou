"use client";

import { useEffect, useMemo, useState } from "react";

const storageKey = "undefinedyou-photo-metadata";

function filename(src) {
  return src.split("/").pop() || src;
}

const locationTranslations = {
  "中国 广东省 深圳市 龙岗区": "Longgang District, Shenzhen, Guangdong, China",
  "中国 广东省 深圳市 龙岗区 阿卡那拉海滩": null,
  "中国 香港 麦理浩径": "MacLehose Trail, Hong Kong",
  "中国 香港 海洋公园": "Ocean Park, Hong Kong",
  "中国 香港 上环": "Sheung Wan, Hong Kong",
  "中国 香港 中环": "Central, Hong Kong",
  "中国 香港 香港中文大学 天人合一": "Unity Pavilion, The Chinese University of Hong Kong",
  "中国 广东省 深圳市 龙岗区 香港中文大学（深圳）逸夫书院": "Shaw College, The Chinese University of Hong Kong, Shenzhen",
  "中国 广东省 深圳市 龙岗区 香港中文大学（深圳）图书馆": "Library, The Chinese University of Hong Kong, Shenzhen",
  "中国 广东省 深圳市 龙岗区 香港中文大学（深圳）音乐学院": "School of Music, The Chinese University of Hong Kong, Shenzhen",
  "中国 广东省 深圳市 龙岗区 香港中文大学（深圳）": "The Chinese University of Hong Kong, Shenzhen",
  "中国 珠海市": "Zhuhai, Guangdong, China",
  "中国 广东省 禅城区 EXP学习空间": "EXP Study Space, Chancheng District, Foshan, Guangdong, China",
  "中国 厦门": "Xiamen, Fujian, China",
  "中国 广东省 禅城区 亚艺公园": "Yayi Park, Chancheng District, Foshan, Guangdong, China",
  "中国 浙江省 舟山市 普陀区": "Putuo District, Zhoushan, Zhejiang, China",
  "中国 广东省 佛山市 禅城区 亚艺公园": "Yayi Park, Chancheng District, Foshan, Guangdong, China",
  "中国 上海市 武康路": "Wukang Road, Shanghai, China",
  "中国 广东省 佛山市": "Foshan, Guangdong, China",
  "中国 上海市": "Shanghai, China",
  "中国 上海": "Shanghai, China",
};

export default function PhotoMetadataManager({ photos }) {
  const [query, setQuery] = useState("");
  const [metadata, setMetadata] = useState(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(window.localStorage.getItem(storageKey) || "{}"); } catch { return {}; }
  });

  useEffect(() => {
    const next = { ...metadata };
    let changed = false;
    photos.forEach((photo) => {
      const chinese = next[photo.id]?.locationZh || photo.locationZh || "";
      const translated = locationTranslations[chinese.trim()];
      if (Object.prototype.hasOwnProperty.call(locationTranslations, chinese.trim()) && next[photo.id]?.location !== (translated || "")) {
        next[photo.id] = { ...next[photo.id], location: translated || "" };
        changed = true;
      }
    });
    if (changed) {
      setMetadata(next);
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    }
  }, [photos]);

  const filtered = useMemo(() => photos.filter((photo) => {
    const text = `${photo.id} ${filename(photo.src)} ${photo.location || ""} ${photo.locationZh || ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  }), [photos, query]);

  const update = (id, field, value) => {
    const next = { ...metadata, [id]: { ...metadata[id], [field]: value } };
    setMetadata(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const translateFilledLocations = () => {
    const next = { ...metadata };
    photos.forEach((photo) => {
      const chinese = next[photo.id]?.locationZh || photo.locationZh || "";
      const translated = locationTranslations[chinese.trim()];
      if (Object.prototype.hasOwnProperty.call(locationTranslations, chinese.trim())) next[photo.id] = { ...next[photo.id], location: translated || "" };
    });
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
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={translateFilledLocations} className="rounded-full border border-ink/40 px-5 py-3 font-mono text-xs uppercase tracking-[.16em] text-ink transition hover:border-ink">Translate filled locations</button>
          <button type="button" onClick={exportMetadata} className="rounded-full border border-ink bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[.16em] text-white transition hover:bg-transparent hover:text-ink">Export metadata JSON</button>
        </div>
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
              <label className="block text-xs uppercase tracking-[.12em] text-muted">中文地点<input value={saved.locationZh ?? photo.locationZh ?? ""} onChange={(event) => update(photo.id, "locationZh", event.target.value)} className="mt-1 w-full border-b border-ink/20 bg-transparent py-1 text-sm normal-case tracking-normal text-ink outline-none focus:border-ink" /></label>
              <p className="text-xs text-muted">Date: {photo.date || "Not recorded"}</p>
            </div>
          </article>;
        })}
      </div>
    </div>
  );
}
