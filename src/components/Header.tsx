import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  LayoutDashboard,
  Layers,
  BookOpen,
  GraduationCap,
  User as UserIcon,
  Download,
  RotateCcw,
  Sparkles,
  X,
  Check,
  LogOut,
  KeyRound,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { SupabaseConfigModal } from './SupabaseConfigModal';

export const Header: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    resetAllData,
    skills,
    projects,
    syllabi,
    courses,
    isAuthenticated,
    openAuthModal,
    signOut,
    isSupabaseConfigured,
  } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
        setConfirmReset(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportJSON = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      user,
      projects,
      skills,
      syllabi,
      courses,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relational-skills-atlas-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getInitials = (name: string) => {
    if (!name || !name.trim()) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name[0] || 'U').toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E0E0E0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 rounded-lg bg-[#1A73E8] flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-medium tracking-tight text-[#202124] leading-tight">
                Relational Skills Atlas
              </span>
              <span className="text-[11px] text-[#5F6368] hidden sm:inline">
                Systems Pedagogy & Skill Verification
              </span>
            </div>
          </div>

          {/* Navigation Links Zone */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'home'
                  ? 'text-[#1A73E8] bg-blue-50/60'
                  : 'text-[#5F6368] hover:text-[#202124] hover:bg-gray-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'text-[#1A73E8] bg-blue-50/60'
                  : 'text-[#5F6368] hover:text-[#202124] hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('assess')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'assess'
                  ? 'text-[#1A73E8] bg-blue-50/60'
                  : 'text-[#5F6368] hover:text-[#202124] hover:bg-gray-100'
              }`}
            >
              Assess Project
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'learn'
                  ? 'text-[#1A73E8] bg-blue-50/60'
                  : 'text-[#5F6368] hover:text-[#202124] hover:bg-gray-100'
              }`}
            >
              Learn Syllabus
            </button>
            <button
              onClick={() => setActiveTab('teach')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'teach'
                  ? 'text-[#1A73E8] bg-blue-50/60'
                  : 'text-[#5F6368] hover:text-[#202124] hover:bg-gray-100'
              }`}
            >
              Course Studio
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'text-[#1A73E8] bg-blue-50/60'
                  : 'text-[#5F6368] hover:text-[#202124] hover:bg-gray-100'
              }`}
            >
              Profile & CV
            </button>
          </nav>

          {/* Action & User Avatar Zone */}
          <div className="flex items-center gap-3 shrink-0 relative" ref={menuRef}>
            <button
              onClick={() => setActiveTab('assess')}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1A73E8] bg-blue-50 hover:bg-blue-100/70 border border-blue-200 rounded-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assess New Project</span>
            </button>

            {/* Supabase status indicator & config trigger */}
            <button
              onClick={() => setShowSupabaseModal(true)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/80'
              }`}
              title="Click to view or update Supabase database connection"
            >
              <Database className="w-3 h-3" />
              <span className="hidden sm:inline">Supabase:</span>
              <span>{isSupabaseConfigured ? 'Connected' : 'Setup'}</span>
            </button>

            {/* If not authenticated: Show Sign In button */}
            {!isAuthenticated ? (
              <button
                onClick={() => openAuthModal('signin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-md transition-colors shadow-xs"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <>
                {/* Google Profile Avatar Button */}
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-label="User profile and settings"
                  className="w-9 h-9 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-medium text-sm hover:ring-3 hover:ring-blue-100 transition-all focus:outline-hidden"
                  title={user.name ? `${user.name} (${user.email || 'No email'})` : 'Account & Profile settings'}
                >
                  {getInitials(user.name)}
                </button>

                {/* Google Account Profile Popup */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-[#E0E0E0] rounded-2xl shadow-xl p-5 z-50 text-[#202124] animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#5F6368] uppercase tracking-wider">Atlas Account</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {isSupabaseConfigured ? 'Supabase' : 'Session Active'}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="text-[#5F6368] hover:text-[#202124] p-1 rounded-full hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 py-4 border-b border-[#E0E0E0]">
                      <div className="w-14 h-14 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-medium text-xl shadow-xs">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-base text-[#202124] truncate">
                          {user.name || 'Learner Account'}
                        </span>
                        <span className="text-xs text-[#5F6368] truncate">
                          {user.email || 'Authenticated with Supabase'}
                        </span>
                        <span className="text-[11px] text-[#1A73E8] mt-0.5 truncate">
                          {user.targetRole || 'Personal Development & E-Learning'}
                        </span>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-b border-[#E0E0E0] text-center">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <span className="block text-sm font-semibold text-[#202124]">{skills.length}</span>
                        <span className="text-[11px] text-[#5F6368]">Skills</span>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <span className="block text-sm font-semibold text-[#202124]">{projects.length}</span>
                        <span className="text-[11px] text-[#5F6368]">Projects</span>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <span className="block text-sm font-semibold text-[#202124]">{syllabi.length}</span>
                        <span className="text-[11px] text-[#5F6368]">Syllabi</span>
                      </div>
                    </div>

                    {/* Profile actions */}
                    <div className="pt-3 space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-[#202124] hover:bg-gray-100 rounded-lg flex items-center gap-2.5 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-[#5F6368]" />
                        <span>Manage Profile & CV Wording</span>
                      </button>

                      <button
                        onClick={handleExportJSON}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-[#202124] hover:bg-gray-100 rounded-lg flex items-center gap-2.5 transition-colors"
                      >
                        <Download className="w-4 h-4 text-[#5F6368]" />
                        <span>Backup Atlas Data (.json)</span>
                      </button>

                      {confirmReset ? (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                          <span className="block text-xs font-medium text-red-800 mb-2">
                            Reset all data to default samples?
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                resetAllData();
                                setConfirmReset(false);
                                setShowProfileMenu(false);
                              }}
                              className="px-2.5 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                              Confirm Reset
                            </button>
                            <button
                              onClick={() => setConfirmReset(false)}
                              className="px-2.5 py-1 text-xs font-medium text-[#5F6368] hover:text-[#202124]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmReset(true)}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-[#5F6368] hover:bg-gray-100 rounded-lg flex items-center gap-2.5 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4 text-[#5F6368]" />
                          <span>Restore Default Practice Data</span>
                        </button>
                      )}

                      {/* Supabase Config button */}
                      <button
                        onClick={() => {
                          setShowSupabaseModal(true);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-[#202124] hover:bg-gray-100 rounded-lg flex items-center gap-2.5 transition-colors border-t border-gray-100 pt-2.5"
                      >
                        <Database className="w-4 h-4 text-emerald-600" />
                        <span>Supabase Connection Settings</span>
                      </button>

                      {/* Sign Out Button */}
                      <button
                        onClick={() => {
                          signOut();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2.5 transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out of Supabase</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Tab Strip */}
        <div className="md:hidden flex items-center overflow-x-auto py-2 border-t border-[#E0E0E0] gap-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${
              activeTab === 'home' ? 'bg-[#1A73E8] text-white' : 'text-[#5F6368] hover:bg-gray-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${
              activeTab === 'dashboard' ? 'bg-[#1A73E8] text-white' : 'text-[#5F6368] hover:bg-gray-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('assess')}
            className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${
              activeTab === 'assess' ? 'bg-[#1A73E8] text-white' : 'text-[#5F6368] hover:bg-gray-100'
            }`}
          >
            Assess Project
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${
              activeTab === 'learn' ? 'bg-[#1A73E8] text-white' : 'text-[#5F6368] hover:bg-gray-100'
            }`}
          >
            Learn Syllabus
          </button>
          <button
            onClick={() => setActiveTab('teach')}
            className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${
              activeTab === 'teach' ? 'bg-[#1A73E8] text-white' : 'text-[#5F6368] hover:bg-gray-100'
            }`}
          >
            Course Studio
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${
              activeTab === 'profile' ? 'bg-[#1A73E8] text-white' : 'text-[#5F6368] hover:bg-gray-100'
            }`}
          >
            Profile & CV
          </button>
        </div>
      </div>

      {/* Supabase Configuration Modal */}
      <SupabaseConfigModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />
    </header>
  );
};
