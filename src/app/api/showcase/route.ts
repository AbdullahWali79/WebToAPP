import { NextResponse } from "next/server";
import { getCurrentUser, getGlobalStats, getShowcaseProjects } from "@/lib/mock-db";

export async function GET(): Promise<NextResponse> {
  const user = getCurrentUser();
  const projects = getShowcaseProjects(user.id);
  const stats = getGlobalStats();

  return NextResponse.json({
    projects,
    stats
  });
}
