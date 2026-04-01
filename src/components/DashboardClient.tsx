"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { DashboardProject, GlobalStats } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";
import { useToast } from "@/components/ToastProvider";

interface DashboardResponse {
  projects: DashboardProject[];
  demoProjectId: string;
  info: string;
  user: {
    id: string;
    name: string;
  };
  stats: GlobalStats;
}

export function DashboardClient(): JSX.Element {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionProjectId, setActionProjectId] = useState("");
  const { notify } = useToast();

  const fetchDashboard = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load dashboard.");
      const payload = (await response.json()) as DashboardResponse;
      setData(payload);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Dashboard fetch failed.";
      notify(message, "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    let mounted = true;

    const run = async (): Promise<void> => {
      if (!mounted) return;
      await fetchDashboard();
    };

    run();
    const interval = setInterval(run, 8000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchDashboard]);

  const handleToggleVisibility = async (
    projectId: string,
    nextVisibility: "private" | "public"
  ): Promise<void> => {
    setActionProjectId(projectId);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set_visibility",
          visibility: nextVisibility
        })
      });
      const dataResponse = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(dataResponse.message || "Failed to update visibility.");
      }

      notify(
        `Project is now ${nextVisibility === "public" ? "public" : "private"}.`,
        "success"
      );
      await fetchDashboard();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Visibility update failed.", "error");
    } finally {
      setActionProjectId("");
    }
  };

  const handlePermanentSave = async (projectId: string): Promise<void> => {
    const confirmed = window.confirm(
      "Permanent save will lock this project forever and publish it publicly. Continue?"
    );
    if (!confirmed) return;

    setActionProjectId(projectId);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set_permanent"
        })
      });
      const dataResponse = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(dataResponse.message || "Failed to permanently save.");
      }

      notify("Project permanently saved and locked.", "success");
      await fetchDashboard();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Permanent save failed.", "error");
    } finally {
      setActionProjectId("");
    }
  };

  const handleDelete = async (projectId: string): Promise<void> => {
    const confirmed = window.confirm("Delete this project and related build data?");
    if (!confirmed) return;

    setActionProjectId(projectId);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE"
      });
      const dataResponse = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(dataResponse.message || "Failed to delete project.");
      }
      notify("Project deleted.", "success");
      await fetchDashboard();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Delete failed.", "error");
    } finally {
      setActionProjectId("");
    }
  };

  if (loading) {
    return <p className="muted">Loading projects...</p>;
  }

  if (!data || data.projects.length === 0) {
    return (
      <div className="card empty">
        <p>No projects yet.</p>
        <Link href="/projects/new" className="btn btn-primary">
          Create New Project
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      <div className="dashboard-top">
        <h2>Your Projects</h2>
        <Link href="/projects/new" className="btn btn-primary">
          Create New Project
        </Link>
      </div>

      <div className="stats-grid">
        <article className="card stat-card">
          <p className="muted">Total Converted Apps</p>
          <h3>{data.stats.totalProjects}</h3>
        </article>
        <article className="card stat-card">
          <p className="muted">Public Permanent Apps</p>
          <h3>{data.stats.totalPublicPermanentProjects}</h3>
        </article>
        <article className="card stat-card">
          <p className="muted">Successful Builds</p>
          <h3>{data.stats.totalSuccessfulBuilds}</h3>
        </article>
        <article className="card stat-card">
          <p className="muted">Total Downloads</p>
          <h3>{data.stats.totalDownloads}</h3>
        </article>
      </div>

      <p className="notice">{data.info}</p>
      <div className="cards-grid">
        {data.projects.map((item) => (
          <ProjectCard
            key={item.project.id}
            item={item}
            showDemoTag={item.project.id === data.demoProjectId}
            loadingActionProjectId={actionProjectId}
            onToggleVisibility={handleToggleVisibility}
            onPermanentSave={handlePermanentSave}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
