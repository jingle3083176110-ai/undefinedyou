"use client";

export default function PhotoUploader({ files, collections, dragActive, uploading, progress, onDragEnter, onDragOver, onDragLeave, onDrop, onAddFiles, onRemoveFile, onSubmit, onRetry }) {
  return <form className="photo-admin-uploader" onSubmit={onSubmit}>
    <div className={`photo-admin-dropzone${dragActive ? " is-drag-active" : ""}`} onDragEnter={onDragEnter} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <strong>拖放照片到这里</strong><span>支持多选和文件夹上传，系统会自动生成适合展示的版本</span>
      <div className="photo-admin-upload-actions"><label className="photo-admin-secondary-action" htmlFor="photo-files">选择照片</label><label className="photo-admin-secondary-action" htmlFor="photo-folder">选择文件夹</label></div>
      <input id="photo-files" aria-label="选择影像文件" type="file" accept="image/*" multiple onChange={(event) => onAddFiles(event.target.files)} />
      <input id="photo-folder" aria-label="选择影像文件夹" type="file" accept="image/*" multiple webkitdirectory="true" directory="true" onChange={(event) => onAddFiles(event.target.files)} />
    </div>
    {files.length > 0 && <div className="photo-admin-upload-queue" aria-label="待上传照片队列">
      <div className="photo-admin-upload-queue-heading"><strong>待上传 {files.length} 张</strong><button type="button" onClick={() => files.forEach((item) => onRemoveFile(item.id))}>清空</button></div>
      {files.map((item) => <div className="photo-admin-upload-item" key={item.id}><img src={item.preview} alt="" /><div><strong title={item.file.name}>{item.file.name}</strong><span>{Math.max(1, Math.round(item.file.size / 1024))} KB · {progress[item.id]?.label || "待上传"}</span>{progress[item.id]?.error && <small className="photo-admin-upload-error">{progress[item.id].error}</small>}</div>{progress[item.id]?.error ? <button type="button" onClick={() => onRetry(item.id)}>重试</button> : <button type="button" aria-label={`移除 ${item.file.name}`} onClick={() => onRemoveFile(item.id)} disabled={uploading}>移除</button>}</div>)}
    </div>}
    <div className="photo-admin-upload-metadata">
      <label>统一标题<input name="title" aria-label="标题" placeholder="可选" /></label>
      <label>地点（英文）<input name="locationEn" aria-label="英文地点" /></label><label>地点（中文）<input name="locationZh" aria-label="中文地点" /></label>
      <label>拍摄日期<input name="date" type="date" aria-label="拍摄日期" /></label><label>画幅<select name="aspectRatio" defaultValue="landscape"><option value="landscape">横幅</option><option value="portrait">竖幅</option><option value="square">方形</option><option value="wide">宽幅</option><option value="tall">长幅</option></select></label>
      <label className="photo-admin-upload-wide">英文描述<textarea name="descriptionEn" aria-label="英文描述" /></label><label className="photo-admin-upload-wide">中文描述<textarea name="descriptionZh" aria-label="中文描述" /></label>
      <fieldset className="photo-admin-upload-wide"><legend>Themes</legend><div className="photo-admin-upload-collections">{collections.filter((collection) => collection.collection_type === "theme").map((collection) => <label key={collection.id}><input type="checkbox" name="collectionIds" value={collection.id} /> {collection.title_zh || collection.title || collection.slug}</label>)}</div>{!collections.some((collection) => collection.collection_type === "theme") && <p className="photo-admin-upload-empty">暂无主题集合</p>}</fieldset>
      <fieldset className="photo-admin-upload-wide"><legend>Workshops</legend><div className="photo-admin-upload-collections">{collections.filter((collection) => collection.collection_type === "workshop").map((collection) => <label key={collection.id}><input type="checkbox" name="collectionIds" value={collection.id} /> {collection.title_zh || collection.title || collection.slug}</label>)}</div>{!collections.some((collection) => collection.collection_type === "workshop") && <p className="photo-admin-upload-empty">暂无 Workshop 集合</p>}</fieldset>
    </div>
    <input name="published" type="hidden" value="true" readOnly /><button className="photo-admin-primary-action" type="submit" disabled={uploading || !files.length}>{uploading ? "上传中" : `开始上传${files.length ? ` · ${files.length} 张` : ""}`}</button>
  </form>;
}
