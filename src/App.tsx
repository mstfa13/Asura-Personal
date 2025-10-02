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
import Debug from "./pages/Debug";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Progress />} />
            <Route path="/daily-activities" element={<DailyActivities />} />
            <Route path="/boxing" element={<Guard hiddenKey="boxing"><Boxing /></Guard>} />
            <Route path="/gym" element={<Guard hiddenKey="gym"><Gym /></Guard>} />
            <Route path="/oud" element={<Guard hiddenKey="oud"><Oud /></Guard>} />
            <Route path="/spanish" element={<Guard hiddenKey="spanish"><Spanish /></Guard>} />
            <Route path="/german" element={<Guard hiddenKey="german"><German /></Guard>} />
            <Route path="/activity/:slug" element={<CustomActivityRoute />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/debug" element={<Debug />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
