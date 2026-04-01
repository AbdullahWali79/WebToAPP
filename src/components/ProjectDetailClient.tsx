"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BuildJob, Project } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/ToastProvider";

interface ProjectDetailResponse {
  project: Project;
  builds: BuildJob[];
  isOwner: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPermanentSave: boolean;
  viewer: {
    id: string;
    name: string;
  };
}

export function ProjectDetailClient({
  projectId
}: {
  projectId: string;
}): JSX.Element {
  const [payload, setPayload] = useState<ProjectDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    let mounted = true;
    const run = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          cache: "no-store"
        });
        if (!response.ok) throw new Error("Project not found.");
        const data = (await response.json()) as ProjectDetailResponse;
        if (mounted) setPayload(data);
      } catch (error) {
        notify(error instanceof Error ? error.message : "Failed to load project.", "error");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [notify, projectId]);

  const handleClone = async (): Promise<void> => {
    setCloning(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/clone`, {
        method: "POST"
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message || "Clone failed.");
      notify("Project cloned to dashboard.", "success");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Clone failed.", "error");
    } finally {
      setCloning(false);
    }
  };

  if (loading) return <p className="muted">Loading project...</p>;
  if (!payload?.project) return <p className="muted">Project not found.</p>;

  const latestSuccessBuild = payload.builds.find((build) => build.status === "success");

  return (
    <div className="build-layout">
      <section className="card">
        <div className="build-title">
          <h2>{payload.project.appName}</h2>
          <div className="project-flags">
            <span className="tiny-tag">{payload.project.visibility.toUpperCase()}</span>
            {payload.project.isPermanent ? (
              <span className="tiny-tag lock">PERMANENT</span>
            ) : null}
          </div>
        </div>
        <p className="mono">{payload.project.websiteUrl}</p>
        <p className="project-meta">
          <strong>Package:</strong> {payload.project.packageName}
        </p>
        <p className="project-meta">
          <strong>Downloads:</strong> {payload.project.downloadsCount}
        </p>
      </section>

      <section className="card">
        <h3>Build History</h3>
        <div className="history-list">
          {payload.builds.map((build) => (
            <div className="history-row" key={build.id}>
              <StatusBadge status={build.status} />
              <span className="mono">{build.id}</span>
              <Link className="btn btn-link" href={`/builds/${build.id}`}>
                Open
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="card actions-row">
        {latestSuccessBuild ? (
          <a
            className="btn btn-primary"
            href={`/api/projects/${payload.project.id}/download?buildId=${latestSuccessBuild.id}`}
          >
            Download APK
          </a>
        ) : (
          <button className="btn btn-primary" disabled>
            APK Not Ready
          </button>
        )}
        {!payload.isOwner ? (
          <button
            type="button"
            className="btn btn-secondary"
            disabled={cloning}
            onClick={handleClone}
          >
            {cloning ? "Cloning..." : "Clone Project"}
          </button>
        ) : null}
        <Link className="btn btn-link" href={payload.isOwner ? "/dashboard" : "/showcase"}>
          Back
        </Link>
      </section>
    </div>
  );
}
