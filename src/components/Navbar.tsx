import Link from "next/link";

export function Navbar(): JSX.Element {
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          WebToAPP
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/showcase">Showcase</Link>
          <Link href="/projects/new">Create Project</Link>
        </nav>
      </div>
    </header>
  );
}
