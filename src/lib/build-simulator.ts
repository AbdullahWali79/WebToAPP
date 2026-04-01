import type { BuildJob } from "@/lib/types";

const QUEUED_DURATION_MS = 8_000;
const PROCESSING_DURATION_MS = 28_000;

function appendLogOnce(job: BuildJob, message: string): void {
  if (!job.buildLog.includes(message)) {
    job.buildLog.push(message);
  }
}

function shouldFailBuild(jobId: string): boolean {
  const lastChar = jobId.trim().slice(-1);
  return lastChar === "0" || lastChar === "5";
}

// This simulation models an external Android build worker lifecycle.
// In production, replace this with real queue + worker updates.
export function advanceBuildJob(job: BuildJob): BuildJob {
  if (job.status === "success" || job.status === "failed") return job;

  const elapsedMs = Date.now() - new Date(job.createdAt).getTime();

  appendLogOnce(job, "Job accepted by backend API.");
  appendLogOnce(job, "Waiting for Android-capable worker assignment.");

  if (elapsedMs < QUEUED_DURATION_MS) {
    job.status = "queued";
    job.updatedAt = new Date().toISOString();
    return job;
  }

  if (elapsedMs < PROCESSING_DURATION_MS) {
    job.status = "processing";
    appendLogOnce(job, "Worker started build environment.");
    appendLogOnce(job, "Generating WebView wrapper template.");
    appendLogOnce(job, "Applying app metadata (name, package, icon, splash).");
    appendLogOnce(job, "Building unsigned APK artifact.");
    job.updatedAt = new Date().toISOString();
    return job;
  }

  if (shouldFailBuild(job.id)) {
    job.status = "failed";
    appendLogOnce(job, "Build failed during APK signing.");
    appendLogOnce(job, "Please retry or inspect worker logs.");
    job.updatedAt = new Date().toISOString();
    return job;
  }

  job.status = "success";
  appendLogOnce(job, "Signing APK and packaging source archive.");
  appendLogOnce(job, "Build complete.");

  if (!job.apkUrl) {
    job.apkUrl = "/downloads/generated-app.apk";
  }
  if (!job.sourceZipUrl) {
    job.sourceZipUrl = "/downloads/generated-app-source.zip";
  }

  job.updatedAt = new Date().toISOString();
  return job;
}
