import { NextResponse } from "next/server.js";
import { createServerClient } from "@supabase/ssr";
import { isAdminEmail } from "./lib/supabase/admin-access.js";

export async function middleware(request) {
  const pathname = request.nextUrl?.pathname || new URL(request.url).pathname;
  const isPage = pathname === "/photography/admin" || pathname.startsWith("/photography/admin/") || pathname === "/photography/manage" || pathname.startsWith("/photography/manage/");
  const isApi = pathname === "/api/admin" || pathname.startsWith("/api/admin/");
  if (!isPage && !isApi) return NextResponse.next();

  let response = NextResponse.next({ request });
  let user = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
      cookies: {
        getAll: () => request.cookies?.getAll?.() || [],
        setAll: (values) => values.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
      },
    });
    ({ data: { user } } = await client.auth.getUser());
  }
  if (user && isAdminEmail(user.email)) return response;
  if (user && !isAdminEmail(user.email) && !process.env.ADMIN_EMAILS) {
    if (isApi) return NextResponse.json({ error: "Admin access is not configured" }, { status: 403 });
    return NextResponse.redirect(new URL("/photography/login?error=admin-config", request.url));
  }
  if (user) {
    if (isApi) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.redirect(new URL("/photography/login?error=forbidden", request.url));
  }
  if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.redirect(new URL("/photography/login", request.url));
}

export const config = { matcher: ["/photography/admin/:path*", "/photography/manage/:path*", "/api/admin/:path*"] };
