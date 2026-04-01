import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectForm } from "@/components/ProjectForm";
import { DEFAULT_DEMO_WEBSITE_URL } from "@/lib/constants";

export default function CreateProjectPage(): JSX.Element {
  return (
    <>
      <Navbar />
      <main className="section">
        <div className="container slim">
          <h1>Create Project</h1>
          <p className="muted">
            Website URL is prefilled with the demo website:{" "}
            <span className="mono">{DEFAULT_DEMO_WEBSITE_URL}</span>
          </p>
          <ProjectForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
