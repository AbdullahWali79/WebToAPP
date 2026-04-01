import { NextResponse } from "next/server";
import { getBuildById, getCurrentUser, getProjectById } from "@/lib/mock-db";
import { BUILD_INFO_NOTE } from "@/lib/constants";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const user = getCurrentUser();
  const build = getBuildById(context.params.id);
  if (!build) {
    return NextResponse.json({ message: "Build not found." }, { status: 404 });
  }

  const project = getProjectById(build.projectId);
  if (
    project &&
    project.userId !== user.id &&
    project.visibility !== "public"
  ) {
    return NextResponse.json(
      { message: "You do not have access to this build." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    build,
    project,
    info: BUILD_INFO_NOTE
  });
}
