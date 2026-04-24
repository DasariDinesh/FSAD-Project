import { Plane } from "lucide-react";
import { Link, useLocation } from "wouter";

export function NavHeader() {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Plane className="w-6 h-6 text-primary" />
          <span className="font-serif font-semibold text-lg">AeroPortal</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">Login</Link>
        </div>
      </div>
    </header>
  );
}
