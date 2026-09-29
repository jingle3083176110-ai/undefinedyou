"use client";

function collectionLabel(collection) {
  return collection?.title_zh || collection?.title || collection?.slug || "未命名集合";
}

function collectionTypeLabel(collection) {
  if (collection?.collection_type === "workshop") return "Workshop";
  if (collection?.collection_type === "theme") return "主题";
  return "集合";
}

export default function PhotoGallery({
  photos = [],
  collections = [],
  selected = [],
  editing = null,
  onSelect,
  onEdit,
  onTogglePublished,
  onDelete,
  renderEditor,
}) {
  const collectionMap = new Map(collections.map((collection) => [collection.id, collection]));

  if (!photos.length) {
    return (
      <div className="photo-admin-empty-state" role="status">
        <span className="photo-admin-empty-mark" aria-hidden="true">○</span>
        <h2>还没有符合条件的照片</h2>
        <p>调整筛选条件，或上传一张新的照片开始整理档案。</p>
      </div>
    );
  }

  return (
    <div className="photo-admin-gallery" aria-label="照片列表">
      {photos.map((photo) => {
        const linkedCollections = (photo.collectionIds || [])
          .map((id) => collectionMap.get(id))
          .filter(Boolean);
        const published = photo.published !== false;
        const location = photo.location_zh || photo.location || "未注明地点";
        return (
          <article key={photo.id} className="photo-admin-photo-card">
            <div className="photo-admin-photo-card-media">
              <img src={photo.src} alt={photo.alt || photo.title || photo.id} loading="lazy" />
              <label className="photo-admin-photo-select">
                <input
                  type="checkbox"
                  aria-label={`选择 ${photo.id}`}
                  checked={selected.includes(photo.id)}
                  onChange={(event) => onSelect?.(photo.id, event.target.checked)}
                />
                <span>选择</span>
              </label>
              <span className={`photo-admin-status-badge${published ? " is-published" : " is-unpublished"}`}>
                {published ? "已发布" : "已下架"}
              </span>
            </div>

            <div className="photo-admin-photo-card-body">
              <div className="photo-admin-photo-card-heading">
                <p className="photo-admin-photo-id">ID: {photo.id}</p>
                {photo.title ? <h2>{photo.title}</h2> : null}
              </div>
              <p className="photo-admin-photo-location">{location}</p>
              <div className="photo-admin-collection-list" aria-label={`${photo.id} 所属集合`}>
                {linkedCollections.length ? linkedCollections.map((collection) => (
                  <span key={collection.id} className="photo-admin-collection-chip">
                    {collectionTypeLabel(collection)} · {collectionLabel(collection)}
                  </span>
                )) : <span className="photo-admin-collection-chip is-muted">未归档</span>}
              </div>

              {editing === photo.id && renderEditor ? (
                renderEditor(photo)
              ) : (
                <div className="photo-admin-card-actions">
                  <button type="button" onClick={() => onEdit?.(photo.id)} aria-label={`编辑 ${photo.id}`}>
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => onTogglePublished?.(photo)}
                    aria-label={`${published ? "下架" : "上架"} ${photo.id}`}
                  >
                    {published ? "下架" : "上架"}
                  </button>
                  <button type="button" className="is-danger" onClick={() => onDelete?.(photo)} aria-label={`删除 ${photo.id}`}>
                    删除
                  </button>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
