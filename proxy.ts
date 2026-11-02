import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isMaintenanceMode } from "@/lib/maintenance";

// While in maintenance, serve the placeholder for every page URL (the address
// bar keeps the requested path). When off, /maintenance itself goes home.
export async function proxy(request: NextRequest) {
  const onMaintenancePage = request.nextUrl.pathname === "/maintenance";
  const maintenance = await isMaintenanceMode();

  if (!maintenance) {
    return onMaintenancePage
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }
  if (onMaintenancePage) return NextResponse.next();
  return NextResponse.rewrite(new URL("/maintenance", request.url));
}

export const config = {
  // Skip Next internals, API routes, static/proxied assets, and SEO files.
  matcher: [
    "/((?!_next/|api/|media/|fonts/|assets/|icon\\.png|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
