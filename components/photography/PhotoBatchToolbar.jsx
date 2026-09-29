"use client";

export default function PhotoBatchToolbar({
  selected = [],
  visibleCount = 0,
  visibleSelectedCount = 0,
  collections = [],
  collectionFilter = "all",
  onCollectionFilter,
  onSelectAll,
  onClear,
  onPublish,
  onUnpublish,
  onReplaceCollections,
  busy = false,
  summary = "",
}) {
  if (!visibleCount) return null;
  return (
    <section className="photo-admin-batch-toolbar" aria-label="批量操作工具栏">
      <div className="photo-admin-batch-toolbar-heading">
        <strong>已选择 {selected.length} 张</strong>
        <span>当前列表 {visibleCount} 张</span>
      </div>
      <div className="photo-admin-batch-toolbar-actions">
        <button type="button" onClick={onSelectAll} disabled={busy || visibleSelectedCount >= visibleCount}>全选当前列表</button>
        <button type="button" onClick={onClear} disabled={busy}>清空选择</button>
        <button type="button" onClick={onPublish} disabled={busy}>批量上架</button>
        <button type="button" onClick={onUnpublish} disabled={busy}>批量下架</button>
        <label className="photo-admin-batch-collection-control">
          <span>筛选所属主题 / Workshop</span>
          <select aria-label="筛选所属主题或 Workshop" value={collectionFilter} disabled={busy} onChange={(event) => onCollectionFilter?.(event.target.value)}>
            <option value="all">全部照片</option>
            {collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.title_zh || collection.title || collection.slug}</option>)}
          </select>
        </label>
        <label className="photo-admin-batch-collection-control">
          <span>替换所属主题 / Workshop</span>
          <select aria-label="批量替换所属主题或 Workshop" defaultValue="" disabled={busy} onChange={(event) => {
            if (event.target.value) onReplaceCollections?.([event.target.value]);
            event.target.value = "";
          }}>
            <option value="">选择集合…</option>
            <option value="__none__">移出所有集合</option>
            {collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.title_zh || collection.title || collection.slug}</option>)}
          </select>
        </label>
      </div>
      {summary ? <p className="photo-admin-batch-summary" role="status" aria-live="polite">{summary}</p> : null}
    </section>
  );
}
