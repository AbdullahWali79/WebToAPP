import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ShowcaseClient } from "@/components/ShowcaseClient";

export default function ShowcasePage(): JSX.Element {
  return (
    <>
      <Navbar />
      <main className="section">
        <div className="container">
          <h1>Public Showcase</h1>
          <p className="muted">
            Public permanent projects are read-only. Anyone can inspect and download, but only clone into a new personal project.
          </p>
          <ShowcaseClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
