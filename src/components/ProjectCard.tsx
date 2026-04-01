import Link from "next/link";
import type { DashboardProject } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export function ProjectCard({
  item,
  showDemoTag = false
}: {
  item: DashboardProject;
  showDemoTag?: boolean;
}): JSX.Element {
  const { project, latestBuild } = item;

  return (
    <article className="card project-card">
      <div className="project-head">
        <h3>{project.appName}</h3>
        {showDemoTag ? <span className="demo-tag">Demo</span> : null}
      </div>
      <p className="project-url mono">{project.websiteUrl}</p>
      <p className="project-meta">
        <strong>Package:</strong> {project.packageName}
      </p>
      <p className="project-meta">
        <strong>Version:</strong> {project.versionName} ({project.versionCode})
      </p>
      <div className="project-actions">
        {latestBuild ? (
          <>
            <StatusBadge status={latestBuild.status} />
            <Link className="btn btn-link" href={`/builds/${latestBuild.id}`}>
              View Build
            </Link>
            {latestBuild.status === "success" && latestBuild.apkUrl ? (
              <a className="btn btn-primary" href={latestBuild.apkUrl} download>
                Download APK
              </a>
            ) : null}
          </>
        ) : (
          <span className="muted">No builds yet</span>
        )}
      </div>
    </article>
  );
}
