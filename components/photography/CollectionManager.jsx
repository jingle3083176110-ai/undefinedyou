"use client";

import { useEffect, useMemo, useState } from "react";
import CollectionEditDrawer from "./CollectionEditDrawer.jsx";

const TYPE_LABELS = {
  theme: { eyebrow: "THEMES", title: "Themes", noun: "Theme" },
  workshop: { eyebrow: "WORKSHOPS", title: "Workshops", noun: "Workshop" },
};

function collectionLabel(collection) {
  return collection.title_zh || collection.title || collection.slug || "未命名集合";
}

function coverFor(collection, photos) {
  return photos.find((photo) => photo.id === collection.cover_photo_id);
}

function linkedPhotoCount(collection, photos) {
  return photos.filter((photo) => (photo.collectionIds || []).includes(collection.id)).length;
}

export default function CollectionManager({
  collectionType,
  title,
  description,
  collections = [],
  photos = [],
  onReload,
  onCreate,
  onUpdate,
  onDelete,
  loading = false,
  error = "",
  openCreateRequest = 0,
}) {
  const [editingCollection, setEditingCollection] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const labels = TYPE_LABELS[collectionType] || TYPE_LABELS.theme;
  const visibleCollections = useMemo(
    () => collections.filter((collection) => {
      if (collection.collection_type !== collectionType) return false;
      if (statusFilter === "published" && collection.published === false) return false;
      if (statusFilter === "unpublished" && collection.published !== false) return false;
      const haystack = `${collection.slug || ""} ${collection.title || ""} ${collection.title_zh || ""} ${collection.intro || ""} ${collection.intro_zh || ""}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    }),
    [collections, collectionType, query, statusFilter],
  );

  useEffect(() => {
    if (openCreateRequest) setEditingCollection(null);
  }, [openCreateRequest]);

  function openCreate() {
    setActionError("");
    setNotice("");
    setEditingCollection(null);
  }

  function openEdit(collection) {
    setActionError("");
    setNotice("");
    setEditingCollection(collection);
  }

  async function saveCollection(data) {
    setSaving(true);
    setActionError("");
    try {
      const payload = { ...data, collection_type: collectionType };
      if (editingCollection?.id) await onUpdate(editingCollection.id, payload);
      else await onCreate(payload);
      await onReload?.();
      setEditingCollection(undefined);
      setNotice(editingCollection?.id ? "集合已保存" : "集合已创建");
    } catch (saveError) {
      setActionError(saveError?.message || "保存失败");
      throw saveError;
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(collection) {
    setBusyId(collection.id);
    setActionError("");
    try {
      await onUpdate(collection.id, { published: collection.published === false, collection_type: collectionType });
      await onReload?.();
      setNotice(collection.published === false ? "集合已发布" : "集合已下架");
    } catch (toggleError) {
      setActionError(toggleError?.message || "发布状态更新失败");
    } finally {
      setBusyId("");
    }
  }

  async function deleteCollection(collection) {
    if (!window.confirm(`确认删除「${collectionLabel(collection)}」？关联照片不会被删除。`)) return;
    setBusyId(collection.id);
    setActionError("");
    try {
      await onDelete(collection.id);
      await onReload?.();
      setNotice("集合已删除");
    } catch (deleteError) {
      setActionError(deleteError?.message || "删除失败");
    } finally {
      setBusyId("");
    }
  }

  return (
    <section className={`photo-admin-collection-manager is-${collectionType}`} data-testid="collection-manager">
      <header className="photo-admin-collection-heading">
        <div>
          <p className="photo-admin-eyebrow">{labels.eyebrow}</p>
          <h2>{title || labels.title}</h2>
          <p>{description || `管理公开展示的 ${labels.noun} 内容、封面与发布状态。`}</p>
        </div>
        <button type="button" className="photo-admin-primary-action" onClick={openCreate}>＋ 新增 {labels.noun}</button>
      </header>

      <div className="photo-admin-collection-summary" aria-live="polite">
        <span>{visibleCollections.length} 个集合</span>
        <span>{visibleCollections.reduce((total, collection) => total + linkedPhotoCount(collection, photos), 0)} 张关联照片</span>
        <span>{visibleCollections.filter((collection) => collection.published !== false).length} 个已发布</span>
      </div>

      <div className="photo-admin-collection-filters" role="search" aria-label={`${labels.title}筛选`}>
        <label>搜索<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`搜索 ${labels.noun} 名称或 slug`} /></label>
        <label>状态<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">全部状态</option><option value="published">已发布</option><option value="unpublished">已下架</option></select></label>
      </div>

      {actionError ? <p className="photo-admin-drawer-error" role="alert">{actionError}</p> : null}
      {notice ? <p className="photo-admin-inline-message" role="status">{notice}</p> : null}
      {error ? <div className="photo-admin-error-state" role="alert"><h3>集合暂时无法加载</h3><p>{error}</p><button type="button" onClick={onReload}>重新加载</button></div> : loading && !visibleCollections.length ? (
        <div className="photo-admin-loading-state" role="status" aria-live="polite"><p>{labels.title} 加载中…</p></div>
      ) : visibleCollections.length ? (
        <div className="photo-admin-collection-grid" data-testid="collection-list">
          {visibleCollections.map((collection) => {
            const cover = coverFor(collection, photos);
            const linkedCount = linkedPhotoCount(collection, photos);
            const busy = busyId === collection.id;
            return (
              <article className="photo-admin-collection-card" key={collection.id}>
                <div className="photo-admin-collection-cover">
                  {cover?.src ? <img src={cover.src} alt="" /> : <span>NO COVER</span>}
                </div>
                <div className="photo-admin-collection-card-body">
                  <div className="photo-admin-collection-card-heading">
                    <div>
                      <h3>{collectionLabel(collection)}</h3>
                      <p>{collection.title || collection.title_zh || "未命名"}</p>
                    </div>
                    <span className={`photo-admin-collection-status${collection.published === false ? " is-unpublished" : ""}`}>{collection.published === false ? "已下架" : "已发布"}</span>
                  </div>
                  <p className="photo-admin-collection-slug">/{collection.slug}</p>
                  <p className="photo-admin-collection-meta">{linkedCount} 张照片 · {collection.location_zh || collection.location || "未填写地点"}</p>
                  <div className="photo-admin-card-actions">
                    <button type="button" onClick={() => openEdit(collection)} disabled={busy}>编辑</button>
                    <button type="button" onClick={() => togglePublished(collection)} disabled={busy}>{busy ? "处理中…" : collection.published === false ? "发布" : "下架"}</button>
                    <button type="button" className="is-danger" onClick={() => deleteCollection(collection)} disabled={busy}>删除</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : query || statusFilter !== "all" ? (
        <div className="photo-admin-empty-state"><p>没有符合条件的 {labels.title}。</p><button type="button" className="photo-admin-secondary-action" onClick={() => { setQuery(""); setStatusFilter("all"); }}>清除筛选</button></div>
      ) : (
        <div className="photo-admin-empty-state" data-testid="collection-empty-state">
          <p>还没有 {labels.title} 内容。</p>
          <button type="button" className="photo-admin-secondary-action" onClick={openCreate}>新增 {labels.noun}</button>
        </div>
      )}

      {editingCollection !== undefined ? (
        <CollectionEditDrawer
          collection={editingCollection}
          collectionType={collectionType}
          photos={photos}
          onSave={saveCollection}
          onClose={() => { if (!saving) setEditingCollection(undefined); }}
          saving={saving}
          error={actionError}
        />
      ) : null}
    </section>
  );
}
