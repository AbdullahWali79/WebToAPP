"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DashboardProject } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";
import { useToast } from "@/components/ToastProvider";

interface DashboardResponse {
  projects: DashboardProject[];
  demoProjectId: string;
  info: string;
}

export function DashboardClient(): JSX.Element {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async (): Promise<void> => {
      try {
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load dashboard.");
        const payload = (await response.json()) as DashboardResponse;
        if (mounted) {
          setData(payload);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Dashboard fetch failed.";
        notify(message, "error");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 8000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [notify]);

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
      <p className="notice">{data.info}</p>
      <div className="cards-grid">
        {data.projects.map((item) => (
          <ProjectCard
            key={item.project.id}
            item={item}
            showDemoTag={item.project.id === data.demoProjectId}
          />
        ))}
      </div>
    </div>
  );
}
