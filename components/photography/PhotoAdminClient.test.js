import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const componentPath = new URL("./PhotoAdminClient.jsx", import.meta.url);
const shellPath = new URL("./PhotoAdminShell.jsx", import.meta.url);
const shellStylesPath = new URL("./photo-admin.css", import.meta.url);
const galleryPath = new URL("./PhotoGallery.jsx", import.meta.url);
const statsPath = new URL("./PhotoStats.jsx", import.meta.url);
const uploaderPath = new URL("./PhotoUploader.jsx", import.meta.url);
const drawerPath = new URL("./PhotoEditDrawer.jsx", import.meta.url);
const editPanelPath = new URL("./PhotoEditPanel.jsx", import.meta.url);
const batchToolbarPath = new URL("./PhotoBatchToolbar.jsx", import.meta.url);
const collectionManagerPath = new URL("./CollectionManager.jsx", import.meta.url);
const collectionDrawerPath = new URL("./CollectionEditDrawer.jsx", import.meta.url);

test("photo admin client exposes the three editorial workspace sections", async () => {
  const source = await fs.readFile(componentPath, "utf8");
  assert.match(source, /data-testid=["']photo-upload-section["']/);
  assert.match(source, /PhotoCmsFilters/);
  assert.match(source, /data-testid=["']photo-list-section["']/);
});

test("photo admin client provides an accessible metadata and single-file form", async () => {
  const source = await fs.readFile(componentPath, "utf8");
  const uploader = await fs.readFile(uploaderPath, "utf8");
  assert.match(uploader, /type=["']file["']/);
  assert.match(uploader, /aria-label=["']选择影像文件["']/);
  assert.match(source, /role=["']tablist["']/);
  assert.match(source, /aria-selected/);
  assert.match(source, /PhotoEditPanel/);
});

test("photo uploader supports folder queue metadata and retry", async () => {
  const source = await fs.readFile(uploaderPath, "utf8");
  assert.match(source, /webkitdirectory/);
  assert.match(source, /拖放照片/);
  assert.match(source, /onRetry/);
  assert.match(source, /locationEn/);
  assert.match(source, /descriptionZh/);
  assert.match(source, /collectionIds/);
});

test("photo collection selectors split themes and workshops while preserving ids and selection", async () => {
  const uploader = await fs.readFile(uploaderPath, "utf8");
  const panel = await fs.readFile(editPanelPath, "utf8");
  for (const source of [uploader, panel]) {
    assert.match(source, /<fieldset/);
    assert.match(source, /Themes/);
    assert.match(source, /Workshops/);
    assert.match(source, /collection_type === "theme"/);
    assert.match(source, /collection_type === "workshop"/);
    assert.match(source, /name="collectionIds"/);
  }
  assert.match(uploader, /value=\{collection\.id\}/);
  assert.match(panel, /defaultChecked=\{\(photo\.collectionIds \|\| \[\]\)\.includes\(collection\.id\)\}/);
});

test("photo admin client provides a sign out action", async () => {
  const source = await fs.readFile(componentPath, "utf8");
  assert.match(source, /PhotoEditPanel/);
  assert.match(source, /onClick/);
});

test("photo admin client preserves API error messages for list, edit, delete, and upload", async () => {
  const source = await fs.readFile(componentPath, "utf8");
  assert.match(source, /response\.json\(\)/);
  assert.match(source, /加载失败/);
  assert.match(source, /保存失败/);
  assert.match(source, /published/);
  assert.match(source, /collectionIds/);
});

test("photo admin page renders the client workspace and loading state exists", async () => {
  const page = await fs.readFile(new URL("../../app/photography/admin/page.jsx", import.meta.url), "utf8");
  const loading = await fs.readFile(new URL("../../app/photography/admin/loading.jsx", import.meta.url), "utf8");
  assert.match(page, /PhotoAdminClient/);
  assert.match(loading, /摄影后台/);
  assert.match(loading, /animate-pulse/);
});

test("photo admin shell exposes semantic desktop navigation and account actions", async () => {
  const source = await fs.readFile(shellPath, "utf8");
  assert.match(source, /<aside/);
  assert.match(source, /<header/);
  assert.match(source, /<main/);
  assert.match(source, /aria-current/);
  assert.match(source, /摄影总览/);
  assert.match(source, /上传照片/);
  assert.match(source, /退出登录/);
});

test("photo admin shell provides responsive drawer controls and focus-visible styling", async () => {
  const source = await fs.readFile(shellPath, "utf8");
  const styles = await fs.readFile(shellStylesPath, "utf8");
  assert.match(source, /aria-expanded/);
  assert.match(source, /aria-controls/);
  assert.match(source, /关闭导航/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /overflow-wrap/);
  assert.match(styles, /@media/);
});

test("photo admin composes gallery stats and explicit async states", async () => {
  const source = await fs.readFile(componentPath, "utf8");
  const gallery = await fs.readFile(galleryPath, "utf8");
  const stats = await fs.readFile(statsPath, "utf8");
  assert.match(source, /PhotoStats/);
  assert.match(source, /PhotoGallery/);
  assert.match(source, /role=["']status["']/);
  assert.match(source, /role=["']alert["']/);
  assert.match(source, /加载中|loading/i);
  assert.match(gallery, /选择/);
  assert.match(gallery, /编辑/);
  assert.match(gallery, /删除/);
  assert.match(stats, /最近上传/);
  assert.match(stats, /已发布/);
});

test("photo cms filters expose stable labels for search and filter groups", async () => {
  const source = await fs.readFile(new URL("./PhotoCmsFilters.jsx", import.meta.url), "utf8");
  assert.match(source, /aria-label=["']发布状态["']/);
  assert.match(source, /aria-label=["']集合类型["']/);
  assert.match(source, /aria-label=["']搜索照片["']/);
  assert.match(source, /aria-pressed/);
  assert.match(source, /全部主题/);
});

test("photo admin prioritizes photos matching the active collection filter", async () => {
  const source = await fs.readFile(componentPath, "utf8");
  assert.match(source, /const visible = \[\.\.\.photos\.filter/);
  assert.match(source, /collectionMatch/);
  assert.match(source, /sort\(/);
});

test("photo edit drawer protects focus and unsaved changes", async () => {
  const drawer = await fs.readFile(drawerPath, "utf8");
  const panel = await fs.readFile(editPanelPath, "utf8");
  assert.match(drawer, /role="dialog"/);
  assert.match(drawer, /event\.key === "Escape"/);
  assert.match(drawer, /window\.confirm/);
  assert.match(drawer, /focusable/);
  assert.match(drawer, /returnFocusRef/);
  assert.match(panel, /Promise\.resolve\(\)\.then\(\(\) => onSave/);
  assert.match(panel, /role="alert"/);
});

test("photo admin exposes a selection-aware batch toolbar and collection replacement", async () => {
  const source = await fs.readFile(componentPath, "utf8");
  const toolbar = await fs.readFile(batchToolbarPath, "utf8");
  assert.match(source, /PhotoBatchToolbar/);
  assert.match(source, /setSelected\(\(current\).*visible\.map/);
  assert.match(source, /replaceCollections/);
  assert.match(source, /batchBusy/);
  assert.match(source, /visibleSelectedCount/);
  assert.match(toolbar, /全选当前列表/);
  assert.match(toolbar, /清空选择/);
  assert.match(toolbar, /批量上架/);
  assert.match(toolbar, /批量下架/);
  assert.match(toolbar, /replaceCollections|onReplaceCollections/);
  assert.match(toolbar, /role="status"/);
  assert.match(toolbar, /if \(!visibleCount\) return null/);
  assert.match(source, /setBatchSummary/);
  assert.match(source, /setSelected\(\(current\) => current\.filter/);
});

test("photo admin exposes independent Themes and Workshops collection views", async () => {
  const source = await fs.readFile(componentPath, "utf8");
  const shell = await fs.readFile(shellPath, "utf8");
  const manager = await fs.readFile(collectionManagerPath, "utf8");
  assert.match(source, /collectionTypeView/);
  assert.match(source, /CollectionManager/);
  assert.match(source, /collection_type/);
  assert.match(source, /method: ["']POST["']/);
  assert.match(source, /method: ["']PATCH["']/);
  assert.match(source, /confirm=true/);
  assert.match(shell, /Themes/);
  assert.match(shell, /Workshops/);
  assert.match(manager, /onCreate/);
  assert.match(manager, /onUpdate/);
  assert.match(manager, /onDelete/);
  assert.match(manager, /window\.confirm/);
});

test("collection manager and drawer cover CRUD fields and explicit async states", async () => {
  const manager = await fs.readFile(collectionManagerPath, "utf8");
  const drawer = await fs.readFile(collectionDrawerPath, "utf8");
  for (const field of ["slug", "title", "title_zh", "intro", "intro_zh", "date_range", "location", "location_zh", "cover_photo_id", "published"]) {
    assert.match(drawer, new RegExp(`["']${field}["']`));
  }
  assert.match(drawer, /collection_type/);
  assert.match(drawer, /role="dialog"/);
  assert.match(manager, /role="status"/);
  assert.match(manager, /role="alert"/);
  assert.match(manager, /新增/);
  assert.match(manager, /编辑/);
  assert.match(manager, /删除/);
  assert.match(manager, /published/);
  assert.match(manager, /cover_photo_id/);
});
