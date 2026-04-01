import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ProjectDetailClient } from "@/components/ProjectDetailClient";

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProjectDetailPage({
  params
}: ProjectDetailPageProps): JSX.Element {
  return (
    <>
      <Navbar />
      <main className="section">
        <div className="container slim">
          <h1>Project Details</h1>
          <p className="muted">
            Public permanent projects are read-only. Use Clone to create your own editable copy.
          </p>
          <ProjectDetailClient projectId={params.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
