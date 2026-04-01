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
            Manage your own projects, set public visibility, permanently lock selected apps, or delete non-permanent projects.
          </p>
          <DashboardClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
