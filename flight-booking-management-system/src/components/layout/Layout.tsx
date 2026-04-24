import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAppStore } from "@/store/useAppStore";
import { Plane, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export function NavHeader() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/manage", label: "Manage Booking" },
    { href: "/lookup", label: "Lookup" },
  ];

  if (user?.role === "admin") {
    navLinks.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header className="bg-card border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <Plane className="w-6 h-6 text-primary" />
          <span className="font-serif font-bold text-xl text-primary">AeroPortal</span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {user && (
            <>
              <nav className="flex items-center gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      location === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                    data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="h-6 w-px bg-border mx-2" />
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground" data-testid="text-username">
                  {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="button-logout">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center">
          {user && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle className="text-left font-serif text-xl mb-6 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-primary" />
                  AeroPortal
                </SheetTitle>
                <div className="flex flex-col gap-4">
                  <div className="pb-4 border-b">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <nav className="flex flex-col gap-3">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        className={`text-sm font-medium ${
                          location === link.href ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <Button variant="ghost" className="justify-start mt-4 px-0" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const isLogin = location === "/login";
  
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {!isLogin && <NavHeader />}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
