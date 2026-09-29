"use client";
import { useState } from "react";
import { englishPlaceName } from "../../lib/photos/place-name.js";

export default function PhotoEditPanel({ photo, collections, onSave, onCancel, onError, onDirtyChange, error = "", saving = false, formId = "photo-edit-form" }) {
  const [englishLocation, setEnglishLocation] = useState(photo.location || "");
  const [locationWasEdited, setLocationWasEdited] = useState(Boolean(photo.location));
  function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    data.location = englishLocation;
    data.published = data.published === "true";
    data.collectionIds = [...event.currentTarget.querySelectorAll("input[name=collectionIds]:checked")].map((input) => input.value);
    Promise.resolve().then(() => onSave(data)).then(() => onDirtyChange?.(false)).catch((saveError) => onError?.(saveError));
  }
  return <form id={formId} data-testid="photo-edit-panel" onSubmit={submit} onChange={() => onDirtyChange?.(true)} className="photo-edit-form">
    {error ? <p className="photo-admin-drawer-error" role="alert">{error}</p> : null}
    {[['title','标题',photo.title],['alt','Alt 文本',photo.alt],['location_zh','中文地点',photo.location_zh],['note','说明',photo.note],['note_zh','中文说明',photo.note_zh]].map(([name,label,value]) => <label key={name} className="photo-edit-field">{label}<input name={name} defaultValue={value || ""} disabled={saving} onBlur={name === "location_zh" ? (event) => { if (!locationWasEdited || !englishLocation) setEnglishLocation(englishPlaceName(event.target.value)); } : undefined} /></label>)}
    <label className="photo-edit-field">英文地点<input name="location" value={englishLocation} onChange={(event) => { setEnglishLocation(event.target.value); setLocationWasEdited(true); }} disabled={saving} /><small className="photo-edit-helper">填写中文地点后离开输入框，会自动生成英文地点；也可以手动修改。</small></label>
    <label className="photo-edit-field">日期<input name="photo_date" type="date" defaultValue={photo.photo_date || ""} disabled={saving} /></label>
    <label className="photo-edit-field">比例<select name="aspect" defaultValue={photo.aspect || "landscape"} disabled={saving}><option value="landscape">横向</option><option value="portrait">纵向</option><option value="square">方形</option><option value="wide">宽幅</option><option value="tall">高幅</option></select></label>
    <label className="photo-edit-field">发布状态<select name="published" defaultValue={String(photo.published !== false)} disabled={saving}><option value="true">已发布</option><option value="false">已下架</option></select></label>
    <fieldset className="photo-edit-collections"><legend>Themes</legend><p className="photo-edit-helper">勾选后会替换这张照片的全部归属；想把照片移出旧栏目，请取消旧栏目的勾选。</p><div>{collections.filter((collection) => collection.collection_type === "theme").map((collection) => <label key={collection.id}><input type="checkbox" name="collectionIds" value={collection.id} defaultChecked={(photo.collectionIds || []).includes(collection.id)} disabled={saving} /> <span>{collection.title || collection.title_zh || collection.slug}</span></label>)}</div>{!collections.some((collection) => collection.collection_type === "theme") && <p className="photo-edit-helper">暂无主题集合</p>}</fieldset>
    <fieldset className="photo-edit-collections"><legend>Workshops</legend><p className="photo-edit-helper">勾选后会替换这张照片的全部归属；想把照片移出旧栏目，请取消旧栏目的勾选。</p><div>{collections.filter((collection) => collection.collection_type === "workshop").map((collection) => <label key={collection.id}><input type="checkbox" name="collectionIds" value={collection.id} defaultChecked={(photo.collectionIds || []).includes(collection.id)} disabled={saving} /> <span>{collection.title || collection.title_zh || collection.slug}</span></label>)}</div>{!collections.some((collection) => collection.collection_type === "workshop") && <p className="photo-edit-helper">暂无 Workshop 集合</p>}</fieldset>
    <div className="photo-edit-mobile-actions"><button type="submit" disabled={saving}>{saving ? "保存中…" : "保存更改"}</button><button type="button" onClick={onCancel} disabled={saving}>取消</button></div>
  </form>;
}
