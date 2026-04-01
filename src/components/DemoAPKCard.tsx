"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_DEMO_PROJECT_ID, DEFAULT_DEMO_WEBSITE_URL } from "@/lib/constants";
import { useToast } from "@/components/ToastProvider";

export function DemoAPKCard(): JSX.Element {
  const router = useRouter();
  const { notify } = useToast();
  const [loading, setLoading] = useState(false);

  const generateDemo = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: DEFAULT_DEMO_PROJECT_ID })
      });

      if (!response.ok) {
        throw new Error("Unable to create demo build.");
      }

      const data = (await response.json()) as { build: { id: string } };
      notify("Demo build queued.", "success");
      router.push(`/builds/${data.build.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to queue demo build.";
      notify(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card demo-card">
      <div>
        <h3>Try Demo APK</h3>
        <p>Use the default demo site and generate a sample wrapper build instantly.</p>
        <p className="mono">{DEFAULT_DEMO_WEBSITE_URL}</p>
      </div>
      <button className="btn btn-primary" onClick={generateDemo} disabled={loading}>
        {loading ? "Queueing..." : "Generate Demo APK"}
      </button>
    </section>
  );
}
