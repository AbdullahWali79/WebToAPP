import { NextResponse } from "next/server";
import { getProjectWithBuilds } from "@/lib/mock-db";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const projectId = context.params.id;
  const result = getProjectWithBuilds(projectId);

  if (!result.project) {
    return NextResponse.json(
      { message: "Project not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
