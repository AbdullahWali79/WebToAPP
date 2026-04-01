import { NextResponse } from "next/server";
import { createProject, getCurrentUser, listProjects } from "@/lib/mock-db";
import { isImageMimeType, isValidPackageName, isValidVersionName, isValidWebsiteUrl } from "@/lib/validators";
import type { ProjectInput } from "@/lib/types";

const allowedOrientations = new Set(["portrait", "landscape", "auto"]);
const allowedVisibility = new Set(["private", "public"]);

export async function GET(): Promise<NextResponse> {
  const projects = listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as Partial<ProjectInput>;

    if (!body.appName?.trim()) {
      return NextResponse.json(
        { message: "App name is required." },
        { status: 400 }
      );
    }

    if (!body.websiteUrl || !isValidWebsiteUrl(body.websiteUrl)) {
      return NextResponse.json(
        { message: "Website URL must be valid and start with http:// or https://." },
        { status: 400 }
      );
    }

    if (!body.packageName || !isValidPackageName(body.packageName)) {
      return NextResponse.json(
        { message: "Package name must follow Android format (example: com.example.app)." },
        { status: 400 }
      );
    }

    if (!body.versionName || !isValidVersionName(body.versionName)) {
      return NextResponse.json(
        { message: "Version name must be valid (example: 1.0.0)." },
        { status: 400 }
      );
    }

    if (
      body.versionCode === undefined ||
      Number.isNaN(Number(body.versionCode)) ||
      Number(body.versionCode) < 1 ||
      !Number.isInteger(Number(body.versionCode))
    ) {
      return NextResponse.json(
        { message: "Version code must be a positive number." },
        { status: 400 }
      );
    }

    if (body.iconFileName && !isImageMimeType(body.iconMimeType)) {
      return NextResponse.json(
        { message: "App icon must be an image file." },
        { status: 400 }
      );
    }

    if (body.splashFileName && !isImageMimeType(body.splashMimeType)) {
      return NextResponse.json(
        { message: "Splash screen must be an image file." },
        { status: 400 }
      );
    }

    if (body.orientation && !allowedOrientations.has(body.orientation)) {
      return NextResponse.json(
        { message: "Orientation must be portrait, landscape, or auto." },
        { status: 400 }
      );
    }

    if (body.visibility && !allowedVisibility.has(body.visibility)) {
      return NextResponse.json(
        { message: "Visibility must be private or public." },
        { status: 400 }
      );
    }

    const user = getCurrentUser();
    const project = createProject({
      websiteUrl: body.websiteUrl,
      appName: body.appName,
      packageName: body.packageName,
      versionName: body.versionName,
      versionCode: Number(body.versionCode),
      themeColor: body.themeColor || "#0F766E",
      showLoader: Boolean(body.showLoader),
      pullToRefresh: Boolean(body.pullToRefresh),
      openExternalInBrowser: Boolean(body.openExternalInBrowser),
      fileUploadSupport: Boolean(body.fileUploadSupport),
      orientation: body.orientation || "portrait",
      fullscreen: Boolean(body.fullscreen),
      iconFileName: body.iconFileName,
      iconMimeType: body.iconMimeType,
      splashFileName: body.splashFileName,
      splashMimeType: body.splashMimeType,
      visibility: body.visibility
    }, user.id);

    return NextResponse.json({ project }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to create project." },
      { status: 500 }
    );
  }
}
