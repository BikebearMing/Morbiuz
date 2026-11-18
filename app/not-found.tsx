import Link from "next/link";

// Reuses the work-page header classes so the text clears the fixed nav and
// isn't black-on-black.
export default function NotFound() {
  return (
    <main>
      <header className="work-post-head">
        <div className="wrapper">
          <h1 className="h2-v2 orange">404 — Page Not Found</h1>
          <p className="body dark">The page you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="body orange">Go back home</Link>
        </div>
      </header>
    </main>
  );
}
