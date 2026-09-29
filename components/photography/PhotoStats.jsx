"use client";

const RECENT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function isPublished(photo) {
  return photo?.published !== false;
}

function isRecent(photo, now) {
  const rawDate = photo?.created_at || photo?.uploaded_at || photo?.photo_date;
  if (!rawDate) return false;
  const timestamp = new Date(rawDate).getTime();
  return Number.isFinite(timestamp) && timestamp >= now - RECENT_WINDOW_MS && timestamp <= now;
}

export default function PhotoStats({ photos = [], now = Date.now() }) {
  const total = photos.length;
  const published = photos.filter(isPublished).length;
  const unpublished = total - published;
  const recent = photos.filter((photo) => isRecent(photo, now)).length;
  const cards = [
    { key: "total", label: "全部照片", value: total, hint: "Library" },
    { key: "published", label: "已发布", value: published, hint: "Live" },
    { key: "unpublished", label: "已下架", value: unpublished, hint: "Drafts" },
    { key: "recent", label: "最近上传", value: recent, hint: "Last 30 days" },
  ];

  return (
    <section className="photo-admin-stats" aria-label="照片统计">
      {cards.map((card) => (
        <article key={card.key} className={`photo-admin-stat-card photo-admin-stat-card-${card.key}`}>
          <div className="photo-admin-stat-card-heading">
            <p>{card.label}</p>
            <span>{card.hint}</span>
          </div>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}

