"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BuildJob, Project } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { ProgressStepper } from "@/components/ProgressStepper";
import { useToast } from "@/components/ToastProvider";

interface BuildResponse {
  build: BuildJob;
  project?: Project;
  info: string;
}

export function BuildStatusClient({
  buildId
}: {
  buildId: string;
}): JSX.Element {
  const { notify } = useToast();
  const [payload, setPayload] = useState<BuildResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchBuild = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/builds/${buildId}`, { cache: "no-store" });

        if (response.status === 404) {
          if (mounted) {
            setNotFound(true);
            setLoading(false);
          }
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load build status.");
        }

        const data = (await response.json()) as BuildResponse;
        if (mounted) {
          setPayload(data);
          setLoading(false);
          setNotFound(false);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Build fetch failed.";
        notify(message, "error");
        if (mounted) setLoading(false);
      }
    };

    fetchBuild();
    const interval = setInterval(fetchBuild, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [buildId, notify]);

  if (loading) return <p className="muted">Loading build status...</p>;
  if (notFound || !payload?.build) {
    return (
      <div className="card">
        <h2>Build not found</h2>
        <Link href="/dashboard" className="btn btn-secondary">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const { build, project } = payload;

  return (
    <div className="build-layout">
      <section className="card">
        <div className="build-title">
          <h2>{project?.appName || "Build Job"}</h2>
          <StatusBadge status={build.status} />
        </div>
        <p className="mono">{project?.websiteUrl}</p>
        <p className="project-meta">
          <strong>Package:</strong> {project?.packageName}
        </p>
        <ProgressStepper status={build.status} />
        <p className="notice">{payload.info}</p>
      </section>

      <section className="card">
        <h3>Build Logs</h3>
        <div className="log-box">
          {build.buildLog.map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
      </section>

      <section className="card actions-row">
        {build.status === "success" && build.apkUrl ? (
          <a className="btn btn-primary" href={build.apkUrl} download>
            Download APK
          </a>
        ) : (
          <button className="btn btn-primary" disabled>
            APK Not Ready
          </button>
        )}
        {build.status === "success" && build.sourceZipUrl ? (
          <a className="btn btn-secondary" href={build.sourceZipUrl} download>
            Download Source ZIP
          </a>
        ) : null}
        <Link className="btn btn-link" href="/dashboard">
          Back to Dashboard
        </Link>
      </section>
    </div>
  );
}
