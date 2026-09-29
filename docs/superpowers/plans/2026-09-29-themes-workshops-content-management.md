# Themes 与 Workshops 内容管理 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将摄影后台的 Themes 与 Workshops 拆成两个独立的内容管理栏目，支持新增/编辑/发布/删除，并统一放大后台排版字号。

**Architecture:** 复用现有 `photo_collections` 表与 admin collection API，在摄影后台新增一个按 `collectionType` 参数工作的通用 CollectionManager 页面，导航分别进入 `theme` 和 `workshop` 视图。照片库继续使用集合关联，但选择器按类型分组。视觉调整集中在 `photo-admin.css`，不改公开摄影页面的信息架构。

**Tech Stack:** Next.js 15 App Router、React 19、Supabase、CSS、Node test runner。

---

### Task 1: 为集合 API 补齐可验证的类型与错误行为

**Files:**
- Modify: `app/api/admin/photo-collections/route.js`
- Modify: `app/api/admin/photo-collections/[id]/route.js`
- Test: `scripts/tests/photo-cms-data.test.js`

- [ ] **Step 1: 扩展失败场景测试**

在现有测试中增加：GET 使用 `type=workshop` 只返回 workshop；GET 使用非法 type 返回 400；POST 缺少 title 或使用非法 collection_type 返回 400；PATCH 无可编辑字段返回 400；DELETE 无 `confirm=true` 返回 400。

- [ ] **Step 2: 运行集合 API 测试确认新增断言先失败**

Run: `node --test scripts/tests/photo-cms-data.test.js`

Expected: 新增断言在当前行为不满足处失败，其余既有测试保持通过。

- [ ] **Step 3: 统一 API 的验证与数据库错误映射**

保持已有字段白名单，补充 slug/title 的空白字符串校验，并将 Supabase 唯一约束错误转换成 409、其余读写错误保持 500；PATCH 与 POST 使用同一套字段校验规则，DELETE 继续要求显式确认。

- [ ] **Step 4: 运行测试确认 API 行为通过**

Run: `node --test scripts/tests/photo-cms-data.test.js`

Expected: PASS。

- [ ] **Step 5: 提交 API 变更**

Run: `git add app/api/admin/photo-collections scripts/tests/photo-cms-data.test.js && git commit -m "test: harden photo collection admin validation"`

### Task 2: 创建通用 CollectionManager 与编辑抽屉

**Files:**
- Create: `components/photography/CollectionManager.jsx`
- Create: `components/photography/CollectionEditDrawer.jsx`
- Modify: `components/photography/PhotoAdminClient.jsx`
- Modify: `components/photography/PhotoAdminShell.jsx`
- Test: `components/photography/PhotoAdminClient.test.js`

- [ ] **Step 1: 写组件行为测试**

覆盖：导航传入 `theme` 后显示 Themes 标题；导航传入 `workshop` 后显示 Workshops 标题；点击新增显示空编辑抽屉；保存成功后列表出现新集合；集合类型固定为当前栏目类型；删除前必须确认。

- [ ] **Step 2: 运行组件测试确认先失败**

Run: `node --test components/photography/PhotoAdminClient.test.js`

Expected: 新增测试因不存在 CollectionManager/导航状态而失败。

- [ ] **Step 3: 实现通用管理器**

让 `CollectionManager` 接收 `collectionType`, `title`, `description`, `collections`, `photos`, `onReload`, `onCreate`, `onUpdate`, `onDelete`。列表显示封面、中文/英文标题、slug、已关联照片数量、发布状态和操作按钮；空状态提供“新增”按钮；加载、错误、保存和删除状态都通过可读的状态文本反馈。

- [ ] **Step 4: 实现编辑抽屉**

表单字段为 slug、title、title_zh、intro、intro_zh、date_range、location、location_zh、cover_photo_id、published。新增时隐藏或锁定 collection_type，提交时由管理器注入当前类型；编辑时保留原 id，表单提交期间禁用按钮，成功后关闭并刷新。

- [ ] **Step 5: 接入 PhotoAdminClient 与 Shell 导航**

在 `PhotoAdminClient` 增加 `collectionTypeView`、集合列表加载和 CRUD handlers；`navigate("theme")` 与 `navigate("workshop")` 分别进入管理视图，不再把它们转换成照片总览筛选。Shell 导航文案改为 Themes / Workshops，页标题与全局新增按钮随当前管理视图切换。

- [ ] **Step 6: 运行组件测试确认通过**

Run: `node --test components/photography/PhotoAdminClient.test.js`

Expected: PASS。

- [ ] **Step 7: 提交内容管理组件**

Run: `git add components/photography/CollectionManager.jsx components/photography/CollectionEditDrawer.jsx components/photography/PhotoAdminClient.jsx components/photography/PhotoAdminShell.jsx components/photography/PhotoAdminClient.test.js && git commit -m "feat: split themes and workshops admin sections"`

### Task 3: 让照片关联选择器按类型分组

**Files:**
- Modify: `components/photography/PhotoUploader.jsx`
- Modify: `components/photography/PhotoEditPanel.jsx`
- Modify: `components/photography/photo-admin.css`
- Test: `components/photography/PhotoAdminClient.test.js`

- [ ] **Step 1: 增加分组选择测试**

断言上传和编辑表单分别渲染 Themes 与 Workshops 分组，集合 checkbox 使用真实集合 id，已选状态保持不变。

- [ ] **Step 2: 运行测试确认先失败**

Run: `node --test components/photography/PhotoAdminClient.test.js`

Expected: 分组相关断言失败。

- [ ] **Step 3: 实现按 collection_type 分组**

将集合渲染拆为两个 fieldset，分别筛选 `collection_type === "theme"` 与 `collection_type === "workshop"`；无集合时显示该分组的空提示；保留现有 collectionIds 提交格式。

- [ ] **Step 4: 运行测试确认通过**

Run: `node --test components/photography/PhotoAdminClient.test.js`

Expected: PASS。

- [ ] **Step 5: 提交关联选择器变更**

Run: `git add components/photography/PhotoUploader.jsx components/photography/PhotoEditPanel.jsx components/photography/photo-admin.css components/photography/PhotoAdminClient.test.js && git commit -m "feat: group photo collection selectors by type"`

### Task 4: 统一后台字号与编辑感排版

**Files:**
- Modify: `components/photography/photo-admin.css`
- Modify: `app/globals.css` only if the admin font variables need a safe fallback

- [ ] **Step 1: 调整字号与间距变量**

将后台基础字号设为 `1rem`，正文和卡片描述设为 `1rem–1.0625rem`，辅助信息不低于 `0.875rem`；导航描述、表单标签、错误文本和状态文本分别提高到至少 `0.8rem`、`0.9rem`，同时增加卡片内边距、标题行高和章节间距。

- [ ] **Step 2: 完善两个独立栏目的视觉区分**

为 collection manager 增加栏目 eyebrow、说明段落、统计摘要、主按钮和列表卡片样式；Themes 使用现有橄榄色强调，Workshops 使用暖琥珀色的轻量状态标识，但保持同一套组件结构。

- [ ] **Step 3: 添加窄屏布局与 focus 状态检查**

在 640px 断点下将管理列表改为单列，抽屉占满宽度，主按钮保持可点击高度；所有按钮、输入、select 和 summary 保留现有 3px focus ring。

- [ ] **Step 4: 提交视觉调整**

Run: `git add components/photography/photo-admin.css app/globals.css && git commit -m "style: improve photography admin typography"`

### Task 5: 回归验证与构建

**Files:**
- Modify only files required by failing verification.

- [ ] **Step 1: 运行完整现有测试**

Run: `pnpm test`

Expected: 全部通过。

- [ ] **Step 2: 运行生产构建**

Run: `pnpm build`

Expected: Next.js build 成功，API 与页面无编译错误。

- [ ] **Step 3: 手动检查后台流程**

启动开发服务器并检查：进入 Themes、进入 Workshops、空状态新增、编辑、发布切换、删除确认、照片上传时按类型选择集合、窄屏导航和抽屉。只使用测试数据或已有内容，不删除真实用户照片。

- [ ] **Step 4: 对照设计说明做最终差距检查**

确认每条目标都有对应实现，尤其是两个独立栏目、独立新增入口、字号下限、加载/错误/重复提交状态和公开摄影页面不变。

- [ ] **Step 5: 汇总验证结果**

记录测试、构建和手动检查结果；若现有工作区已有无关失败，明确区分其来源，不覆盖或回滚用户已有改动。
