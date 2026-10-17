import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateCvWordingLocally } from '../lib/generators';
import {
  User as UserIcon,
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Printer,
  Edit3,
  CheckCircle2,
  Share2,
  Award,
  Compass,
  Info,
} from 'lucide-react';

export const ProfilePortfolioView: React.FC = () => {
  const { user, updateUser, skills, projects } = useApp();

  // Tab: 'profile' | 'dossier'
  const [tab, setTab] = useState<'profile' | 'dossier'>('profile');

  // Edit profile state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [targetRole, setTargetRole] = useState(user.targetRole || '');
  const [location, setLocation] = useState(user.location || '');
  const [profileSummary, setProfileSummary] = useState(user.profileSummary || '');
  const [teachingStyleNotes, setTeachingStyleNotes] = useState(user.preferredTeachingStyleNotes || '');
  const [isSaved, setIsSaved] = useState(false);

  // Sync state if user changes in context (e.g. clean reset or load)
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setTargetRole(user.targetRole || '');
    setLocation(user.location || '');
    setProfileSummary(user.profileSummary || '');
    setTeachingStyleNotes(user.preferredTeachingStyleNotes || '');
    setExecutiveSummary(user.profileSummary || '');
  }, [user]);

  // CV / Dossier Generation State
  const [isGeneratingCv, setIsGeneratingCv] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState(user.profileSummary || '');
  const [cvBullets, setCvBullets] = useState<string[]>([]);

  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      targetRole,
      location,
      profileSummary,
      preferredTeachingStyleNotes: teachingStyleNotes,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleGenerateCv = async () => {
    setIsGeneratingCv(true);
    try {
      const response = await fetch('/api/generate-cv-wording', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills,
          projects,
          targetRole,
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (data.bullet_points && data.bullet_points.length > 0) {
            setCvBullets(data.bullet_points);
            if (data.summary) {
              setExecutiveSummary(data.summary);
            }
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Error connecting to CV wording API, falling back locally:', err);
    }

    // Local fallback
    const localCv = generateCvWordingLocally(targetRole, skills, projects);
    setCvBullets(localCv.bullet_points);
    setExecutiveSummary(localCv.summary);
    setIsGeneratingCv(false);
  };

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  const handleExportDossierMarkdown = () => {
    let md = `# PROFESSIONAL DOSSIER: ${user.name}\n`;
    md += `Role: ${user.targetRole || 'Systems Architect'} | Email: ${user.email} | Location: ${user.location}\n\n`;
    md += `## Executive Summary\n${executiveSummary}\n\n`;
    md += `## Verified Core Competencies & CV Impact Statements\n\n`;
    cvBullets.forEach((bullet) => {
      md += `- ${bullet}\n`;
    });
    md += `\n## Assessed Projects\n\n`;
    projects.forEach((p) => {
      md += `### ${p.title} (${p.category})\n`;
      md += `Dates: ${p.start_date} to ${p.end_date}\n`;
      md += `${p.description}\n\n`;
      if (p.notes) {
        md += `*Relational Notes:* ${p.notes}\n\n`;
      }
    });
    md += `## Verified Skills Inventory (${skills.length} skills)\n\n`;
    skills.forEach((s) => {
      md += `- **${s.name}** [${s.domain_area}] (Proficiency: ${s.proficiency_level}/5) — Provenance: ${s.provenance_note}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-dossier.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6368] mb-1">
            <span>Portfolio & Profile</span>
            <span>·</span>
            <span className="text-[#1A73E8]">Google Account Style UI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
            Professional Profile & Career Dossier
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">
            Manage your personal data, preferred relational pedagogy styles, and generate CV-ready wording from assessed skills.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setTab('profile')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              tab === 'profile' ? 'bg-white text-[#202124] shadow-xs' : 'text-[#5F6368] hover:text-[#202124]'
            }`}
          >
            Google Profile
          </button>
          <button
            onClick={() => setTab('dossier')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              tab === 'dossier' ? 'bg-white text-[#202124] shadow-xs' : 'text-[#5F6368] hover:text-[#202124]'
            }`}
          >
            CV & Portfolio Dossier
          </button>
        </div>
      </div>

      {/* TAB 1: Google Account Style Profile */}
      {tab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {!user.name && !user.email && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs text-[#202124]">
              <Info className="w-5 h-5 text-[#1A73E8] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-sm text-[#1A73E8] mb-0.5">Welcome! Your profile is fresh</span>
                <p className="text-[#5F6368] leading-relaxed">
                  Enter your name, email, target role, and preferred learning/teaching styles below. Your details will personalize all generated syllabi, project skill audits, and CV portfolio exports.
                </p>
              </div>
            </div>
          )}

          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E0E0E0]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-medium text-lg shadow-xs">
                  {name ? name.charAt(0).toUpperCase() : <UserIcon className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-base font-medium text-[#202124]">
                    {name || 'Your Profile (Not Configured)'}
                  </h2>
                  <span className="text-xs text-[#5F6368]">
                    {email || 'Provide your email address below'}
                  </span>
                </div>
              </div>

              {isSaved && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex.morgan@domain.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Target Professional Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Director of Relational Governance & Systems Audit"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Location / Jurisdiction</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA / Geneva"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">Profile Summary</label>
              <textarea
                rows={3}
                value={profileSummary}
                onChange={(e) => setProfileSummary(e.target.value)}
                placeholder="High-level narrative summarizing your background and systems philosophy..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">
                Preferred Teaching & Learning Style Notes
              </label>
              <textarea
                rows={3}
                value={teachingStyleNotes}
                onChange={(e) => setTeachingStyleNotes(e.target.value)}
                placeholder="Note pedagogical preferences (e.g. systems-diagrammatic scaffolding, comparative case study analysis, iterative feedback loops)..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
              />
              <span className="text-[11px] text-[#5F6368]">
                Used by the syllabus generator to automatically personalize new curricula.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E0E0E0]">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: CV & Portfolio Dossier */}
      {tab === 'dossier' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E0E0E0]">
              <div>
                <h2 className="text-lg font-medium text-[#202124]">CV-Ready Portfolio & Impact Statements</h2>
                <span className="text-xs text-[#5F6368]">
                  Synthesized from your {skills.length} verified skills and {projects.length} assessed projects
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateCv}
                  disabled={isGeneratingCv}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#1A73E8] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingCv ? 'Synthesizing...' : 'Re-Generate with AI'}</span>
                </button>

                <button
                  onClick={handleExportDossierMarkdown}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                  title="Download Markdown Dossier"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Dossier (.md)</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                  title="Print Portfolio"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print CV</span>
                </button>
              </div>
            </div>

            {/* Executive Summary Box */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#202124]">Executive CV Summary</label>
              <textarea
                rows={3}
                value={executiveSummary}
                onChange={(e) => setExecutiveSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-[#E0E0E0] rounded-lg text-[#202124] focus:bg-white focus:border-[#1A73E8] outline-hidden"
              />
            </div>

            {/* Bullets List */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-[#202124]">
                Assessed Achievement Statements (Click to Copy)
              </label>

              {cvBullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-gray-50 border border-[#E0E0E0] rounded-xl flex items-start justify-between gap-4 hover:border-blue-200 transition-colors"
                >
                  <p className="text-xs text-[#202124] leading-relaxed pt-0.5">{bullet}</p>
                  <button
                    onClick={() => handleCopyBullet(bullet, idx)}
                    className="p-1.5 text-[#5F6368] hover:text-[#1A73E8] bg-white border border-[#E0E0E0] rounded-md shrink-0 transition-colors"
                    title="Copy bullet"
                  >
                    {copiedBulletIdx === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>

            {/* Assessed Projects Summary in CV format */}
            <div className="pt-4 border-t border-[#E0E0E0] space-y-3">
              <h3 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                Project Evidence Archive ({projects.length})
              </h3>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 border border-[#E0E0E0] rounded-xl bg-white space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#202124]">{proj.title}</span>
                      <span className="text-[#5F6368]">{proj.category}</span>
                    </div>
                    <p className="text-xs text-[#5F6368] leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
