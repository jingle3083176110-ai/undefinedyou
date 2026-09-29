"use client";
import { useEffect, useId, useRef, useState } from "react";
import PhotoEditPanel from "./PhotoEditPanel.jsx";

export default function PhotoEditDrawer({ photo, collections, onSave, onClose }) {
  const [dirty, setDirty] = useState(false); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  const drawerRef = useRef(null); const returnFocusRef = useRef(typeof document !== "undefined" ? document.activeElement : null); const dirtyRef = useRef(false); const onCloseRef = useRef(onClose);
  const titleId = useId(); const formId = useId();
  useEffect(() => { dirtyRef.current = dirty; }, [dirty]);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const focusable = () => [...drawerRef.current.querySelectorAll("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")];
    focusable()[0]?.focus();
    function onKeyDown(event) { if (event.key === "Escape") { event.preventDefault(); if (!dirtyRef.current || window.confirm("你有尚未保存的修改，确定放弃吗？")) onCloseRef.current?.(); return; } if (event.key !== "Tab") return; const items = focusable(); if (!items.length) return; const first = items[0]; const last = items[items.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
    document.addEventListener("keydown", onKeyDown); return () => { document.removeEventListener("keydown", onKeyDown); returnFocusRef.current?.focus?.(); };
  }, []);
  function requestClose() { if (dirty && !window.confirm("你有尚未保存的修改，确定放弃吗？")) return; onClose?.(); }
  async function save(data) { setSaving(true); setError(""); try { await onSave?.(data); } catch (saveError) { setError(saveError.message || "保存失败"); throw saveError; } finally { setSaving(false); } }
  return <div className="photo-admin-drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) requestClose(); }}>
    <aside ref={drawerRef} className="photo-admin-edit-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <header className="photo-admin-drawer-header"><div><p className="photo-admin-eyebrow">EDIT PHOTO</p><h2 id={titleId}>编辑照片</h2></div><button type="button" className="photo-admin-drawer-close" onClick={requestClose} aria-label="关闭编辑面板">×</button></header>
      <div className="photo-admin-drawer-preview"><img src={photo.src} alt={photo.alt || photo.title || photo.id} /><div><strong>{photo.title || "未命名照片"}</strong><span>{photo.id}</span></div></div>
      <div className="photo-admin-drawer-body"><PhotoEditPanel key={photo.id} photo={photo} collections={collections} onSave={save} onCancel={requestClose} onError={(saveError) => setError(saveError.message || "保存失败")} onDirtyChange={setDirty} error={error} saving={saving} formId={formId} /></div>
      <footer className="photo-admin-drawer-footer"><button type="button" onClick={requestClose} disabled={saving}>取消</button><button type="submit" form={formId} disabled={saving}>{saving ? "保存中…" : "保存更改"}</button></footer>
    </aside>
  </div>;
}
