import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Lookup from "@/pages/Lookup";
import ManageIndex from "@/pages/ManageIndex";
import ManageDetail from "@/pages/ManageDetail";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/login" component={Login} />
        
        <Route path="/">
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        </Route>
        
        <Route path="/lookup">
          <ProtectedRoute><Lookup /></ProtectedRoute>
        </Route>
        
        <Route path="/manage">
          <ProtectedRoute><ManageIndex /></ProtectedRoute>
        </Route>
        
        <Route path="/manage/:pnr">
          <ProtectedRoute><ManageDetail /></ProtectedRoute>
        </Route>
        
        <Route path="/admin">
          <ProtectedRoute requireAdmin><Admin /></ProtectedRoute>
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
