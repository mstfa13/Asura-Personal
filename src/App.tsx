import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Layout from "./components/Layout";
import Progress from "./pages/Progress";
import DailyActivities from "./pages/DailyActivities";
import Boxing from "./pages/Boxing";
import Gym from "./pages/Gym";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Oud from "./pages/Oud";
import Spanish from "./pages/Spanish";
import German from "./pages/German";
import ActivityTemplate from "./pages/ActivityTemplate";
import BoxingTemplatePage from "./pages/templates/BoxingTemplatePage";
import GymTemplatePage from "./pages/templates/GymTemplatePage";
import MusicTemplatePage from "./pages/templates/MusicTemplatePage";
import LanguageTemplatePage from "./pages/templates/LanguageTemplatePage";
import { useActivityStore } from "./lib/activityStore";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import AuthPage from "./pages/AuthPage";
import { useEffect } from "react";
import { api } from "./lib/api";

function CustomActivityRoute() {
  const { slug } = useParams();
  const entry = useActivityStore((s) => (slug ? s.customActivities[slug] : undefined));
  if (!slug || !entry) return <NotFound />;
  const template = entry.template || 'none';
  if (template === 'boxing') return <BoxingTemplatePage slug={slug} name={entry.name} />;
  if (template === 'gym') return <GymTemplatePage slug={slug} name={entry.name} />;
  if (template === 'music') return <MusicTemplatePage slug={slug} name={entry.name} />;
  if (template === 'language') return <LanguageTemplatePage slug={slug} name={entry.name} />;
  return <ActivityTemplate slug={slug} name={entry.name} />;
}

const queryClient = new QueryClient();

function Guard({ hiddenKey, children }: { hiddenKey: 'boxing'|'gym'|'oud'|'spanish'|'german'; children: JSX.Element }) {
  const isHidden = useActivityStore((s) => !!s.hiddenActivities[hiddenKey]);
  if (isHidden) return <NotFound />;
  return children;
}

function RouteGate({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  if (!token) return <AuthPage />;
  return children;
}

function ServerSync() {
  const { token } = useAuth();
  const hydrate = useActivityStore((s) => s.hydrateFromServer);
  const getSerializable = useActivityStore((s) => s.getSerializableState);
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const remote = await api<any>(`/state`, 'GET', undefined, token);
        if (remote) hydrate(remote);
      } catch {}
    })();
  }, [token, hydrate]);
  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => {
      const state = getSerializable();
      api(`/state`, 'PUT', state, token).catch(() => {});
    }, 4000);
    return () => clearInterval(id);
  }, [token, getSerializable]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ServerSync />
          <Layout>
          <Routes>
            <Route path="/" element={<RouteGate><Progress /></RouteGate>} />
            <Route path="/daily-activities" element={<RouteGate><DailyActivities /></RouteGate>} />
            <Route path="/boxing" element={<RouteGate><Guard hiddenKey="boxing"><Boxing /></Guard></RouteGate>} />
            <Route path="/gym" element={<RouteGate><Guard hiddenKey="gym"><Gym /></Guard></RouteGate>} />
            <Route path="/oud" element={<RouteGate><Guard hiddenKey="oud"><Oud /></Guard></RouteGate>} />
            <Route path="/spanish" element={<RouteGate><Guard hiddenKey="spanish"><Spanish /></Guard></RouteGate>} />
            <Route path="/german" element={<RouteGate><Guard hiddenKey="german"><German /></Guard></RouteGate>} />
            <Route path="/activity/:slug" element={<RouteGate><CustomActivityRoute /></RouteGate>} />
            <Route path="/settings" element={<RouteGate><Settings /></RouteGate>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
