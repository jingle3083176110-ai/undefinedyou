"use client";

import { useState } from "react";
import "./photo-admin.css";

const NAV_ITEMS = [
  { id: "overview", label: "摄影总览", description: "Overview" },
  { id: "library", label: "全部照片", description: "Library" },
  { id: "upload", label: "上传照片", description: "Upload" },
  { id: "theme", label: "Themes", description: "Themes" },
  { id: "workshop", label: "Workshops", description: "Workshops" },
  { id: "batch", label: "批量操作", description: "Batch actions" },
  { id: "settings", label: "设置", description: "Settings" },
];

export default function PhotoAdminShell({
  activeSection = "overview",
  pageTitle = "摄影总览",
  searchValue = "",
  onSearchChange,
  onNavigate,
  onPrimaryAction,
  primaryActionLabel,
  onSignOut,
  children,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  function navigate(section) {
    onNavigate?.(section);
    setDrawerOpen(false);
  }

  async function handleSignOut() {
    if (!onSignOut || signingOut) return;
    setSigningOut(true);
    setSignOutError("");
    try {
      await onSignOut();
    } catch (error) {
      setSignOutError(error?.message || "退出失败");
    } finally {
      setSigningOut(false);
    }
  }

  const resolvedPrimaryActionLabel = primaryActionLabel || (activeSection === "theme" ? "新增 Theme" : activeSection === "workshop" ? "新增 Workshop" : "上传照片");

  return (
    <div className="photo-admin-shell">
      <button
        type="button"
        className={`photo-admin-drawer-backdrop${drawerOpen ? " is-visible" : ""}`}
        aria-label="关闭导航"
        onClick={() => setDrawerOpen(false)}
        tabIndex={drawerOpen ? 0 : -1}
      />

      <aside
        id="photo-admin-sidebar"
        className={`photo-admin-sidebar${drawerOpen ? " is-open" : ""}`}
        aria-label="摄影后台导航"
      >
        <div className="photo-admin-sidebar-header">
          <button
            type="button"
            className="photo-admin-brand"
            onClick={() => navigate("overview")}
            aria-label="返回摄影总览"
          >
            <span className="photo-admin-brand-mark" aria-hidden="true">U/</span>
            <span>
              <strong>摄影档案室</strong>
              <small>Photo desk</small>
            </span>
          </button>
          <button
            type="button"
            className="photo-admin-close-button"
            aria-label="关闭导航"
            onClick={() => setDrawerOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav className="photo-admin-nav" aria-label="后台导航">
          <p className="photo-admin-nav-kicker">工作区</p>
          <ul>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`photo-admin-nav-item${isActive ? " is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => navigate(item.id)}
                  >
                    <span className="photo-admin-nav-label">{item.label}</span>
                    <span className="photo-admin-nav-description">{item.description}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="photo-admin-sidebar-footer">
          <p>摄影内容管理</p>
          <button
            type="button"
            className="photo-admin-signout"
            onClick={handleSignOut}
            disabled={!onSignOut || signingOut}
          >
            <span aria-hidden="true">↗</span>
            {signingOut ? "退出中…" : "退出登录"}
          </button>
          {signOutError ? <p className="photo-admin-signout-error" role="alert">{signOutError}</p> : null}
        </div>
      </aside>

      <div className="photo-admin-main">
        <header className="photo-admin-topbar">
          <div className="photo-admin-topbar-heading">
            <button
              type="button"
              className="photo-admin-mobile-toggle"
              aria-label="打开导航"
              aria-controls="photo-admin-sidebar"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <span aria-hidden="true">☰</span>
            </button>
            <div className="photo-admin-title">
              <p className="photo-admin-eyebrow">Photography / Admin</p>
              <h1>{pageTitle}</h1>
            </div>
          </div>

          <form
            className="photo-admin-search"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="photo-admin-global-search">在照片库中搜索</label>
            <span aria-hidden="true">⌕</span>
            <input
              id="photo-admin-global-search"
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="搜索照片、地点或 ID"
            />
          </form>

          <button
            type="button"
            className="photo-admin-primary-action"
            onClick={() => (onPrimaryAction ? onPrimaryAction() : navigate("upload"))}
          >
            <span aria-hidden="true">＋</span>
            {resolvedPrimaryActionLabel}
          </button>

          <details className="photo-admin-account">
            <summary aria-label="打开账号菜单">
              <span className="photo-admin-account-avatar" aria-hidden="true">U</span>
              <span className="photo-admin-account-label">账号</span>
              <span aria-hidden="true">⌄</span>
            </summary>
            <div className="photo-admin-account-menu">
              <p>当前账号</p>
              <button type="button" onClick={handleSignOut} disabled={!onSignOut || signingOut}>
                {signingOut ? "退出中…" : "退出登录"}
              </button>
            </div>
          </details>
        </header>

        <main id="photo-admin-main" className="photo-admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
