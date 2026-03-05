
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ActingPage from "./pages/ActingPage";
import OratoryPage from "./pages/OratoryPage";
import ActingShowreelPage from "./pages/ActingShowreelPage";
import ActingCardsPage from "./pages/ActingCardsPage";
import AdminPage from "./pages/AdminPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ReviewsPage from "./pages/ReviewsPage";
import TeamPage from "./pages/TeamPage";
import TeacherPage from "./pages/TeacherPage";
import ContactsPage from "./pages/ContactsPage";
import MetrikaGoalPage from "./pages/MetrikaGoalPage";

import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { saveUTMToStorage } from "./lib/utm";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import { ContentProvider } from "./contexts/ContentContext";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    saveUTMToStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ContentProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/acting" element={<ActingPage />} />
                <Route path="/oratory" element={<OratoryPage />} />
                <Route path="/acting-cards" element={<ActingCardsPage />} />
                <Route path="/showreel" element={<ActingShowreelPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/teacher" element={<TeacherPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/metrika-goal" element={<MetrikaGoalPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ContentProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;