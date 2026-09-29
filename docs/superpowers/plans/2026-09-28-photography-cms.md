# 摄影 CMS 升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前单张摄影后台升级为支持现有内容总览、单张/多张/文件夹上传、多集合关联、批量编辑、上下架和自动图片处理的摄影 CMS。

**Architecture:** 保留现有 Supabase Auth、私有原图桶和公开预览桶。服务端新增照片集合查询与批量变更接口，客户端工作台负责文件夹读取、队列、筛选和批量操作；每张照片仍只有一条 `photos` 记录，通过 `collection_photos` 建立多对多关系。

**Tech Stack:** Next.js App Router, React, Supabase PostgREST/Storage/Auth, sharp, pnpm, Node test runner.

---

### Task 1: 扩展照片数据读取与集合接口

**Files:**
- Modify: `app/api/admin/photos/route.js`
- Modify: `app/api/admin/photos/[id]/route.js`
- Create: `app/api/admin/photo-collections/route.js`
- Create: `app/api/admin/photo-collections/[id]/route.js`
- Test: `scripts/tests/photo-cms-data.test.js`

- [ ] **Step 1: 写失败测试** — GET 照片返回公开元数据和集合标签；GET 集合按 theme/workshop 返回；PATCH 集合关联使用 `collection_photos`。
- [ ] **Step 2: 实现集合查询** — 读取主题/Workshop 及其照片关联，显式白名单字段。
- [ ] **Step 3: 扩展照片 PATCH** — 接收 `collectionIds` 和 `published`，先更新照片元数据，再幂等替换关联行。
- [ ] **Step 4: 实现上下架和集合管理接口** — 仅管理员可用，禁止修改 Storage 路径。
- [ ] **Step 5: 运行测试** — `pnpm test` 与定向数据测试全部通过。

### Task 2: 批量上传服务端队列与集合关联

**Files:**
- Modify: `app/api/admin/photos/route.js`
- Modify: `lib/photos/admin-storage.js`
- Test: `app/api/admin/photos/route.test.js`

- [ ] **Step 1: 写失败测试** — FormData 单文件上传携带 `collectionIds`、`published` 和元数据；重复 ID 使用更新；关联写入正确。
- [ ] **Step 2: 扩展 POST 校验** — 支持 title、地点、日期、双语说明、aspect、published、collectionIds；限制集合 ID 数量和字符串长度。
- [ ] **Step 3: 实现关联写入** — 上传成功后写入 `collection_photos`，失败时清理 Storage 和照片记录。
- [ ] **Step 4: 保持单文件 API 可重复调用** — 前端批量队列逐张调用，服务端保证每张独立成功/失败。
- [ ] **Step 5: 运行上传回滚测试** — 覆盖预览失败、原图失败、数据库失败、关联失败。

### Task 3: CMS 工作台总览、筛选和详情编辑

**Files:**
- Modify: `components/photography/PhotoAdminClient.jsx`
- Create: `components/photography/PhotoCmsFilters.jsx`
- Create: `components/photography/PhotoEditPanel.jsx`
- Test: `components/photography/PhotoCmsClient.test.js`

- [ ] **Step 1: 写失败组件测试** — 全部/已发布/已下架筛选、主题/Workshop 筛选、搜索、卡片集合标签和上下架操作。
- [ ] **Step 2: 实现工作台导航** — 由单一上传表单升级为总览、上传、批量操作三个视图。
- [ ] **Step 3: 实现筛选和卡片** — 显示已有全部照片、状态、集合标签、编辑/上下架/删除。
- [ ] **Step 4: 实现详情编辑** — 修改完整照片元数据和多选集合，调用 PATCH 后刷新列表。
- [ ] **Step 5: 运行组件测试与构建**。

### Task 4: 单张、多选和文件夹上传界面

**Files:**
- Create: `components/photography/PhotoUploadQueue.jsx`
- Modify: `components/photography/PhotoAdminClient.jsx`
- Test: `components/photography/PhotoUploadQueue.test.js`

- [ ] **Step 1: 写失败测试** — 单文件、多文件和 `webkitdirectory` 文件夹输入；递归过滤图片；可移除待上传项。
- [ ] **Step 2: 实现统一元数据表单** — 主题/Workshop 多选、地点、日期、双语说明、发布状态和比例。
- [ ] **Step 3: 实现逐张上传队列** — 显示总进度、每张状态、成功/失败/重试，逐张调用 POST API。
- [ ] **Step 4: 实现自动处理提示** — 显示“自动旋转、生成预览、保存原图”，不要求用户压缩。
- [ ] **Step 5: 运行队列测试与 build**。

### Task 5: 批量编辑、上下架和完整验证

**Files:**
- Create: `app/api/admin/photos/bulk/route.js`
- Modify: `components/photography/PhotoAdminClient.jsx`
- Create: `scripts/tests/photo-cms-e2e-contract.test.js`
- Modify: `docs/superpowers/plans/2026-09-28-photo-admin-verification.md`

- [ ] **Step 1: 写失败 API 测试** — 批量设置集合、元数据和 published；非管理员 403；部分失败返回逐项结果。
- [ ] **Step 2: 实现批量 API** — 白名单字段校验，集合关联幂等替换，禁止路径字段。
- [ ] **Step 3: 接入批量选择栏** — 选择多张并批量上架/下架、设置主题/Workshop、地点、日期和说明。
- [ ] **Step 4: 运行完整验证** — `pnpm test`、全量 Node 测试、`CONTENT_SOURCE=local pnpm build`。
- [ ] **Step 5: 手工验证** — 使用测试图片验证单张、多张、文件夹上传、重试、上下架和多集合显示；不删除现有生产内容。
- [ ] **Step 6: 更新操作文档** — 写明管理员配置、上传格式、批量流程和失败重试。

## Verification checklist

- 后台默认显示已经迁移的全部照片。
- 单张、多选和文件夹递归上传可用。
- 一张照片可以同时关联多个主题和多个 Workshop。
- 批量元数据和发布状态修改正确。
- 下架不删除图片，公开页面不再显示。
- 任何支持格式都会自动生成预览图并保留原图。
- 原图不出现在公开 API。
- 失败项可单独重试，不产生重复照片或孤儿对象。
