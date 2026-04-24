import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAppStore } from "@/store/useAppStore";

export function ProtectedRoute({ children, requireAdmin }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const user = useAppStore((state) => state.user);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    } else if (requireAdmin && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, requireAdmin, setLocation]);

  if (!user || (requireAdmin && user.role !== "admin")) {
    return null; // Or a loading spinner while redirecting
  }

  return <>{children}</>;
}
