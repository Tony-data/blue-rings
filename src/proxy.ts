import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, safeEqual, tokenFor } from "@/lib/auth-token";

/**
 * Runs before every page. Anyone without a valid session cookie is sent to
 * /login. Fails closed: if SITE_PASSWORD isn't set, nobody gets in.
 */
export async function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (password && token && safeEqual(token, await tokenFor(password))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Everything except the login page, framework assets, brand images and icons.
    "/((?!login|_next/static|_next/image|brand/|icon\\.png|apple-icon\\.png|robots\\.txt|favicon\\.ico).*)",
  ],
};
