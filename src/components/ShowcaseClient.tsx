"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { GlobalStats, ShowcaseProject } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/ToastProvider";

interface ShowcaseResponse {
  projects: ShowcaseProject[];
  stats: GlobalStats;
}

export function ShowcaseClient(): JSX.Element {
  const [data, setData] = useState<ShowcaseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloneBusyId, setCloneBusyId] = useState("");
  const { notify } = useToast();

  const fetchShowcase = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch("/api/showcase", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load showcase.");
      const payload = (await response.json()) as ShowcaseResponse;
      setData(payload);
    } catch (error) {
      notify(
        error instanceof Error ? error.message : "Showcase loading failed.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchShowcase();
  }, [fetchShowcase]);

  const handleClone = async (projectId: string): Promise<void> => {
    setCloneBusyId(projectId);
    try {
      const response = await fetch(`/api/projects/${projectId}/clone`, {
        method: "POST"
      });
      const payload = (await response.json()) as {
        message?: string;
        build?: { id: string };
      };
      if (!response.ok) {
        throw new Error(payload.message || "Clone failed.");
      }
      notify("Project cloned to your dashboard and build queued.", "success");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Clone failed.", "error");
    } finally {
      setCloneBusyId("");
    }
  };

  if (loading) return <p className="muted">Loading public showcase...</p>;
  if (!data || data.projects.length === 0) {
    return <p className="muted">No public projects yet.</p>;
  }

  return (
    <div className="dashboard-grid">
      <div className="stats-grid">
        <article className="card stat-card">
          <p className="muted">Community Converted Apps</p>
          <h3>{data.stats.totalProjects}</h3>
        </article>
        <article className="card stat-card">
          <p className="muted">Public Permanent Apps</p>
          <h3>{data.stats.totalPublicPermanentProjects}</h3>
        </article>
        <article className="card stat-card">
          <p className="muted">Total Downloads</p>
          <h3>{data.stats.totalDownloads}</h3>
        </article>
      </div>

      <div className="cards-grid">
        {data.projects.map((item) => (
          <article className="card project-card" key={item.project.id}>
            <div className="project-head">
              <h3>{item.project.appName}</h3>
              <div className="project-flags">
                <span className="tiny-tag">PUBLIC</span>
                <span className="tiny-tag lock">PERMANENT</span>
              </div>
            </div>
            <p className="project-meta">
              <strong>Creator:</strong> {item.ownerName}
            </p>
            <p className="mono project-url">{item.project.websiteUrl}</p>
            <p className="project-meta">
              <strong>Package:</strong> {item.project.packageName}
            </p>
            <p className="project-meta">
              <strong>Downloads:</strong> {item.project.downloadsCount}
            </p>
            <div className="project-actions">
              {item.latestBuild ? <StatusBadge status={item.latestBuild.status} /> : null}
              {item.latestBuild?.status === "success" ? (
                <a
                  className="btn btn-primary"
                  href={`/api/projects/${item.project.id}/download?buildId=${item.latestBuild.id}`}
                >
                  Download APK
                </a>
              ) : null}
              <button
                type="button"
                className="btn btn-secondary"
                disabled={cloneBusyId === item.project.id}
                onClick={() => handleClone(item.project.id)}
              >
                {cloneBusyId === item.project.id ? "Cloning..." : "Clone Project"}
              </button>
              <Link className="btn btn-link" href={`/projects/${item.project.id}`}>
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
