import { NextResponse } from "next/server";
import { getDashboardProjects, getDemoProjectId } from "@/lib/mock-db";
import { BUILD_INFO_NOTE } from "@/lib/constants";

export async function GET(): Promise<NextResponse> {
  const projects = getDashboardProjects();
  return NextResponse.json({
    projects,
    demoProjectId: getDemoProjectId(),
    info: BUILD_INFO_NOTE
  });
}
