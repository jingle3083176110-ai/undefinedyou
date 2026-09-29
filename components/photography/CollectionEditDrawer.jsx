"use client";

import { useId, useState } from "react";

const FIELDS = [
  ["slug", "Slug", "text"],
  ["title", "English title", "text"],
  ["title_zh", "中文标题", "text"],
  ["intro", "Introduction", "textarea"],
  ["intro_zh", "中文简介", "textarea"],
  ["date_range", "Date range", "text"],
  ["location", "Location", "text"],
  ["location_zh", "中文地点", "text"],
];

export default function CollectionEditDrawer({
  collection,
  collectionType,
  photos = [],
  onSave,
  onClose,
  saving = false,
  error = "",
}) {
  const titleId = useId();
  const formId = useId();
  const [localError, setLocalError] = useState("");
  const isEditing = Boolean(collection?.id);

  async function submit(event) {
    event.preventDefault();
    setLocalError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    data.published = data.published === "true";
    data.collection_type = collectionType;
    try {
      await onSave(data);
    } catch (saveError) {
      setLocalError(saveError?.message || "保存失败");
    }
  }

  return (
    <div className="photo-admin-drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose?.(); }}>
      <aside className="photo-admin-edit-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="photo-admin-drawer-header">
          <div>
            <p className="photo-admin-eyebrow">{isEditing ? "EDIT COLLECTION" : "NEW COLLECTION"}</p>
            <h2 id={titleId}>{isEditing ? "编辑集合" : "新增集合"}</h2>
          </div>
          <button type="button" className="photo-admin-drawer-close" onClick={onClose} disabled={saving} aria-label="关闭集合编辑面板">×</button>
        </header>

        <div className="photo-admin-drawer-body">
          <form id={formId} className="photo-edit-form" onSubmit={submit}>
            {(error || localError) ? <p className="photo-admin-drawer-error" role="alert">{error || localError}</p> : null}
            <input type="hidden" name="collection_type" value={collectionType} readOnly />
            {FIELDS.map(([name, label, kind]) => (
              <label className="photo-edit-field" key={name}>
                {label}
                {kind === "textarea" ? (
                  <textarea name={name} defaultValue={collection?.[name] || ""} rows={3} disabled={saving} />
                ) : (
                  <input name={name} type={kind} defaultValue={collection?.[name] || ""} required={name === "slug" || name === "title"} disabled={saving} />
                )}
              </label>
            ))}
            <label className="photo-edit-field">
              Cover photo
              <select name="cover_photo_id" defaultValue={collection?.cover_photo_id || ""} disabled={saving}>
                <option value="">No cover photo</option>
                {photos.map((photo) => <option key={photo.id} value={photo.id}>{photo.title || photo.title_zh || photo.id}</option>)}
              </select>
            </label>
            <label className="photo-edit-field">
              发布状态
              <select name="published" defaultValue={String(collection?.published !== false)} disabled={saving}>
                <option value="true">已发布</option>
                <option value="false">已下架</option>
              </select>
            </label>
          </form>
        </div>

        <footer className="photo-admin-drawer-footer">
          <button type="button" onClick={onClose} disabled={saving}>取消</button>
          <button type="submit" form={formId} disabled={saving}>{saving ? "保存中…" : "保存更改"}</button>
        </footer>
      </aside>
    </div>
  );
}
