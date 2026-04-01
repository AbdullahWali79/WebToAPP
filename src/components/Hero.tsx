import Link from "next/link";
import { DEFAULT_DEMO_WEBSITE_URL } from "@/lib/constants";

export function Hero(): JSX.Element {
  return (
    <section className="hero section">
      <div className="container hero-grid">
        <div>
          <p className="eyebrow">Web-to-Android wrapper platform</p>
          <h1>Convert Your Website into an Android App</h1>
          <p className="hero-copy">
            Launch APK wrappers with project presets, build tracking, and a queue-ready backend architecture.
          </p>
          <div className="hero-actions">
            <Link href="/projects/new" className="btn btn-primary">
              Create Project
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              Open Dashboard
            </Link>
          </div>
          <div className="note-card">
            <p className="note-title">Default demo website</p>
            <code>{DEFAULT_DEMO_WEBSITE_URL}</code>
          </div>
        </div>
        <div className="hero-panel">
          <h3>Production flow</h3>
          <ol>
            <li>Save project settings in backend</li>
            <li>Create build job in queue</li>
            <li>Run Android build on external worker</li>
            <li>Return APK URL when done</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
