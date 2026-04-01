import { NextResponse } from "next/server";
import { createBuildJob, listBuildJobs } from "@/lib/mock-db";

export async function GET(): Promise<NextResponse> {
  const builds = listBuildJobs();
  return NextResponse.json({ builds });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { projectId?: string };
    if (!body.projectId) {
      return NextResponse.json(
        { message: "projectId is required." },
        { status: 400 }
      );
    }

    const build = createBuildJob(body.projectId);
    if (!build) {
      return NextResponse.json(
        { message: "Project not found for this build request." },
        { status: 404 }
      );
    }

    return NextResponse.json({ build }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to create build job." },
      { status: 500 }
    );
  }
}
