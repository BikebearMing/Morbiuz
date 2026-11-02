/**
 * On-demand revalidation endpoint.
 * Called by WordPress via webhook on post publish/update.
 *
 * Accepts POST JSON:
 *   { "secret": "...", "path": "/video-production/my-work" }  — single path
 *   { "secret": "...", "paths": ["/", "/about"] }              — multiple paths
 *   { "secret": "...", "all": true }                           — revalidate the whole site
 *
 * Also accepts GET with query params for simple webhook tools:
 *   /api/revalidate?secret=...&path=/
 */

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

function revalidate(secret: string | null, path: string | null, paths: string[] | null, all: boolean) {
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (all) {
    // Every page shares the root layout, so this invalidates the whole site.
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, paths: ["/ (all)"] });
  }

  const toRevalidate: string[] = [];

  if (paths && paths.length > 0) {
    toRevalidate.push(...paths);
  } else if (path) {
    toRevalidate.push(path);
  } else {
    return NextResponse.json({ message: "Provide path, paths, or all" }, { status: 400 });
  }

  toRevalidate.forEach((p) => revalidatePath(p));

  return NextResponse.json({ revalidated: true, paths: toRevalidate });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return revalidate(body.secret, body.path, body.paths, body.all === true);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  return revalidate(params.get("secret"), params.get("path"), null, params.get("all") === "true");
}
