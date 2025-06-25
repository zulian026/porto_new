// middleware.ts (di root project)
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (req.nextUrl.pathname === "/admin" && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
