import { NextResponse } from "next/server";
import {
  getCurrentUser,
  getDashboardProjects,
  getDemoProjectId,
  getGlobalStats
} from "@/lib/mock-db";
import { BUILD_INFO_NOTE } from "@/lib/constants";

export async function GET(): Promise<NextResponse> {
  const user = getCurrentUser();
  const projects = getDashboardProjects(user.id);
  const stats = getGlobalStats();

  return NextResponse.json({
    projects,
    demoProjectId: getDemoProjectId(),
    info: BUILD_INFO_NOTE,
    user: {
      id: user.id,
      name: user.name
    },
    stats
  });
}
