/**
 * On-demand revalidation endpoint.
 * Called by WordPress via webhook on post publish/update.
 *
 * Expected webhook payload (POST JSON):
 * {
 *   "secret": "your_revalidation_secret_token",
 *   "path": "/blog/my-post-slug"
 * }
 */

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { secret, path } = body;

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (!path) {
    return NextResponse.json(
      { message: "Path is required" },
      { status: 400 }
    );
  }

  revalidatePath(path);

  return NextResponse.json({ revalidated: true, path });
}
