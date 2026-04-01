import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DashboardClient } from "@/components/DashboardClient";

export default function DashboardPage(): JSX.Element {
  return (
    <>
      <Navbar />
      <main className="section">
        <div className="container">
          <h1>Dashboard</h1>
          <p className="muted">
            Your default demo project is preloaded and appears below.
          </p>
          <DashboardClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
