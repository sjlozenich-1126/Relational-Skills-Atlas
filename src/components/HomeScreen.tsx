import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Sparkles,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  Layers,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { setActiveTab, projects, syllabi, skills, setSelectedSyllabusId, setSelectedProjectId } = useApp();

  const activeSyllabus = syllabi.find((s) => s.status === 'Active') || syllabi[0];
  const recentProject = projects[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Google Account Profile style intro banner */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-[#202124] mb-3">
          Relational Skills Atlas
        </h1>
        <p className="text-base sm:text-lg text-[#5F6368] font-normal leading-relaxed">
          An all-in-one platform to assess skills from past initiatives, synthesize relational learning syllabi for future
          projects, build educational courses, and develop a verified CV portfolio.
        </p>
      </div>

      {/* The Four Core Top-Level Options (Google styled large cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {/* Option 1: Assess Skills */}
        <div
          onClick={() => setActiveTab('assess')}
          className="group relative bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-7 hover:border-[#1A73E8] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1A73E8] flex items-center justify-center mb-5 group-hover:bg-[#1A73E8] group-hover:text-white transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-[#202124] mb-2 leading-snug group-hover:text-[#1A73E8] transition-colors">
              I want to know what skills I’ve learned from an existing project.
            </h2>
            <p className="text-sm text-[#5F6368] leading-relaxed mb-6">
              Upload project notes, documents, or context. Extract granular skills across Legal, Forensic, Defense, Urban,
              Biocultural, and Digital domains scored against the REP rubric.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E0E0E0] flex items-center justify-between text-xs font-medium text-[#1A73E8]">
            <span>Assess Project & Extract Skills</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Option 2: Learn New Skills */}
        <div
          onClick={() => setActiveTab('learn')}
          className="group relative bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-7 hover:border-[#1A73E8] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1A73E8] flex items-center justify-center mb-5 group-hover:bg-[#1A73E8] group-hover:text-white transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-[#202124] mb-2 leading-snug group-hover:text-[#1A73E8] transition-colors">
              I want to learn new skills for a future project.
            </h2>
            <p className="text-sm text-[#5F6368] leading-relaxed mb-6">
              Synthesize a 4-phase spiral syllabus (Initiation, Descent, Reconfiguration, Ascent). Complete interactive
              lessons with micro, meso, and macro mapping, readings, and exercises.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E0E0E0] flex items-center justify-between text-xs font-medium text-[#1A73E8]">
            <span>Generate Custom Learning Syllabus</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Option 3: Teach Others */}
        <div
          onClick={() => setActiveTab('teach')}
          className="group relative bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-7 hover:border-[#1A73E8] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1A73E8] flex items-center justify-center mb-5 group-hover:bg-[#1A73E8] group-hover:text-white transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-[#202124] mb-2 leading-snug group-hover:text-[#1A73E8] transition-colors">
              I want to teach others new skills.
            </h2>
            <p className="text-sm text-[#5F6368] leading-relaxed mb-6">
              Build and structure relational courses. Define modules with catalyst concepts, reflective prompts, and multi-scale
              frameworks. Export as PDF syllabus, markdown outline, or web course.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E0E0E0] flex items-center justify-between text-xs font-medium text-[#1A73E8]">
            <span>Open Course Studio</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Option 4: Syllabus & Dashboard */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="group relative bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-7 hover:border-[#1A73E8] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1A73E8] flex items-center justify-center mb-5 group-hover:bg-[#1A73E8] group-hover:text-white transition-colors">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-[#202124] mb-2 leading-snug group-hover:text-[#1A73E8] transition-colors">
              I want to access my syllabus or dashboard.
            </h2>
            <p className="text-sm text-[#5F6368] leading-relaxed mb-6">
              Review your verified skill inventory, REP rubric radar matrix, domain competency distributions, active
              learning modules, and CV-ready portfolio achievements.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E0E0E0] flex items-center justify-between text-xs font-medium text-[#1A73E8]">
            <span>View Personal Dashboard & Metrics</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Quick Status / Recent Engagement Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {!activeSyllabus && !recentProject && (
          <div className="md:col-span-2 bg-gray-50 border border-[#E0E0E0] rounded-xl p-6 text-center space-y-3">
            <h3 className="text-base font-medium text-[#202124]">Welcome to Your Personal Skills Atlas</h3>
            <p className="text-xs text-[#5F6368] max-w-xl mx-auto">
              Your profile is fresh and ready. Begin by assessing skills from a past initiative or completing the intake form to generate your first custom learning syllabus.
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
            </div>
          </div>
        )}

        {/* Active Syllabus Quick Peek */}
        {activeSyllabus && (
          <div className="bg-white border border-[#E0E0E0] rounded-xl p-5 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-3 text-xs text-[#5F6368]">
              <span className="font-medium text-[#202124]">Current Active Learning Path</span>
              <span>Phase: {activeSyllabus.spiral_phase}</span>
            </div>
            <h3 className="text-base font-medium text-[#202124] mb-2">{activeSyllabus.title}</h3>
            <p className="text-xs text-[#5F6368] line-clamp-2 mb-4">{activeSyllabus.goal_description}</p>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-[#E0E0E0]">
              <span className="text-[#5F6368]">
                {activeSyllabus.modules.filter((m) => m.completion_status === 'Completed').length} of{' '}
                {activeSyllabus.modules.length} modules completed
              </span>
              <button
                onClick={() => {
                  setSelectedSyllabusId(activeSyllabus.id);
                  setActiveTab('learn');
                }}
                className="text-[#1A73E8] hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>Continue Learning</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Recent Assessed Project Quick Peek */}
        {recentProject && (
          <div className="bg-white border border-[#E0E0E0] rounded-xl p-5 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-3 text-xs text-[#5F6368]">
              <span className="font-medium text-[#202124]">Latest Assessed Project</span>
              <span>{recentProject.category}</span>
            </div>
            <h3 className="text-base font-medium text-[#202124] mb-2">{recentProject.title}</h3>
            <p className="text-xs text-[#5F6368] line-clamp-2 mb-4">{recentProject.description}</p>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-[#E0E0E0]">
              <span className="text-[#5F6368]">
                {skills.filter((s) => s.provenance_note?.toLowerCase().includes(recentProject.title.toLowerCase())).length ||
                  recentProject.extractedSkillsCount ||
                  0}{' '}
                skills verified
              </span>
              <button
                onClick={() => {
                  setSelectedProjectId(recentProject.id);
                  setActiveTab('dashboard');
                }}
                className="text-[#1A73E8] hover:underline font-medium inline-flex items-center gap-1"
              >
                <span>View Skill Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Relational Pedagogical Anchor Note */}
      <div className="mt-8 p-4 bg-gray-50 border border-[#E0E0E0] rounded-xl flex items-start gap-3">
        <div className="p-1.5 bg-blue-100/60 rounded-md text-[#1A73E8] mt-0.5">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#5F6368] leading-relaxed">
          <strong className="text-[#202124] font-medium">The Relational Epistemology (REP) Rubric: </strong>
          Evaluates real competence through 10 interrelated criteria—from interpretation of signs and causal reasoning to
          adaptive revision and generative artifacts. Micro skills map directly to organizational workflows and ecosystem
          impacts.
        </div>
      </div>
    </div>
  );
};
