import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { DemoAPKCard } from "@/components/DemoAPKCard";
import { Footer } from "@/components/Footer";
import { DEFAULT_DEMO_WEBSITE_URL } from "@/lib/constants";

const features = [
  {
    title: "Project-based wrapper setup",
    description:
      "Configure app name, package, icon, splash, and WebView options per project."
  },
  {
    title: "Queue-friendly backend starter",
    description:
      "Create build jobs and track queued, processing, success, and failed states."
  },
  {
    title: "Worker-ready architecture",
    description:
      "Keep frontend and API on Vercel while APK builds run on Android-capable infrastructure."
  }
];

export default function HomePage(): JSX.Element {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Features</p>
              <h2>SaaS-ready starter</h2>
            </div>
            <div className="cards-grid">
              {features.map((item) => (
                <FeatureCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Try Demo APK</p>
              <h2>Default demo website is prefilled</h2>
              <p className="mono">{DEFAULT_DEMO_WEBSITE_URL}</p>
            </div>
            <DemoAPKCard />
            <article className="card sample-project">
              <h3>Sample Project Card</h3>
              <p>
                <strong>App Name:</strong> Abdullah Demo App
              </p>
              <p>
                <strong>Package Name:</strong> com.abdullah.demoapp
              </p>
              <p>
                <strong>Website URL:</strong> {DEFAULT_DEMO_WEBSITE_URL}
              </p>
              <p>
                <strong>Version:</strong> 1.0.0 (1)
              </p>
            </article>
          </div>
        </section>

        <section className="section faq">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">FAQ</p>
              <h2>Common questions</h2>
            </div>
            <div className="cards-grid">
              <article className="card">
                <h3>Does Vercel build APK files directly?</h3>
                <p>
                  No. Vercel serves frontend/API workloads. APK builds must run in separate Android-capable worker environments.
                </p>
              </article>
              <article className="card">
                <h3>Can this connect to Supabase or Firebase?</h3>
                <p>
                  Yes. The data layer is modular so you can swap the in-memory store for a managed database and storage provider.
                </p>
              </article>
              <article className="card">
                <h3>Is this ready for real wrapper generation?</h3>
                <p>
                  It is a production-oriented starter. Replace simulation with a real queue worker to generate and sign APK artifacts.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
