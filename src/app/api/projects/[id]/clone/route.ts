import { NextResponse } from "next/server";
import { cloneProjectForUser, getCurrentUser } from "@/lib/mock-db";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const user = getCurrentUser();
  const result = cloneProjectForUser(context.params.id, user.id);

  if (!result.project) {
    return NextResponse.json(
      { message: result.error || "Unable to clone project." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    project: result.project,
    build: result.build
  });
}
