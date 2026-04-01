import type { BuildStatus } from "@/lib/types";

const statusLabels: Record<BuildStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  success: "Success",
  failed: "Failed"
};

export function StatusBadge({ status }: { status: BuildStatus }): JSX.Element {
  return <span className={`status-badge status-${status}`}>{statusLabels[status]}</span>;
}
