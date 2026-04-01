"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadField } from "@/components/UploadField";
import { useToast } from "@/components/ToastProvider";
import { DEFAULT_DEMO_WEBSITE_URL } from "@/lib/constants";

export function ProjectForm(): JSX.Element {
  const router = useRouter();
  const { notify } = useToast();

  const [websiteUrl, setWebsiteUrl] = useState(DEFAULT_DEMO_WEBSITE_URL);
  const [appName, setAppName] = useState("Abdullah Demo App");
  const [packageName, setPackageName] = useState("com.abdullah.demoapp");
  const [versionName, setVersionName] = useState("1.0.0");
  const [versionCode, setVersionCode] = useState(1);
  const [themeColor, setThemeColor] = useState("#0F766E");
  const [showLoader, setShowLoader] = useState(true);
  const [pullToRefresh, setPullToRefresh] = useState(true);
  const [openExternalInBrowser, setOpenExternalInBrowser] = useState(true);
  const [fileUploadSupport, setFileUploadSupport] = useState(true);
  const [orientation, setOrientation] = useState("portrait");
  const [fullscreen, setFullscreen] = useState(false);
  const [visibility, setVisibility] = useState("private");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [splashFile, setSplashFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (!iconFile) {
        notify("Please upload an app icon.", "error");
        setSubmitting(false);
        return;
      }

      const projectResponse = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl,
          appName,
          packageName,
          versionName,
          versionCode,
          themeColor,
          showLoader,
          pullToRefresh,
          openExternalInBrowser,
          fileUploadSupport,
          orientation,
          fullscreen,
          visibility,
          iconFileName: iconFile.name,
          iconMimeType: iconFile.type,
          splashFileName: splashFile?.name,
          splashMimeType: splashFile?.type
        })
      });

      const projectData = (await projectResponse.json()) as {
        project?: { id: string };
        message?: string;
      };

      if (!projectResponse.ok || !projectData.project) {
        throw new Error(projectData.message || "Failed to create project.");
      }

      const buildResponse = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: projectData.project.id })
      });

      const buildData = (await buildResponse.json()) as {
        build?: { id: string };
        message?: string;
      };
      if (!buildResponse.ok || !buildData.build) {
        throw new Error(buildData.message || "Failed to create build job.");
      }

      notify("Project saved and build queued.", "success");
      router.push(`/builds/${buildData.build.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit project.";
      notify(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>Create Project</h2>

      <div className="form-field">
        <label htmlFor="websiteUrl">Website URL</label>
        <input
          id="websiteUrl"
          type="url"
          value={websiteUrl}
          onChange={(event) => setWebsiteUrl(event.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="appName">App Name</label>
        <input
          id="appName"
          type="text"
          value={appName}
          onChange={(event) => setAppName(event.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="packageName">Package Name</label>
        <input
          id="packageName"
          type="text"
          value={packageName}
          onChange={(event) => setPackageName(event.target.value)}
          required
        />
      </div>

      <div className="row-2">
        <div className="form-field">
          <label htmlFor="versionName">Version Name</label>
          <input
            id="versionName"
            type="text"
            value={versionName}
            onChange={(event) => setVersionName(event.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="versionCode">Version Code</label>
          <input
            id="versionCode"
            type="number"
            value={versionCode}
            onChange={(event) => setVersionCode(Number(event.target.value))}
            min={1}
            required
          />
        </div>
      </div>

      <UploadField
        id="iconUpload"
        label="App Icon Upload"
        helperText="PNG/JPG recommended. Required."
        file={iconFile}
        onChange={setIconFile}
      />

      <UploadField
        id="splashUpload"
        label="Splash Screen Upload"
        helperText="Optional splash image."
        file={splashFile}
        onChange={setSplashFile}
      />

      <div className="form-field">
        <label htmlFor="themeColor">Theme Colour</label>
        <div className="color-row">
          <input
            id="themeColor"
            type="color"
            value={themeColor}
            onChange={(event) => setThemeColor(event.target.value)}
          />
          <span className="mono">{themeColor}</span>
        </div>
      </div>

      <div className="row-2">
        <label className="switch-field">
          <input
            type="checkbox"
            checked={showLoader}
            onChange={(event) => setShowLoader(event.target.checked)}
          />
          Loader Toggle
        </label>

        <label className="switch-field">
          <input
            type="checkbox"
            checked={pullToRefresh}
            onChange={(event) => setPullToRefresh(event.target.checked)}
          />
          Pull To Refresh Toggle
        </label>

        <label className="switch-field">
          <input
            type="checkbox"
            checked={openExternalInBrowser}
            onChange={(event) => setOpenExternalInBrowser(event.target.checked)}
          />
          Open External Links in Browser
        </label>

        <label className="switch-field">
          <input
            type="checkbox"
            checked={fileUploadSupport}
            onChange={(event) => setFileUploadSupport(event.target.checked)}
          />
          File Upload Support
        </label>
      </div>

      <div className="row-2">
        <div className="form-field">
          <label htmlFor="orientation">Orientation Option</label>
          <select
            id="orientation"
            value={orientation}
            onChange={(event) => setOrientation(event.target.value)}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <label className="switch-field align-end">
          <input
            type="checkbox"
            checked={fullscreen}
            onChange={(event) => setFullscreen(event.target.checked)}
          />
          Fullscreen Option
        </label>
      </div>

      <div className="form-field">
        <label htmlFor="visibility">Project Visibility</label>
        <select
          id="visibility"
          value={visibility}
          onChange={(event) => setVisibility(event.target.value)}
        >
          <option value="private">Private (only me)</option>
          <option value="public">Public (read-only for others)</option>
        </select>
        <p className="muted form-help">
          Permanent save can be enabled later from dashboard. Permanent projects become locked and cannot be edited/deleted by users.
        </p>
      </div>

      <button type="submit" className="btn btn-primary full" disabled={submitting}>
        {submitting ? "Creating Project..." : "Save Project & Start Build"}
      </button>
    </form>
  );
}
