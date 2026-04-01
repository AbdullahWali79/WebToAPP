"use client";

import Link from "next/link";
import type { DashboardProject } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

interface ProjectCardProps {
  item: DashboardProject;
  showDemoTag?: boolean;
  loadingActionProjectId?: string;
  onToggleVisibility?: (projectId: string, nextVisibility: "private" | "public") => void;
  onPermanentSave?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
}

export function ProjectCard({
  item,
  showDemoTag = false,
  loadingActionProjectId,
  onToggleVisibility,
  onPermanentSave,
  onDelete
}: ProjectCardProps): JSX.Element {
  const { project, latestBuild, isOwner } = item;
  const isBusy = loadingActionProjectId === project.id;
  const nextVisibility = project.visibility === "private" ? "public" : "private";

  return (
    <article className="card project-card">
      <div className="project-head">
        <h3>{project.appName}</h3>
        <div className="project-flags">
          {showDemoTag ? <span className="demo-tag">Demo</span> : null}
          <span className="tiny-tag">{project.visibility.toUpperCase()}</span>
          {project.isPermanent ? <span className="tiny-tag lock">PERMANENT</span> : null}
        </div>
      </div>

      <p className="project-url mono">{project.websiteUrl}</p>
      <p className="project-meta">
        <strong>Package:</strong> {project.packageName}
      </p>
      <p className="project-meta">
        <strong>Version:</strong> {project.versionName} ({project.versionCode})
      </p>
      <p className="project-meta">
        <strong>Downloads:</strong> {project.downloadsCount}
      </p>

      <div className="project-actions">
        {latestBuild ? (
          <>
            <StatusBadge status={latestBuild.status} />
            <Link className="btn btn-link" href={`/builds/${latestBuild.id}`}>
              View Build
            </Link>
            <Link className="btn btn-link" href={`/projects/${project.id}`}>
              Open
            </Link>
            {latestBuild.status === "success" && latestBuild.apkUrl ? (
              <a
                className="btn btn-primary"
                href={`/api/projects/${project.id}/download?buildId=${latestBuild.id}`}
              >
                Download APK
              </a>
            ) : null}
          </>
        ) : (
          <span className="muted">No builds yet</span>
        )}
      </div>

      {isOwner ? (
        <div className="project-admin-actions">
          {!project.isPermanent ? (
            <>
              <button
                type="button"
                className="btn btn-link"
                disabled={isBusy}
                onClick={() => onToggleVisibility?.(project.id, nextVisibility)}
              >
                {project.visibility === "private" ? "Make Public" : "Make Private"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isBusy}
                onClick={() => onPermanentSave?.(project.id)}
              >
                Permanent Save
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={isBusy}
                onClick={() => onDelete?.(project.id)}
              >
                Delete
              </button>
            </>
          ) : (
            <p className="muted">
              Permanent mode active: project is locked and publicly read-only.
            </p>
          )}
        </div>
      ) : (
        <p className="muted">
          This is a public project. You can view or clone, but cannot edit/delete it.
        </p>
      )}
    </article>
  );
}
