import { NextResponse } from "next/server";
import { getBuildById, getProjectById } from "@/lib/mock-db";
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
  const build = getBuildById(context.params.id);
  if (!build) {
    return NextResponse.json({ message: "Build not found." }, { status: 404 });
  }

  const project = getProjectById(build.projectId);
  return NextResponse.json({
    build,
    project,
    info: BUILD_INFO_NOTE
  });
}
