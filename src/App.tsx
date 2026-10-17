import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { DashboardView } from './components/DashboardView';
import { ProjectAssessmentFlow } from './components/ProjectAssessmentFlow';
import { SyllabusGeneratorFlow } from './components/SyllabusGeneratorFlow';
import { CourseStudioFlow } from './components/CourseStudioFlow';
import { ProfilePortfolioView } from './components/ProfilePortfolioView';
import { AuthGuard } from './components/AuthGuard';
import { AuthModal } from './components/AuthModal';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-white flex flex-col text-[#202124]">
      <Header />

      <main className="flex-1 pb-16">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'dashboard' && (
          <AuthGuard
            viewName="Personal Skills Dashboard"
            description="Sign in with your email and password to access your personalized radar analytics, skill inventory, and system metrics."
          >
            <DashboardView />
          </AuthGuard>
        )}
        {activeTab === 'assess' && <ProjectAssessmentFlow />}
        {activeTab === 'learn' && <SyllabusGeneratorFlow />}
        {activeTab === 'teach' && <CourseStudioFlow />}
        {activeTab === 'profile' && (
          <AuthGuard
            viewName="Learner Profile & CV Portfolio"
            description="Sign in with your email and password to customize your personal profile, credentials, and exportable CV portfolio."
          >
            <ProfilePortfolioView />
          </AuthGuard>
        )}
      </main>

      {/* Global Supabase Auth Modal */}
      <AuthModal />

      {/* Quiet Google Account style Footer */}
      <footer className="border-t border-[#E0E0E0] bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5F6368]">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#202124]">Relational Skills Atlas</span>
            <span>·</span>
            <span>Relational Evaluative Practice & Systems Pedagogy</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('assess')}
              className="hover:text-[#202124] transition-colors"
            >
              Assess Project
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className="hover:text-[#202124] transition-colors"
            >
              Curated Syllabus
            </button>
            <button
              onClick={() => setActiveTab('teach')}
              className="hover:text-[#202124] transition-colors"
            >
              Course Studio
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="hover:text-[#202124] transition-colors"
            >
              Profile & CV
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
