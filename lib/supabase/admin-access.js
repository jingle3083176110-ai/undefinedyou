export function isAdminEmail(email) {
  const allowed = String(process.env.ADMIN_EMAILS || "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  return allowed.length > 0 && allowed.includes(String(email || "").trim().toLowerCase());
}
