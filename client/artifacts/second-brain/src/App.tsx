import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/app-context";
import { useAuth } from "@/hooks/use-auth-wrapper";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Tasks from "@/pages/tasks";
import Notes from "@/pages/notes";
import Tweets from "@/pages/tweets";
import Videos from "@/pages/videos";
import TagsFavorites from "@/pages/tags-favorites";
import Account from "@/pages/account";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/tasks">{() => <ProtectedRoute component={Tasks} />}</Route>
      <Route path="/notes">{() => <ProtectedRoute component={Notes} />}</Route>
      <Route path="/tweets">{() => <ProtectedRoute component={Tweets} />}</Route>
      <Route path="/videos">{() => <ProtectedRoute component={Videos} />}</Route>
      <Route path="/tags-favorites">{() => <ProtectedRoute component={TagsFavorites} />}</Route>
      <Route path="/account">{() => <ProtectedRoute component={Account} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
