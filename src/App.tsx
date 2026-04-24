import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import BookingLookup from "@/pages/BookingLookup";
import BookingDetail from "@/pages/BookingDetail";
import AdminPanel from "@/pages/AdminPanel";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>

        {/* Main layout wrapper */}
        <div style={{ 
          minHeight: "100vh", 
          display: "flex", 
          flexDirection: "column",
          backgroundColor: "#f4f6f9"
        }}>

          {/* Header */}
          <Header />

          {/* Page Content */}
          <div style={{ flex: 1, padding: "20px" }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lookup" element={<BookingLookup />} />
              <Route path="/booking/:id" element={<BookingDetail />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          {/* Footer */}
          <footer
            style={{
              backgroundColor: "#1f2937",
              color: "white",
              textAlign: "center",
              padding: "12px",
              fontSize: "14px"
            }}
          >
            © 2026 Booking Management System | Developed by Dinesh
          </footer>

        </div>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;