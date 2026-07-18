import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container flex flex-col items-center gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <Logo className="text-foreground" />
        <p>Prototype build — no accounts, no data stored.</p>
        <Link href="/platform" className="transition-colors hover:text-foreground">
          Open Platform →
        </Link>
      </div>
    </footer>
  );
}
