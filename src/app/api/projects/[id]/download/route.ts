import { NextRequest, NextResponse } from "next/server";
import {
  getCurrentUser,
  getDownloadInfo,
  incrementProjectDownload
} from "@/lib/mock-db";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const projectId = context.params.id;
  const buildId = request.nextUrl.searchParams.get("buildId") || undefined;
  const user = getCurrentUser();

  const downloadInfo = getDownloadInfo(projectId, user.id, buildId);
  if (!downloadInfo.apkUrl) {
    return NextResponse.json(
      { message: downloadInfo.error || "Download is unavailable." },
      { status: 400 }
    );
  }

  incrementProjectDownload(projectId);
  const target = new URL(downloadInfo.apkUrl, request.url);
  return NextResponse.redirect(target);
}
