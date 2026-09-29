"use client";

export default function PhotoCmsFilters({ status, setStatus, type, setType, query, setQuery, collectionTypes = ["theme", "workshop"] }) {
  return (
    <div data-testid="photo-cms-filters" className="photo-admin-filters">
      <div role="group" aria-label="发布状态" className="photo-admin-filter-group">
        <span className="photo-admin-filter-label">发布状态</span>
        {[['all', '全部'], ['published', '已发布'], ['unpublished', '已下架']].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={status === value}
            onClick={() => setStatus(value)}
            className="photo-admin-filter-button"
          >
            {label}
          </button>
        ))}
      </div>
      <label className="photo-admin-filter-select-wrap">
        <span className="photo-admin-filter-label">集合类型</span>
        <select aria-label="集合类型" value={type} onChange={(event) => setType(event.target.value)} className="photo-admin-filter-select">
          <option value="all">全部主题</option>
          {collectionTypes.map((value) => (
            <option key={value} value={value}>{value === "workshop" ? "Workshop" : value === "theme" ? "主题" : value}</option>
          ))}
        </select>
      </label>
      <label className="photo-admin-filter-search">
        <span className="photo-admin-filter-label">搜索照片</span>
        <span aria-hidden="true">⌕</span>
        <input aria-label="搜索照片" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索 ID、标题、地点或说明" />
      </label>
    </div>
  );
}
