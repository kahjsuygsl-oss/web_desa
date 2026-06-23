import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@desa/lib/auth";

/**
 * Lindungi semua route admin kecuali /login & aset Next.
 * Pengecekan ringan di edge: validasi tanda tangan JWT session.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const valid = await verifySession(token);

  if (!valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/login).*)"],
};
