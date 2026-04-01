import { NextResponse } from "next/server";
import {
  deleteProject,
  getCurrentUser,
  getProjectWithBuilds,
  permanentSaveProject,
  setProjectVisibility
} from "@/lib/mock-db";
import type { ProjectVisibility } from "@/lib/types";

interface RouteContext {
  params: {
    id: string;
  };
}

const allowedVisibility = new Set(["private", "public"]);

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const user = getCurrentUser();
  const projectId = context.params.id;
  const result = getProjectWithBuilds(projectId, user.id);

  if (!result.project) {
    return NextResponse.json(
      { message: "Project not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...result,
    viewer: {
      id: user.id,
      name: user.name
    }
  });
}

export async function PATCH(
  request: Request,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const user = getCurrentUser();
    const body = (await request.json()) as {
      action?: "set_visibility" | "set_permanent";
      visibility?: ProjectVisibility;
    };

    if (body.action === "set_visibility") {
      if (!body.visibility || !allowedVisibility.has(body.visibility)) {
        return NextResponse.json(
          { message: "Visibility must be private or public." },
          { status: 400 }
        );
      }

      const result = setProjectVisibility(
        context.params.id,
        user.id,
        body.visibility
      );

      if (!result.project) {
        return NextResponse.json(
          { message: result.error || "Could not update project visibility." },
          { status: 400 }
        );
      }

      return NextResponse.json({ project: result.project });
    }

    if (body.action === "set_permanent") {
      const result = permanentSaveProject(context.params.id, user.id);
      if (!result.project) {
        return NextResponse.json(
          { message: result.error || "Could not permanently save this project." },
          { status: 400 }
        );
      }

      return NextResponse.json({ project: result.project });
    }

    return NextResponse.json(
      { message: "Invalid action." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to update project." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
): Promise<NextResponse> {
  const user = getCurrentUser();
  const result = deleteProject(context.params.id, user.id);

  if (!result.success) {
    return NextResponse.json(
      { message: result.error || "Failed to delete project." },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
