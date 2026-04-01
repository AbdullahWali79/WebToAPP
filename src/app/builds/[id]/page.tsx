import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BuildStatusClient } from "@/components/BuildStatusClient";

interface BuildStatusPageProps {
  params: {
    id: string;
  };
}

export default function BuildStatusPage({
  params
}: BuildStatusPageProps): JSX.Element {
  return (
    <>
      <Navbar />
      <main className="section">
        <div className="container slim">
          <h1>Build Status</h1>
          <BuildStatusClient buildId={params.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
