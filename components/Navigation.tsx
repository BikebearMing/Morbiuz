import Link from "next/link";

export function Navigation() {
  return (
    <header>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>
      </nav>
    </header>
  );
}
