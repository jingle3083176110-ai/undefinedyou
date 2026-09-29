"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PhotoAdminShell from "./PhotoAdminShell.jsx";
import PhotoCmsFilters from "./PhotoCmsFilters.jsx";
import PhotoEditDrawer from "./PhotoEditDrawer.jsx";
// PhotoEditPanel is intentionally hosted by the accessible drawer.
import PhotoEditPanel from "./PhotoEditPanel.jsx";
import PhotoGallery from "./PhotoGallery.jsx";
import PhotoStats from "./PhotoStats.jsx";
import PhotoUploader from "./PhotoUploader.jsx";
import PhotoBatchToolbar from "./PhotoBatchToolbar.jsx";
import CollectionManager from "./CollectionManager.jsx";
import { createBrowserSupabaseClient } from "../../lib/supabase/browser.js";

export default function PhotoAdminClient() {
  const router = useRouter();
  const [photos, setPhotos] = useState([]);
  const [collections, setCollections] = useState([]);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [tab, setTab] = useState("overview");
  const [collectionTypeView, setCollectionTypeView] = useState(null);
  const [collectionCreateRequest, setCollectionCreateRequest] = useState(0);
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [lastUploadMetadata, setLastUploadMetadata] = useState(null);
  const [batchBusy, setBatchBusy] = useState(false);
  const [batchSummary, setBatchSummary] = useState("");

  useEffect(() => {
    document.body.classList.add("photo-admin-route");
    return () => document.body.classList.remove("photo-admin-route");
  }, []);

  function addFiles(incoming) {
    const next = Array.from(incoming || []).filter((file) => file.type?.startsWith("image/") || /\.(jpe?g|png|webp|avif|gif|heic|tiff?)$/i.test(file.name));
    setFiles((current) => {
      const existing = new Set(current.map(({ file }) => `${file.name}:${file.size}:${file.lastModified}`));
      return [...current, ...next.filter((file) => !existing.has(`${file.name}:${file.size}:${file.lastModified}`)).map((file) => ({ file, id: `${file.name}-${file.size}-${file.lastModified}`, preview: URL.createObjectURL(file) }))];
    });
  }

  function removeFile(id) {
    setFiles((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return current.filter((item) => item.id !== id);
    });
  }

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [photosResponse, collectionsResponse] = await Promise.all([
        fetch("/api/admin/photos"),
        fetch("/api/admin/photo-collections"),
      ]);
      const photosBody = await photosResponse.json();
      const collectionsBody = await collectionsResponse.json();
      if (!photosResponse.ok) throw Error(photosBody.error || "照片加载失败");
      if (!collectionsResponse.ok) throw Error(collectionsBody.error || "集合加载失败");
      const nextPhotos = photosBody.photos || [];
      setPhotos(nextPhotos);
      setSelected((current) => current.filter((id) => nextPhotos.some((photo) => photo.id === id)));
      setCollections(collectionsBody.collections || []);
    } catch (error) {
      setLoadError(error.message || "加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function patch(id, data) {
    const response = await fetch(`/api/admin/photos/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await response.json();
    if (!response.ok) throw Error(body.error || "保存失败");
    setPhotos((current) => current.map((photo) => (photo.id === id ? body.photo : photo)));
    return body.photo;
  }

  async function createCollection(data) {
    const response = await fetch("/api/admin/photo-collections", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...data, collection_type: collectionTypeView }),
    });
    const body = await response.json();
    if (!response.ok) throw Error(body.error || "集合创建失败");
    setCollections((current) => [body.collection, ...current.filter((collection) => collection.id !== body.collection?.id)]);
    return body.collection;
  }

  async function updateCollection(id, data) {
    const response = await fetch(`/api/admin/photo-collections/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...data, collection_type: collectionTypeView }),
    });
    const body = await response.json();
    if (!response.ok) throw Error(body.error || "集合保存失败");
    setCollections((current) => current.map((collection) => (collection.id === id ? body.collection : collection)));
    return body.collection;
  }

  async function deleteCollection(id) {
    const response = await fetch(`/api/admin/photo-collections/${id}?confirm=true`, { method: "DELETE" });
    const body = await response.json();
    if (!response.ok) throw Error(body.error || "集合删除失败");
    setCollections((current) => current.filter((collection) => collection.id !== id));
    return body;
  }

  async function bulk(published) {
    const ids = [...selected];
    if (!ids.length) return;
    setBatchBusy(true);
    try {
      const results = await Promise.all(ids.map(async (id) => {
        try { await patch(id, { published }); return { id, ok: true }; }
        catch (error) { return { id, ok: false, error: error.message || "操作失败" }; }
      }));
      const failed = results.filter((result) => !result.ok);
      const passed = results.length - failed.length;
      setSelected(failed.map((result) => result.id));
      const summary = `批量${published ? "上架" : "下架"}完成：${passed} 张成功${failed.length ? `，${failed.length} 张失败（已保留选择）` : ""}`;
      setBatchSummary(summary); setMessage(summary);
    } finally { setBatchBusy(false); }
  }

  async function replaceCollections(collectionIds) {
    const ids = [...selected];
    if (!ids.length) return;
    const target = collectionIds.includes("__none__") ? [] : collectionIds;
    setBatchBusy(true);
    try {
      const results = await Promise.all(ids.map(async (id) => {
        try { await patch(id, { collectionIds: target }); return { id, ok: true }; }
        catch (error) { return { id, ok: false, error: error.message || "集合更新失败" }; }
      }));
      const failed = results.filter((result) => !result.ok);
      setSelected(failed.map((result) => result.id));
      const summary = `集合更新完成：${results.length - failed.length} 张成功${failed.length ? `，${failed.length} 张失败（已保留选择）` : ""}`;
      setBatchSummary(summary); setMessage(summary);
    } finally { setBatchBusy(false); }
  }

  async function upload(event, onlyId = null) {
    event?.preventDefault();
    setUploading(true);
    try {
      const metadata = event?.currentTarget ? new FormData(event.currentTarget) : lastUploadMetadata;
      if (event?.currentTarget) setLastUploadMetadata(metadata);
      const batch = onlyId ? files.filter((item) => item.id === onlyId) : files;
      const failedIds = new Set();
      const failedDetails = {};
      const successfulIds = new Set();
      for (const item of batch) {
        const file = item.file;
        const formData = new FormData();
        metadata?.forEach((value, key) => { if (key !== "collectionIds") formData.append(key, value); });
        const collectionIds = metadata ? metadata.getAll("collectionIds") : [];
        if (collectionIds.length) formData.set("collectionIds", JSON.stringify(collectionIds));
        formData.set("file", file);
        setUploadProgress((current) => ({ ...current, [item.id]: { label: "上传中" } }));
        const response = await fetch("/api/admin/photos", { method: "POST", body: formData });
        const body = await response.json();
        if (!response.ok) { failedIds.add(item.id); failedDetails[item.id] = { label: "失败", error: body.error || "上传失败" }; setUploadProgress((current) => ({ ...current, [item.id]: failedDetails[item.id] })); continue; }
        setPhotos((current) => [body.photo, ...current]);
        successfulIds.add(item.id);
        setUploadProgress((current) => ({ ...current, [item.id]: { label: "完成" } }));
      }
      setMessage(`上传完成：${successfulIds.size} 张成功${failedIds.size ? `，${failedIds.size} 张失败，请重试` : ""}`);
      if (event?.currentTarget) event.currentTarget.reset();
      if (!onlyId) {
        setFiles((current) => current.filter((item) => {
          if (!failedIds.has(item.id)) { if (item.preview) URL.revokeObjectURL(item.preview); return false; }
          return true;
        }));
        setUploadProgress(Object.fromEntries([...failedIds].map((id) => [id, failedDetails[id]])));
      } else setUploadProgress((current) => ({ ...current, [onlyId]: { label: "完成" } }));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function remove(photo) {
    if (!confirm(`确认删除 ${photo.id}？`)) return;
    try {
      const response = await fetch(`/api/admin/photos/${photo.id}?confirm=true`, { method: "DELETE" });
      if (!response.ok) throw Error("删除失败");
      setPhotos((current) => current.filter((item) => item.id !== photo.id));
      setSelected((current) => current.filter((id) => id !== photo.id));
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function signOut() {
    const { error } = await createBrowserSupabaseClient().auth.signOut();
    if (error) throw Error(error.message || "退出失败");
    router.push("/photography/login");
  }

  function navigate(section) {
    if (section === "theme" || section === "workshop") {
      setCollectionTypeView(section);
      setTab("collections");
      return;
    }
    setCollectionTypeView(null);
    if (section === "upload" || section === "batch") {
      setTab(section);
      return;
    }
    if (section === "library") {
      setType("all");
      setStatus("all");
    }
    setTab("overview");
  }

  function selectWorkspaceTab(value) {
    setCollectionTypeView(null);
    setTab(value);
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visible = photos.filter((photo) => (
    (status === "all" || (status === "published" ? photo.published !== false : photo.published === false))
    && (type === "all" || (photo.collectionIds || []).some((id) => collections.find((collection) => collection.id === id)?.collection_type === type))
    && `${photo.id} ${photo.title || ""} ${photo.title_zh || ""} ${photo.location || ""} ${photo.location_zh || ""} ${photo.note || ""} ${photo.note_zh || ""} ${photo.alt || ""}`.toLowerCase().includes(normalizedQuery)
  ));

  const activeSection = collectionTypeView || (tab === "upload" || tab === "batch" ? tab : "overview");
  const pageTitle = collectionTypeView === "theme" ? "Themes" : collectionTypeView === "workshop" ? "Workshops" : tab === "upload" ? "上传照片" : tab === "batch" ? "批量操作" : "摄影总览";
  const collectionTitle = collectionTypeView === "theme" ? "Themes" : "Workshops";
  const collectionDescription = collectionTypeView === "theme" ? "管理主题栏目、封面与公开发布状态。" : "管理 Workshop 栏目、封面与公开发布状态。";

  return (
    <PhotoAdminShell
      activeSection={activeSection}
      pageTitle={pageTitle}
      searchValue={query}
      onSearchChange={setQuery}
      onNavigate={navigate}
      primaryActionLabel={collectionTypeView ? `新增 ${collectionTypeView === "theme" ? "Theme" : "Workshop"}` : undefined}
      onPrimaryAction={collectionTypeView ? () => setCollectionCreateRequest((current) => current + 1) : undefined}
      onSignOut={signOut}
    >
      <div className="photo-admin-workspace">
        {collectionTypeView ? (
          <CollectionManager
            key={collectionTypeView}
            collectionType={collectionTypeView}
            title={collectionTitle}
            description={collectionDescription}
            collections={collections}
            photos={photos}
            onReload={loadData}
            onCreate={createCollection}
            onUpdate={updateCollection}
            onDelete={deleteCollection}
            loading={loading}
            error={loadError}
            openCreateRequest={collectionCreateRequest}
          />
        ) : (
          <>
            <div role="tablist" aria-label="摄影后台视图" className="photo-admin-tabs">
              {[['overview', '总览'], ['upload', '上传'], ['batch', '批量操作']].map(([value, label]) => (
                <button type="button" role="tab" aria-selected={tab === value} onClick={() => selectWorkspaceTab(value)} key={value}>
                  {label}
                </button>
              ))}
            </div>

            {tab !== "batch" && (
              <section data-testid="photo-info-section" className="photo-admin-info-section">
                <PhotoCmsFilters {...{ status, setStatus, type, setType, query, setQuery }} />
              </section>
            )}

            {tab === "overview" && <PhotoStats photos={photos} />}

            {tab === "upload" && (
              <section data-testid="photo-upload-section" className="photo-admin-upload-section">
                <PhotoUploader files={files} collections={collections} dragActive={dragActive} uploading={uploading} progress={uploadProgress} onDragEnter={(event) => { event.preventDefault(); setDragActive(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (event.currentTarget === event.target) setDragActive(false); }} onDrop={(event) => { event.preventDefault(); setDragActive(false); addFiles(event.dataTransfer.files); }} onAddFiles={addFiles} onRemoveFile={removeFile} onSubmit={upload} onRetry={(id) => upload(null, id)} />
              </section>
            )}

            {tab === "batch" && (
              <section className="photo-admin-batch-section">
                <p>请先在照片列表中选择需要处理的照片。</p>
              </section>
            )}

            <PhotoBatchToolbar
              selected={selected}
              visibleCount={visible.length}
              visibleSelectedCount={visible.filter((photo) => selected.includes(photo.id)).length}
              collections={collections}
              onSelectAll={() => setSelected((current) => [...new Set([...current, ...visible.map((photo) => photo.id)])])}
              onClear={() => setSelected([])}
              onPublish={() => bulk(true)}
              onUnpublish={() => bulk(false)}
              onReplaceCollections={replaceCollections}
              busy={batchBusy}
              summary={batchSummary}
            />

            <section data-testid="photo-list-section" className="photo-admin-list-section">
              {loading ? (
                <div className="photo-admin-loading-state" role="status" aria-live="polite">
                  <p>照片加载中…</p>
                  <div className="photo-admin-gallery-skeleton" aria-hidden="true">
                    {[1, 2, 3].map((item) => <span key={item} />)}
                  </div>
                </div>
              ) : loadError ? (
                <div className="photo-admin-error-state" role="alert">
                  <h2>照片暂时无法加载</h2>
                  <p>{loadError}</p>
                  <button type="button" onClick={loadData}>重新加载</button>
                </div>
              ) : (
                <PhotoGallery
                  photos={visible}
                  collections={collections}
                  selected={selected}
                  editing={editing}
                  onSelect={(id, checked) => setSelected((current) => checked ? [...current, id] : current.filter((item) => item !== id))}
                  onEdit={setEditing}
                  onTogglePublished={(photo) => patch(photo.id, { published: photo.published === false }).catch((error) => setMessage(error.message))}
                  onDelete={remove}
                />
              )}
              {message && <p role="status" className="photo-admin-inline-message">{message}</p>}
            </section>
          </>
        )}
      </div>
      {editing && (() => {
        const photo = photos.find((item) => item.id === editing);
        return photo ? <PhotoEditDrawer photo={photo} collections={collections} onSave={async (data) => {
          await patch(photo.id, { ...data, collectionIds: data.collectionIds || photo.collectionIds || [] });
          setEditing(null);
        }} onClose={() => setEditing(null)} /> : null;
      })()}
    </PhotoAdminShell>
  );
}
