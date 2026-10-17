import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DomainCategory,
  DOMAIN_CATEGORIES,
  Skill,
  REP_DIMENSIONS,
  REPDimension,
  AcquisitionType,
} from '../types';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  GraduationCap,
  Download,
  Filter,
  Search,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  Sliders,
  BarChart2,
  Trash2,
  Plus,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    skills,
    projects,
    syllabi,
    courses,
    setActiveTab,
    setSelectedSyllabusId,
    setSelectedProjectId,
    deleteSkill,
    loadDemoData,
  } = useApp();

  // Skill Inventory filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [acquisitionFilter, setAcquisitionFilter] = useState<string>('all');
  const [selectedRepDimension, setSelectedRepDimension] = useState<REPDimension | 'all'>('all');

  // Active syllabus
  const activeSyllabus = syllabi.find((s) => s.status === 'Active') || syllabi[0];

  // Domain Distribution Calculations
  const domainCounts = DOMAIN_CATEGORIES.map((domain) => {
    const count = skills.filter((s) => s.domain_area === domain).length;
    return { domain, count };
  });
  const maxDomainCount = Math.max(...domainCounts.map((d) => d.count), 1);

  // REP Rubric Dimension Aggregation
  const repDimensionAverages = REP_DIMENSIONS.map((dim) => {
    const scores = skills
      .map((s) => s.rep_scores?.[dim.id])
      .filter((score): score is 1 | 2 | 3 | 4 => score !== undefined);
    const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '—';
    return {
      dimension: dim,
      avg,
      count: scores.length,
    };
  });

  // Filtered skills
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.micro_tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.provenance_note?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = domainFilter === 'all' || skill.domain_area === domainFilter;
    const matchesAcquisition = acquisitionFilter === 'all' || skill.acquisition_type === acquisitionFilter;
    const matchesRep =
      selectedRepDimension === 'all' ||
      (skill.rep_scores && skill.rep_scores[selectedRepDimension] !== undefined);
    return matchesSearch && matchesDomain && matchesAcquisition && matchesRep;
  });

  // Export Skill Inventory as CSV
  const handleExportCSV = () => {
    const headers = ['Skill Name', 'Domain', 'Acquisition Type', 'Proficiency (1-5)', 'Provenance', 'Micro Tag', 'Meso Tag', 'Macro Tag'];
    const rows = skills.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.domain_area}"`,
      `"${s.acquisition_type}"`,
      s.proficiency_level,
      `"${(s.provenance_note || '').replace(/"/g, '""')}"`,
      `"${(s.micro_tag || '').replace(/"/g, '""')}"`,
      `"${(s.meso_tag || '').replace(/"/g, '""')}"`,
      `"${(s.macro_tag || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relational-skills-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6368] mb-1">
            <span>Flow 4</span>
            <span>·</span>
            <span>Dashboard & Inventory</span>
            <span>·</span>
            <span className="text-[#1A73E8]">Relational Epistemology Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
            Personal Dashboard & Skills Atlas
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">
            Comprehensive inventory of verified skills, REP rubric radar, domain distribution, and active learning paths.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Inventory (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards (Google Account Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-xs">
          <span className="block text-xs font-medium text-[#5F6368]">Total Verified Skills</span>
          <span className="block text-2xl font-normal text-[#202124] mt-1 tabular-nums">{skills.length}</span>
          <div className="flex items-center gap-2 text-[11px] text-[#5F6368] mt-2">
            <span>Across 6 domain ecosystems</span>
          </div>
        </div>

        <div className="bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-xs">
          <span className="block text-xs font-medium text-[#5F6368]">Assessed Projects</span>
          <span className="block text-2xl font-normal text-[#202124] mt-1 tabular-nums">{projects.length}</span>
          <div className="flex items-center gap-2 text-[11px] text-[#5F6368] mt-2">
            <span>Evidentiary cases ingested</span>
          </div>
        </div>

        <div className="bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-xs">
          <span className="block text-xs font-medium text-[#5F6368]">Active Syllabi</span>
          <span className="block text-2xl font-normal text-[#202124] mt-1 tabular-nums">{syllabi.length}</span>
          <div className="flex items-center gap-2 text-[11px] text-[#5F6368] mt-2">
            <span>Spiral learning trajectories</span>
          </div>
        </div>

        <div className="bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-xs">
          <span className="block text-xs font-medium text-[#5F6368]">Authored Courses</span>
          <span className="block text-2xl font-normal text-[#202124] mt-1 tabular-nums">{courses.length}</span>
          <div className="flex items-center gap-2 text-[11px] text-[#5F6368] mt-2">
            <span>Courses for teaching others</span>
          </div>
        </div>
      </div>

      {/* Fresh Account Welcoming Onboarding */}
      {skills.length === 0 && projects.length === 0 && syllabi.length === 0 && (
        <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
          <h2 className="text-lg font-medium text-[#202124]">Your Relational Skills Dashboard is Ready</h2>
          <p className="text-xs text-[#5F6368] max-w-lg mx-auto leading-relaxed">
            You haven&apos;t assessed any projects or created learning syllabi yet. Ingest your past projects to extract verified skills, or complete the intake form to generate a custom syllabus.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('assess')}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs"
            >
              Assess Past Project
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className="px-4 py-2 text-xs font-medium text-[#1A73E8] bg-white border border-[#1A73E8] hover:bg-blue-50 rounded-lg"
            >
              Build Custom Learning Syllabus
            </button>
            <button
              onClick={loadDemoData}
              className="px-3 py-2 text-xs font-medium text-[#5F6368] hover:text-[#202124] underline"
            >
              Explore Sample Practice Data
            </button>
          </div>
        </div>
      )}

      {/* Domain Distribution & REP Rubric Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Distribution Chart (Clean Google Style Bar Chart) */}
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E0E0E0]">
            <div>
              <h2 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                Domain Competency Distribution
              </h2>
              <span className="text-xs text-[#5F6368]">Skills distributed across institutional and technical arenas</span>
            </div>
            <BarChart2 className="w-4 h-4 text-[#1A73E8]" />
          </div>

          <div className="space-y-3 pt-2">
            {domainCounts.map(({ domain, count }) => {
              const widthPct = Math.round((count / maxDomainCount) * 100);
              return (
                <div key={domain} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#202124] font-medium">{domain}</span>
                    <span className="text-[#5F6368] tabular-nums font-mono">{count} skills</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1A73E8] rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(widthPct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* REP Rubric Dimensions Matrix */}
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E0E0E0]">
            <div>
              <h2 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                REP Rubric Dimension Benchmarks
              </h2>
              <span className="text-xs text-[#5F6368]">Scores evaluated on 1 to 4 scale (1=Emerging, 4=Exemplary)</span>
            </div>
            <TrendingUp className="w-4 h-4 text-[#1A73E8]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {repDimensionAverages.slice(0, 6).map(({ dimension, avg, count }) => (
              <div key={dimension.id} className="p-3 bg-gray-50 border border-[#E0E0E0] rounded-xl text-xs space-y-1">
                <span className="block font-medium text-[#202124] truncate">{dimension.label}</span>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#5F6368]">{count} assessed traces</span>
                  <span className="font-semibold text-sm text-[#1A73E8] tabular-nums font-mono">
                    {avg !== '—' ? `${avg} / 4.0` : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#5F6368] pt-1">
            Evaluates qualitative rigor: how evidentiary traces were interpreted, feedback loops traced, and models adapted.
          </p>
        </div>
      </div>

      {/* Active Syllabi Strip */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
          <div>
            <h2 className="text-base font-medium text-[#202124]">Active Learning Trajectories</h2>
            <span className="text-xs text-[#5F6368]">Spiral curricula currently in progress</span>
          </div>
          <button
            onClick={() => setActiveTab('learn')}
            className="text-xs text-[#1A73E8] font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>Generate New Syllabus</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {syllabi.length === 0 ? (
          <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-[#E0E0E0] space-y-2">
            <span className="block text-xs font-medium text-[#202124]">No active syllabi yet</span>
            <p className="text-xs text-[#5F6368] max-w-sm mx-auto">
              Design a custom syllabus with full course content and external integrations to start learning.
            </p>
            <button
              onClick={() => setActiveTab('learn')}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#1A73E8] rounded-lg mt-1"
            >
              Build Your First Syllabus
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syllabi.map((syl) => {
              const completedCount = syl.modules.filter((m) => m.completion_status === 'Completed').length;
              const pct = Math.round((completedCount / (syl.modules.length || 1)) * 100);

              return (
                <div
                  key={syl.id}
                  onClick={() => {
                    setSelectedSyllabusId(syl.id);
                    setActiveTab('learn');
                  }}
                  className="p-5 border border-[#E0E0E0] rounded-xl hover:border-[#1A73E8] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#5F6368] mb-2">
                      <span className="text-[#1A73E8] font-medium">{syl.domain}</span>
                      <span>Phase: {syl.spiral_phase}</span>
                    </div>

                    <h3 className="text-base font-medium text-[#202124] mb-1.5">{syl.title}</h3>
                    <p className="text-xs text-[#5F6368] line-clamp-2 mb-3">{syl.goal_description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#E0E0E0] space-y-1.5">
                    <div className="flex justify-between text-xs text-[#5F6368]">
                      <span>Progress ({completedCount}/{syl.modules.length} modules)</span>
                      <span className="font-medium text-[#202124] tabular-nums">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1A73E8]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Projects Assessed Strip */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
          <div>
            <h2 className="text-base font-medium text-[#202124]">Assessed Projects & Evidentiary Ingests</h2>
            <span className="text-xs text-[#5F6368]">Initiatives analyzed for skill extraction</span>
          </div>
          <button
            onClick={() => setActiveTab('assess')}
            className="text-xs text-[#1A73E8] font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>Assess Another Project</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-[#E0E0E0] space-y-2">
            <span className="block text-xs font-medium text-[#202124]">No assessed projects yet</span>
            <p className="text-xs text-[#5F6368] max-w-sm mx-auto">
              Ingest a project deliverable or notes to extract verified skills mapped across domains.
            </p>
            <button
              onClick={() => setActiveTab('assess')}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#1A73E8] rounded-lg mt-1"
            >
              Assess Your First Project
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E0E0E0]">
            {projects.map((proj) => (
              <div key={proj.id} className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                    <span className="text-[#1A73E8] font-medium">{proj.category}</span>
                    <span>·</span>
                    <span>{proj.start_date} to {proj.end_date}</span>
                  </div>
                  <h3 className="text-base font-medium text-[#202124]">{proj.title}</h3>
                  <p className="text-xs text-[#5F6368] line-clamp-2 max-w-3xl">{proj.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setSearchQuery(proj.title.split(' ')[0]);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-[#1A73E8] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    Filter Skills
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comprehensive Skill Inventory Table & Interactive Filters */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E0E0E0]">
          <div>
            <h2 className="text-base font-medium text-[#202124]">
              Verified Skill Inventory ({filteredSkills.length} of {skills.length})
            </h2>
            <span className="text-xs text-[#5F6368]">
              Granular skills mapped by micro/meso/macro focus and acquisition type
            </span>
          </div>

          <button
            onClick={() => setActiveTab('assess')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add via Project Assessment</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#5F6368] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, micro tags, provenance..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E0E0E0] rounded-lg text-[#202124] focus:border-[#1A73E8] outline-hidden"
            />
          </div>

          <div>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E0E0E0] rounded-lg text-[#202124] focus:border-[#1A73E8] outline-hidden"
            >
              <option value="all">All Domains</option>
              {DOMAIN_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={acquisitionFilter}
              onChange={(e) => setAcquisitionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E0E0E0] rounded-lg text-[#202124] focus:border-[#1A73E8] outline-hidden"
            >
              <option value="all">All Acquisition Types</option>
              <option value="Learned">Learned</option>
              <option value="Used">Used</option>
              <option value="Applied">Applied</option>
            </select>
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="divide-y divide-[#E0E0E0]">
          {skills.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#5F6368] space-y-1">
              <span className="block font-medium text-[#202124]">Your skill inventory is currently empty</span>
              <p>Assess a project or complete a syllabus module to extract and verify your competencies.</p>
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#5F6368]">
              No skills match your current filter. Try adjusting your search term.
            </div>
          ) : (
            filteredSkills.map((skill) => (
              <div key={skill.id} className="py-4 first:pt-1 last:pb-1 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-sm text-[#202124]">{skill.name}</span>
                    <span className="text-xs text-[#5F6368]">·</span>
                    <span className="text-xs text-[#1A73E8] font-medium">{skill.domain_area}</span>
                    <span className="text-xs text-[#5F6368]">·</span>
                    <span className="text-xs text-[#5F6368]">{skill.acquisition_type}</span>
                  </div>

                  <p className="text-xs text-[#5F6368] leading-relaxed">{skill.provenance_note}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#5F6368]">
                    <span>
                      <strong className="text-[#202124] font-medium">Micro:</strong> {skill.micro_tag}
                    </span>
                    <span>/</span>
                    <span>
                      <strong className="text-[#202124] font-medium">Meso:</strong> {skill.meso_tag}
                    </span>
                    <span>/</span>
                    <span>
                      <strong className="text-[#202124] font-medium">Macro:</strong> {skill.macro_tag}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end md:self-start">
                  <div className="text-right">
                    <span className="text-xs font-medium text-[#202124] block">
                      Level {skill.proficiency_level} / 5
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`w-3.5 h-1.5 rounded-xs ${
                            lvl <= skill.proficiency_level ? 'bg-[#1A73E8]' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-1 text-[#5F6368] hover:text-red-600 transition-colors"
                    title="Delete skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
