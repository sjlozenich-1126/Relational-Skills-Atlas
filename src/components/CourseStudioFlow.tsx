import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DomainCategory, DOMAIN_CATEGORIES, Course, CourseLesson } from '../types';
import {
  GraduationCap,
  Plus,
  Trash2,
  FileText,
  Download,
  Share2,
  Globe,
  Printer,
  ChevronRight,
  CheckCircle2,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const CourseStudioFlow: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, user } = useApp();

  // Mode: 'list' | 'create' | 'preview'
  const [mode, setMode] = useState<'list' | 'create' | 'preview'>('list');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState<DomainCategory>('Forensic Audit');
  const [lessons, setLessons] = useState<CourseLesson[]>([
    {
      id: 'les_' + Math.random().toString(36).substring(2, 9),
      title: '01. Diagnostic Foundations & Evidentiary Signs',
      description: 'Orientation to signs vs symptoms in complex institutional systems.',
      micro_focus: 'Evidentiary artifact identification',
      meso_focus: 'Team communication audit protocols',
      macro_focus: 'Statutory compliance standards',
      resources: ['ISO 19011 Auditing Guidelines', 'Peirce Semiotics Primer'],
      rep_prompts: ['What evidence distinguished signal from noise in this system?'],
    },
    {
      id: 'les_' + Math.random().toString(36).substring(2, 9),
      title: '02. Relational Modeling & Causal Loops',
      description: 'Mapping interactions across technical and institutional hierarchies.',
      micro_focus: 'Data packet trace analysis',
      meso_focus: 'Inter-departmental friction metrics',
      macro_focus: 'Systemic policy feedback loops',
      resources: ['Meadows Thinking in Systems Primer'],
      rep_prompts: ['Where did feedback delay mask downstream consequences?'],
    },
  ]);

  // Lesson being added or edited
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [newLessonMicro, setNewLessonMicro] = useState('');
  const [newLessonMeso, setNewLessonMeso] = useState('');
  const [newLessonMacro, setNewLessonMacro] = useState('');
  const [newLessonResource, setNewLessonResource] = useState('');
  const [newLessonPrompt, setNewLessonPrompt] = useState('');
  const [showLessonModal, setShowLessonModal] = useState(false);

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handleAddLesson = () => {
    if (!newLessonTitle.trim()) return;
    setLessons((prev) => [
      ...prev,
      {
        id: 'les_' + Math.random().toString(36).substring(2, 9),
        title: newLessonTitle.trim(),
        description: newLessonDesc.trim() || 'Core module instruction and case analysis.',
        micro_focus: newLessonMicro.trim() || 'Specific protocol execution',
        meso_focus: newLessonMeso.trim() || 'Operational workflow',
        macro_focus: newLessonMacro.trim() || 'Regulatory ecosystem',
        resources: newLessonResource ? [newLessonResource] : ['Open Educational Reference Framework'],
        rep_prompts: newLessonPrompt ? [newLessonPrompt] : ['What relational reasoning underpinned your revision?'],
      },
    ]);
    // Reset modal
    setNewLessonTitle('');
    setNewLessonDesc('');
    setNewLessonMicro('');
    setNewLessonMeso('');
    setNewLessonMacro('');
    setNewLessonResource('');
    setNewLessonPrompt('');
    setShowLessonModal(false);
  };

  const handleSaveCourse = () => {
    if (!title.trim()) {
      alert('Please provide a course title.');
      return;
    }

    const created = addCourse({
      title: title.trim(),
      audience: audience.trim() || 'Practitioners & Learners',
      description: description.trim(),
      domain,
      structure: lessons,
      publish_status: 'Published',
    });

    setSelectedCourseId(created.id);
    setMode('preview');
  };

  const handleExportMarkdown = (c: Course) => {
    let md = `# COURSE SYLLABUS: ${c.title}\n`;
    md += `Author: ${user.name}\n`;
    md += `Target Audience: ${c.audience}\n`;
    md += `Domain: ${c.domain} | Status: ${c.publish_status}\n\n`;
    md += `## Course Overview\n${c.description}\n\n`;
    md += `## Curriculum Structure\n\n`;

    c.structure.forEach((les, idx) => {
      md += `### Lesson ${idx + 1}: ${les.title}\n`;
      md += `${les.description}\n\n`;
      md += `**Scale Breakdown:**\n`;
      md += `- Micro Focus: ${les.micro_focus}\n`;
      md += `- Meso Focus: ${les.meso_focus}\n`;
      md += `- Macro Focus: ${les.macro_focus}\n\n`;
      md += `**Key Resources:**\n`;
      les.resources.forEach((r) => (md += `- ${r}\n`));
      md += `\n**REP Reflective Evaluation Prompts:**\n`;
      les.rep_prompts.forEach((p) => (md += `- ${p}\n`));
      md += `\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-course-outline.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportWebPage = (c: Course) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${c.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #202124; }
    h1 { color: #1a73e8; border-bottom: 2px solid #e0e0e0; padding-bottom: 12px; }
    .meta { color: #5f6368; font-size: 0.9em; margin-bottom: 24px; }
    .lesson { border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .scale { background: #f8f9fa; padding: 10px 14px; border-radius: 8px; font-size: 0.85em; margin: 12px 0; }
    .prompt { background: #e8f0fe; padding: 10px 14px; border-radius: 8px; font-size: 0.9em; color: #174ea6; }
  </style>
</head>
<body>
  <h1>${c.title}</h1>
  <div class="meta">
    <strong>Instructor:</strong> ${user.name} &bull; 
    <strong>Audience:</strong> ${c.audience} &bull; 
    <strong>Domain:</strong> ${c.domain}
  </div>
  <p>${c.description}</p>
  <h2>Course Curriculum</h2>
  ${c.structure
    .map(
      (les, i) => `
    <div class="lesson">
      <h3>${i + 1}. ${les.title}</h3>
      <p>${les.description}</p>
      <div class="scale">
        <strong>Micro:</strong> ${les.micro_focus} | 
        <strong>Meso:</strong> ${les.meso_focus} | 
        <strong>Macro:</strong> ${les.macro_focus}
      </div>
      <div><strong>Resources:</strong> ${les.resources.join(', ')}</div>
      <div class="prompt" style="margin-top: 10px;">
        <strong>REP Reflective Question:</strong> ${les.rep_prompts.join(' ')}
      </div>
    </div>
  `
    )
    .join('')}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-standalone.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6368] mb-1">
            <span>Flow 3</span>
            <span>·</span>
            <span>Course Studio</span>
            <span>·</span>
            <span className="text-[#1A73E8]">Relational Pedagogy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
            Teach Others New Skills
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">
            Structure courses with multi-scale micro/meso/macro mapping, catalyst prompts, and relational reasoning rubrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'list' && (
            <button
              onClick={() => setMode('create')}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs flex items-center gap-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Course</span>
            </button>
          )}

          {mode !== 'list' && (
            <button
              onClick={() => setMode('list')}
              className="px-4 py-2 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg transition-colors"
            >
              Back to Courses List
            </button>
          )}
        </div>
      </div>

      {/* LIST MODE: All courses overview */}
      {mode === 'list' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-[#E0E0E0] rounded-2xl p-6 hover:border-[#1A73E8] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#5F6368] mb-3">
                    <span className="text-[#1A73E8] font-medium">{course.domain}</span>
                    <span>Status: {course.publish_status}</span>
                  </div>

                  <h3 className="text-lg font-medium text-[#202124] mb-2">{course.title}</h3>
                  <p className="text-xs text-[#5F6368] line-clamp-3 mb-4">{course.description}</p>

                  <div className="text-[11px] text-[#5F6368] mb-4">
                    <strong>Audience:</strong> {course.audience}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E0E0E0] flex items-center justify-between">
                  <span className="text-xs text-[#5F6368]">{course.structure.length} structured modules</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setMode('preview');
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-[#1A73E8] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      View & Export
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE MODE: Build a course */}
      {mode === 'create' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-medium text-[#202124]">Course Architecture & Metadata</h2>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">Course Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Relational Systems Auditing: From Evidence to Institutional Revision"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-hidden text-[#202124]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Domain Category</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as DomainCategory)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-hidden text-[#202124]"
                >
                  {DOMAIN_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Target Audience</label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Senior Analysts, Governance Architects, Forensic Investigators"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-hidden text-[#202124]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">Course Description & Learning Outcomes</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summarize the core relational transformation participants will undergo, key competencies developed, and practical projects tackled..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-hidden text-[#202124]"
              />
            </div>

            {/* Lesson Structure Builder */}
            <div className="pt-4 border-t border-[#E0E0E0] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                    Course Lessons / Modules ({lessons.length})
                  </h3>
                  <span className="text-xs text-[#5F6368]">
                    Each lesson maps micro action, meso workflow, macro policy, and REP reflection prompts
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLessonModal(true)}
                  className="px-3 py-1.5 text-xs font-medium text-[#1A73E8] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Lesson</span>
                </button>
              </div>

              <div className="space-y-3">
                {lessons.map((les, idx) => (
                  <div
                    key={les.id || idx}
                    className="p-4 bg-gray-50 border border-[#E0E0E0] rounded-xl flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#1A73E8]">Lesson {idx + 1}</span>
                        <span className="font-medium text-sm text-[#202124]">{les.title}</span>
                      </div>
                      <p className="text-xs text-[#5F6368]">{les.description}</p>
                      <div className="flex flex-wrap gap-2 text-[11px] text-[#5F6368] pt-1">
                        <span>
                          <strong className="text-[#202124]">Micro:</strong> {les.micro_focus}
                        </span>
                        <span>/</span>
                        <span>
                          <strong className="text-[#202124]">Meso:</strong> {les.meso_focus}
                        </span>
                        <span>/</span>
                        <span>
                          <strong className="text-[#202124]">Macro:</strong> {les.macro_focus}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLessons((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-1.5 text-[#5F6368] hover:text-red-600 transition-colors"
                      title="Remove lesson"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E0E0E0]">
              <button
                type="button"
                onClick={() => setMode('list')}
                className="px-4 py-2 text-xs font-medium text-[#5F6368] hover:text-[#202124]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCourse}
                className="px-5 py-2 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs flex items-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Course & Open Overview</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW & EXPORT MODE */}
      {mode === 'preview' && activeCourse && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E0E0E0]">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                  <span className="text-[#1A73E8] font-medium">{activeCourse.domain}</span>
                  <span>·</span>
                  <span>Audience: {activeCourse.audience}</span>
                  <span>·</span>
                  <span>Author: {user.name}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-normal text-[#202124]">{activeCourse.title}</h2>
                <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed">{activeCourse.description}</p>
              </div>

              {/* Export Utilities */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => handleExportMarkdown(activeCourse)}
                  className="px-3 py-1.5 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                  title="Export markdown outline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Outline (.md)</span>
                </button>

                <button
                  onClick={() => handleExportWebPage(activeCourse)}
                  className="px-3 py-1.5 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                  title="Export standalone web page"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Web Page (.html)</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                  title="Print / Save PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Syllabus PDF</span>
                </button>
              </div>
            </div>

            {/* Curriculum breakdown */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                Course Curriculum ({activeCourse.structure.length} Modules)
              </h3>

              <div className="space-y-4">
                {activeCourse.structure.map((les, idx) => (
                  <div key={les.id || idx} className="p-5 border border-[#E0E0E0] rounded-xl bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1A73E8]">Module 0{idx + 1}</span>
                      <span className="text-xs text-[#5F6368]">REP-Informed Curriculum</span>
                    </div>

                    <h4 className="text-base font-medium text-[#202124]">{les.title}</h4>
                    <p className="text-xs text-[#5F6368] leading-relaxed">{les.description}</p>

                    <div className="p-3 bg-gray-50 border border-[#E0E0E0] rounded-lg text-xs space-y-1">
                      <div>
                        <strong className="text-[#202124]">Micro Scale:</strong> {les.micro_focus}
                      </div>
                      <div>
                        <strong className="text-[#202124]">Meso Scale:</strong> {les.meso_focus}
                      </div>
                      <div>
                        <strong className="text-[#202124]">Macro Scale:</strong> {les.macro_focus}
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="text-[#5F6368]">
                        <strong className="text-[#202124]">Resources:</strong> {les.resources.join(', ')}
                      </div>
                      <div className="p-2.5 bg-blue-50/60 rounded-md text-[#1A73E8]">
                        <strong>REP Reflection Question:</strong> {les.rep_prompts.join(' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-medium text-[#202124]">Add New Course Lesson</h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">Lesson Title *</label>
              <input
                type="text"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                placeholder="e.g. Adaptive Revision & Multi-Stakeholder Calibration"
                className="w-full px-3 py-2 text-xs border border-[#E0E0E0] rounded-lg text-[#202124] outline-hidden focus:border-[#1A73E8]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">Description</label>
              <textarea
                rows={2}
                value={newLessonDesc}
                onChange={(e) => setNewLessonDesc(e.target.value)}
                placeholder="Brief instructional scope of the lesson..."
                className="w-full px-3 py-2 text-xs border border-[#E0E0E0] rounded-lg text-[#202124] outline-hidden focus:border-[#1A73E8]"
              />
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-medium text-[#202124]">Scale Mappings</span>
              <input
                type="text"
                value={newLessonMicro}
                onChange={(e) => setNewLessonMicro(e.target.value)}
                placeholder="Micro (action/protocol, e.g. Audit log verification)"
                className="w-full px-3 py-1.5 text-xs border border-[#E0E0E0] rounded-lg"
              />
              <input
                type="text"
                value={newLessonMeso}
                onChange={(e) => setNewLessonMeso(e.target.value)}
                placeholder="Meso (workflow/team, e.g. Cross-functional review cadence)"
                className="w-full px-3 py-1.5 text-xs border border-[#E0E0E0] rounded-lg"
              />
              <input
                type="text"
                value={newLessonMacro}
                onChange={(e) => setNewLessonMacro(e.target.value)}
                placeholder="Macro (institution/policy, e.g. Statutory regulatory regime)"
                className="w-full px-3 py-1.5 text-xs border border-[#E0E0E0] rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">Accredited Resource / Reference</label>
              <input
                type="text"
                value={newLessonResource}
                onChange={(e) => setNewLessonResource(e.target.value)}
                placeholder="e.g. ISO 19011 Auditing Guidelines"
                className="w-full px-3 py-1.5 text-xs border border-[#E0E0E0] rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">REP Reflection Prompt</label>
              <input
                type="text"
                value={newLessonPrompt}
                onChange={(e) => setNewLessonPrompt(e.target.value)}
                placeholder="e.g. What feedback prompted a structural revision of your initial model?"
                className="w-full px-3 py-1.5 text-xs border border-[#E0E0E0] rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E0E0E0]">
              <button
                type="button"
                onClick={() => setShowLessonModal(false)}
                className="px-3.5 py-1.5 text-xs text-[#5F6368] hover:text-[#202124]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddLesson}
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg"
              >
                Add Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
