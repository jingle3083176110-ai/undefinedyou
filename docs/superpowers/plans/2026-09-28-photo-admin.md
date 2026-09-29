# 摄影后台管理页面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个 Supabase 邮箱登录保护的摄影后台，支持单张照片上传、预览图生成、私有原图保存和照片元数据维护。

**Architecture:** 浏览器通过 Supabase Auth 建立会话；Next.js 服务端 API 验证登录并使用服务端密钥处理 Storage 和 `photos` 表。公开预览与私有原图分桶保存，后台页面只消费安全的预览字段。

**Tech Stack:** Next.js App Router, React, Supabase Auth/Storage/PostgREST, sharp, Node test runner, pnpm.

---

### Task 1: Supabase Auth 会话基础

**Files:**
- Create: `lib/supabase/browser.js`
- Create: `lib/supabase/server.js`
- Create: `lib/supabase/admin.js`
- Create: `middleware.js`
- Test: `lib/supabase/auth.test.js`

- [ ] **Step 1: Write failing auth helper tests** — 验证未配置环境变量时报错、服务端客户端读取请求 Cookie、管理客户端只读取 `SUPABASE_SECRET_KEY`。
- [ ] **Step 2: Run `node --test lib/supabase/auth.test.js`** — 预期因模块不存在失败。
- [ ] **Step 3: Implement helpers** — 浏览器客户端使用 publishable key；服务端客户端使用 request/response Cookie；admin 客户端禁用 session persistence 和自动刷新。
- [ ] **Step 4: Add middleware protection** — `/photography/admin` 页面未登录时重定向 `/photography/login`；API 不用重定向而返回 401。
- [ ] **Step 5: Run auth tests and `pnpm build`** — 预期通过。

### Task 2: 登录页和后台页面骨架

**Files:**
- Create: `app/photography/login/page.jsx`
- Create: `app/photography/admin/page.jsx`
- Create: `components/photography/PhotoAdminClient.jsx`
- Create: `app/photography/admin/loading.jsx`
- Test: `components/photography/PhotoAdminClient.test.jsx`

- [ ] **Step 1: Write component tests** — 未登录显示登录表单；登录后显示上传区、元数据表单和照片列表容器。
- [ ] **Step 2: Implement email/password login** — 成功后刷新会话并导航到 `/photography/admin`；错误显示可读提示；提供退出登录。
- [ ] **Step 3: Implement admin shell** — 单页三段布局：上传区、信息区、列表区；沿用现有设计 token。
- [ ] **Step 4: Run component tests and local build**。

### Task 3: 服务端图片上传 API

**Files:**
- Create: `lib/photos/admin-storage.js`
- Create: `app/api/admin/photos/route.js`
- Test: `lib/photos/admin-storage.test.js`
- Test: `app/api/admin/photos/route.test.js`

- [ ] **Step 1: Write failing storage tests** — 测试文件类型/大小校验、ID 清理、预览 WebP 生成、路径拒绝。
- [ ] **Step 2: Implement storage service** — 使用 `sharp` 自动旋转、最大宽度 2000、WebP quality 82；生成 preview/original 路径；调用 Supabase Storage。
- [ ] **Step 3: Write API tests** — 未登录返回 401；缺文件或字段返回 400；成功调用上传和数据库写入；数据库失败清理两个对象。
- [ ] **Step 4: Implement POST route** — 解析 FormData、验证 Supabase 用户、上传预览和原图、upsert `photos`，只返回公开字段。
- [ ] **Step 5: Run focused tests** — `node --test lib/photos/admin-storage.test.js app/api/admin/photos/route.test.js`。

### Task 4: 照片列表、编辑和删除 API

**Files:**
- Create: `app/api/admin/photos/[id]/route.js`
- Modify: `components/photography/PhotoAdminClient.jsx`
- Test: `app/api/admin/photos/id-route.test.js`

- [ ] **Step 1: Write route tests** — 未登录拒绝；登录后 GET 只返回公开字段；PATCH 只允许元数据字段；DELETE 要求明确确认参数并删除 DB 与两个对象。
- [ ] **Step 2: Implement GET/PATCH/DELETE** — 所有操作验证用户；禁止客户端指定 Storage bucket/path；删除按数据库记录中的安全路径执行。
- [ ] **Step 3: Connect list and edit UI** — 列表分页/搜索，编辑表单提交 PATCH，删除使用二次确认。
- [ ] **Step 4: Run focused tests and build**。

### Task 5: 上传交互和端到端验证

**Files:**
- Modify: `components/photography/PhotoAdminClient.jsx`
- Create: `docs/superpowers/plans/2026-09-28-photo-admin-verification.md`

- [ ] **Step 1: Add drag/drop and preview** — 支持选择单张图片、显示尺寸/格式/大小、生成本地预览、禁用重复提交。
- [ ] **Step 2: Add progress/error states** — 显示上传阶段；失败显示原因并允许重试；成功清空表单并刷新列表。
- [ ] **Step 3: Run full checks** — `node --test lib/**/*.test.js app/**/*.test.js`、`CONTENT_SOURCE=local pnpm build`。
- [ ] **Step 4: Manually verify with a test image** — 登录、上传、编辑、刷新列表、确认预览可访问且原图匿名不可读。
- [ ] **Step 5: Document operating workflow** — 写明登录地址、上传步骤、删除风险和环境变量要求。

## Verification checklist

- 未登录不能进入后台或调用管理 API。
- 登录后单张图片能够完整上传并写入 `photos`。
- 预览图公开可读，原图桶保持私有。
- 失败流程清理已上传对象，不留下孤儿记录。
- API 永不返回 `original_path`。
- 重复 ID 使用更新，不产生重复行。
- 现有公开内容接口和本地构建继续通过。
