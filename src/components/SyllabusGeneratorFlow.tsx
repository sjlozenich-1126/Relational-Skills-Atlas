import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  DomainCategory,
  DOMAIN_CATEGORIES,
  Syllabus,
  Module,
  SpiralPhase,
  ModuleResource,
  REP_DIMENSIONS,
  REPDimension,
} from '../types';
import { generateTailoredSyllabus } from '../lib/generators';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
  Download,
  Printer,
  Compass,
  Layers,
  HelpCircle,
  Save,
  Award,
  Check,
  AlertCircle,
  TrendingUp,
  Sliders,
  Globe,
  GraduationCap,
  Plus,
  Trash2,
  Link as LinkIcon,
  BookMarked,
  Info,
} from 'lucide-react';

interface CustomExternalLink {
  title: string;
  url: string;
  platform: string;
  notes?: string;
}

const SUGGESTED_INQUIRIES = [
  {
    goal: 'Cross-Border Digital Chain-of-Custody & Forensic Admissibility',
    projectIdea: 'Building an evidentiary disclosure repository for international regulatory compliance.',
    domain: 'Forensic Audit' as DomainCategory,
    scaleFocus: 'macro (treaties & statutory compliance)',
    style: 'Rigorous protocol specifications, threat trees, and forensic case studies.',
    suggestedLinks: [
      {
        title: 'NIST SP 800-86 Guide to Integrating Forensic Techniques',
        url: 'https://csrc.nist.gov/pubs/sp/800/86/final',
        platform: 'NIST Standard',
        notes: 'Chain-of-custody evidentiary integrity matrix',
      },
      {
        title: 'Khan Academy: Cryptography & Cryptographic Hash Functions',
        url: 'https://www.khanacademy.org/computing/computer-science/cryptography',
        platform: 'Khan Academy',
        notes: 'Foundations of SHA-256 and digital signatures',
      },
    ],
  },
  {
    goal: 'Biocultural Riparian Commons & Urban Watershed Governance',
    projectIdea: 'Drafting multi-district land use easements to reconcile municipal and indigenous water rights disputes.',
    domain: 'Urban & Real Estate' as DomainCategory,
    scaleFocus: 'meso (inter-agency covenants and municipal workflows)',
    style: 'Visual systems diagrams, comparative statutory tables, and empirical case histories.',
    suggestedLinks: [
      {
        title: 'Elinor Ostrom: Governing the Commons (Cambridge University Press)',
        url: 'https://www.cambridge.org/core/books/governing-the-commons',
        platform: 'Academic Research',
        notes: 'Principles for collective management of common-pool riparian resources',
      },
    ],
  },
  {
    goal: 'Algorithmic Audit & Ethical AI Governance Frameworks',
    projectIdea: 'Establishing continuous compliance checks for automated decision systems under the EU AI Act.',
    domain: 'Digital & Systems' as DomainCategory,
    scaleFocus: 'integrated (from model telemetry to executive liability)',
    style: 'Hands-on bias diagnostic drills, risk scoring matrices, and deliberative governance charters.',
    suggestedLinks: [
      {
        title: 'EU Artificial Intelligence Act (Official Text)',
        url: 'https://artificialintelligenceact.eu/',
        platform: 'Statutory Treaty',
        notes: 'Mandatory high-risk system conformity assessments',
      },
      {
        title: 'NIST AI Risk Management Framework (AI RMF 1.0)',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
        platform: 'NIST Standard',
        notes: 'Governance, mapping, measuring, and managing AI risk',
      },
    ],
  },
];

const PEDAGOGY_STYLE_TAGS = [
  'Systems & Causal Loop Diagrams',
  'Hands-on Code & Protocol Drills',
  'Comparative Real-World Case Studies',
  'Statutory & Regulatory Audits',
  'Step-by-Step Practical Labs',
  'Primary Academic Research & Preprints',
  'Interactive Knowledge Checks & Quizzes',
  'Multi-Scale Feedback Loop Tracing',
];

export const SyllabusGeneratorFlow: React.FC = () => {
  const {
    user,
    syllabi,
    addSyllabus,
    deleteSyllabus,
    addModuleToSyllabus,
    addResourceToModule,
    awardVerifiedSkillFromModule,
    updateModuleStatus,
    updateModuleQuizAndRubric,
    selectedSyllabusId,
    setSelectedSyllabusId,
    setActiveTab,
  } = useApp();

  // Navigation tab within the Learn Flow: 'form' | 'roadmap' | 'certificate'
  const [activeView, setActiveView] = useState<'form' | 'roadmap' | 'certificate'>(
    syllabi.length === 0 ? 'form' : 'form'
  );

  // Form State
  const [goal, setGoal] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<DomainCategory>('Digital & Systems');
  const [scaleFocus, setScaleFocus] = useState('meso (project/workflow)');
  const [startingLevel, setStartingLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [learningPace, setLearningPace] = useState('4-Week Balanced Track');
  const [teachingStyle, setTeachingStyle] = useState(
    user.preferredTeachingStyleNotes || 'Systems diagrams, relational reasoning, case studies, and hands-on drills.'
  );
  const [selectedStyleTags, setSelectedStyleTags] = useState<string[]>([
    'Systems & Causal Loop Diagrams',
    'Comparative Real-World Case Studies',
    'Step-by-Step Practical Labs',
  ]);

  // Standard platform integrations
  const [integrations, setIntegrations] = useState<string[]>([
    'International Standards (ISO/IEC, NIST, IEEE)',
    'Academic & Peer-Reviewed Literature (arXiv, MIT OCW)',
    'Statutory Codes & Regulatory Treaties (UN, EU Directives)',
    'Open-Source Courseware (Khan Academy, MIT OCW, Coursera)',
  ]);

  // Custom External Links added by user in the intake form
  const [customLinks, setCustomLinks] = useState<CustomExternalLink[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkPlatform, setNewLinkPlatform] = useState('Khan Academy');
  const [newLinkNotes, setNewLinkNotes] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);

  // Active viewing syllabus
  const activeSyllabus =
    syllabi.find((s) => s.id === selectedSyllabusId) || syllabi[0];

  // Active module modal for interactive lesson viewing
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [lessonActiveTab, setLessonActiveTab] = useState<'study' | 'resources' | 'quiz' | 'rubric'>('study');
  const [userReflection, setUserReflection] = useState('');
  const [userNotes, setUserNotes] = useState('');

  // Interactive Quiz State inside lesson modal
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Interactive REP self-assessment inside lesson modal
  const [repRatings, setRepRatings] = useState<Record<string, number>>({
    'Interpretation of signs': 3,
    'Relational reasoning': 4,
    'Adaptive revision': 3,
    'Meaningful engagement': 4,
  });

  const [skillAwardedNotice, setSkillAwardedNotice] = useState(false);

  // State for adding module to existing syllabus
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [newModulePhase, setNewModulePhase] = useState<SpiralPhase>('Initiation');
  const [newModuleCatalyst, setNewModuleCatalyst] = useState('');
  const [newModuleMicro, setNewModuleMicro] = useState('');
  const [newModuleMeso, setNewModuleMeso] = useState('');
  const [newModuleMacro, setNewModuleMacro] = useState('');

  // State for adding resource to a module
  const [targetModuleForResource, setTargetModuleForResource] = useState<string | null>(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourcePlatform, setResourcePlatform] = useState('Khan Academy');
  const [resourceSummary, setResourceSummary] = useState('');

  const toggleIntegration = (name: string) => {
    setIntegrations((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const toggleStyleTag = (tag: string) => {
    setSelectedStyleTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleApplySuggestion = (sug: (typeof SUGGESTED_INQUIRIES)[0]) => {
    setGoal(sug.goal);
    setProjectIdea(sug.projectIdea);
    setSelectedDomain(sug.domain);
    setScaleFocus(sug.scaleFocus);
    setTeachingStyle(sug.style);
    if (sug.suggestedLinks) {
      setCustomLinks(sug.suggestedLinks);
    }
  };

  const handleAddCustomLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    setCustomLinks((prev) => [
      ...prev,
      {
        title: newLinkTitle.trim(),
        url: newLinkUrl.trim(),
        platform: newLinkPlatform,
        notes: newLinkNotes.trim(),
      },
    ]);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkNotes('');
  };

  const handleRemoveCustomLink = (index: number) => {
    setCustomLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      return;
    }

    setIsGenerating(true);
    const combinedTeachingStyle = `${teachingStyle}. Emphasized pedagogy formats: ${selectedStyleTags.join(', ')}`;

    let generatedSyllabusData: any = null;

    try {
      const response = await fetch('/api/generate-syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          projectIdea,
          domains: [selectedDomain],
          scaleFocus,
          teachingStyle: combinedTeachingStyle,
          startingLevel,
          learningPace,
          externalIntegrations: integrations,
          customExternalLinks: customLinks,
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (data && data.syllabus) {
            generatedSyllabusData = data.syllabus;
          }
        }
      }
    } catch (err) {
      console.warn('Network or API route unavailable, using relational generator:', err);
    }

    // If serverless endpoint returned 404/500 or network was offline, use generator
    if (!generatedSyllabusData) {
      generatedSyllabusData = generateTailoredSyllabus({
        goal,
        projectIdea,
        domains: [selectedDomain],
        scaleFocus,
        teachingStyle: combinedTeachingStyle,
        startingLevel,
        learningPace,
        externalIntegrations: integrations,
        customExternalLinks: customLinks,
      });
    }

    try {
      const created = addSyllabus({
        title: generatedSyllabusData.title || `${goal} Learning Syllabus`,
        goal_description: generatedSyllabusData.goal_description || goal,
        catalyst: generatedSyllabusData.catalyst || 'Relational reasoning across multi-scale feedback loops',
        spiral_phase: generatedSyllabusData.spiral_phase || 'Initiation',
        status: 'Active',
        domain: generatedSyllabusData.domain || selectedDomain,
        target_project: projectIdea,
        teaching_style_notes: combinedTeachingStyle,
        modules: (generatedSyllabusData.modules || []).map((m: any, idx: number) => {
          // Include custom user-provided links in module resources
          const extraResources: ModuleResource[] = [];
          if (customLinks.length > 0 && idx === 0) {
            customLinks.forEach((cl) => {
              extraResources.push({
                title: cl.title,
                url: cl.url,
                type: cl.platform,
                source: cl.platform,
                summary: cl.notes || 'Learner-provided integrated course reference.',
                isCustom: true,
              });
            });
          }

          return {
            ...m,
            id: m.id || 'mod_' + Math.random().toString(36).substring(2, 9),
            syllabus_id: '',
            completion_status: 'Not Started',
            resources: [...(m.resources || []), ...extraResources],
            lesson_content: {
              ...(m.lesson_content || {}),
              quiz: m.lesson_content?.quiz || [
                {
                  question: `In this module on ${m.title}, what is the foundational relational insight?`,
                  options: [
                    'Treating boundaries as reciprocal socio-technical feedback agreements.',
                    'Assuming individual nodes operate independently of systemic risk.',
                    'Prioritizing rigid static checklists over dynamic environmental adaptation.',
                    'Centralizing all governance decisions into a single unilateral silo.',
                  ],
                  correctIndex: 0,
                  explanation:
                    'Relational pedagogy emphasizes that units cannot be analyzed in isolation from the feedback loops that sustain them.',
                },
                {
                  question: 'How does multi-scale translation prevent systemic failure?',
                  options: [
                    'By ignoring localized technical traces.',
                    'By mapping micro operational actions directly to meso workflows and macro statutory policies.',
                    'By relying solely on financial audits.',
                    'By maintaining strict organizational data silos.',
                  ],
                  correctIndex: 1,
                  explanation:
                    'Bridging micro, meso, and macro scales ensures that operational anomalies inform macro governance before cascading into systemic collapse.',
                },
              ],
            },
          };
        }),
      });

      setSelectedSyllabusId(created.id);
      setActiveView('roadmap');
    } catch (saveErr) {
      console.error('Error saving generated syllabus:', saveErr);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectModule = (mod: Module) => {
    setSelectedModule(mod);
    setLessonActiveTab('study');
    setUserReflection(mod.lesson_content?.user_reflection || '');
    setUserNotes(mod.lesson_content?.user_notes || '');
    setSelectedAnswers(mod.lesson_content?.userQuizAnswers || [0, 0]);
    setQuizSubmitted(!!mod.lesson_content?.userQuizAnswers);
    setSkillAwardedNotice(false);
  };

  const handleQuizAnswer = (questionIdx: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => {
      const updated = [...prev];
      updated[questionIdx] = optionIdx;
      return updated;
    });
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    if (!activeSyllabus || !selectedModule) return;
    const questions = selectedModule.lesson_content?.quiz || [];
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    updateModuleQuizAndRubric(
      activeSyllabus.id,
      selectedModule.id,
      selectedAnswers,
      correctCount,
      repRatings
    );
  };

  const handleSaveReflection = (completed: boolean) => {
    if (!activeSyllabus || !selectedModule) return;
    updateModuleStatus(
      activeSyllabus.id,
      selectedModule.id,
      completed ? 'Completed' : 'In Progress',
      userReflection,
      userNotes
    );

    if (completed) {
      awardVerifiedSkillFromModule({
        name: `${selectedModule.title.replace(/^\d+\.\s*/, '')}: Relational Competency`,
        domain_area: activeSyllabus.domain,
        acquisition_type: 'Learned',
        proficiency_level: 4,
        provenance_note: `Mastered via Relational Skills Atlas module "${selectedModule.title}" in syllabus "${activeSyllabus.title}".`,
        micro_tag: selectedModule.micro_focus,
        meso_tag: selectedModule.meso_focus,
        macro_tag: selectedModule.macro_focus,
        rep_scores: repRatings as any,
      });
      setSkillAwardedNotice(true);
    }

    setTimeout(() => {
      setSelectedModule(null);
    }, 600);
  };

  const handleAddModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSyllabus || !newModuleTitle.trim()) return;

    addModuleToSyllabus(activeSyllabus.id, {
      title: newModuleTitle.trim(),
      description: newModuleDesc.trim() || 'Custom practitioner-defined syllabus module.',
      spiral_phase: newModulePhase,
      catalyst: newModuleCatalyst.trim() || 'Adaptive relational iteration',
      micro_focus: newModuleMicro.trim() || 'Hands-on operational action',
      meso_focus: newModuleMeso.trim() || 'Project workflow synthesis',
      macro_focus: newModuleMacro.trim() || 'Systemic governance impact',
      resources: [],
      feedback_prompts: [
        'How does this module bridge technical execution and institutional intent?',
        'What relational feedback loop does this module introduce?',
      ],
      completion_status: 'Not Started',
      lesson_content: {
        key_takeaway: 'Custom practitioner module designed for specialized project execution.',
        conceptual_foundation: newModuleDesc.trim() || 'Practitioner-authored learning module focusing on relational implementation.',
        case_study: 'Applied project case study in development.',
        practical_exercise: 'Execute the project milestone corresponding to this module.',
        reflection_prompt: 'What unexpected system dynamics arose during this exercise?',
        quiz: [
          {
            question: `What is the core relational objective of ${newModuleTitle}?`,
            options: [
              'Bridging operational feedback with systemic governance.',
              'Ignoring cross-scale feedback loops.',
              'Isolating modules from peer collaboration.',
              'Minimizing project transparency.',
            ],
            correctIndex: 0,
            explanation: 'Relational synthesis aligns operational action with broader systemic intent.',
          },
        ],
      },
    });

    setIsAddModuleModalOpen(false);
    setNewModuleTitle('');
    setNewModuleDesc('');
    setNewModuleCatalyst('');
    setNewModuleMicro('');
    setNewModuleMeso('');
    setNewModuleMacro('');
  };

  const handleAddResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSyllabus || !targetModuleForResource || !resourceTitle.trim()) return;

    addResourceToModule(activeSyllabus.id, targetModuleForResource, {
      title: resourceTitle.trim(),
      url: resourceUrl.trim() || '#',
      type: resourcePlatform,
      source: resourcePlatform,
      summary: resourceSummary.trim() || 'Practitioner-integrated external learning resource.',
      isCustom: true,
    });

    setTargetModuleForResource(null);
    setResourceTitle('');
    setResourceUrl('');
    setResourceSummary('');
  };

  const handleExportText = () => {
    if (!activeSyllabus) return;
    let content = `# SYLLABUS: ${activeSyllabus.title}\n`;
    content += `Goal: ${activeSyllabus.goal_description}\n`;
    content += `Catalyst: ${activeSyllabus.catalyst}\n`;
    content += `Phase: ${activeSyllabus.spiral_phase} | Domain: ${activeSyllabus.domain}\n\n`;
    content += `--- MODULES ---\n\n`;

    activeSyllabus.modules.forEach((mod, idx) => {
      content += `MODULE ${idx + 1}: ${mod.title}\n`;
      content += `Phase: ${mod.spiral_phase || 'General'} | Catalyst: ${mod.catalyst || 'N/A'}\n`;
      content += `Description: ${mod.description}\n`;
      content += `Scale Focus: Micro: ${mod.micro_focus} | Meso: ${mod.meso_focus} | Macro: ${mod.macro_focus}\n`;
      content += `Resources & External Integrations:\n`;
      mod.resources.forEach((r) => {
        content += `  - [${r.type.toUpperCase()}] ${r.title} (${r.url || 'No URL'}) — ${r.summary || ''}\n`;
      });
      content += `Reflective Feedback Prompts:\n`;
      mod.feedback_prompts.forEach((p) => {
        content += `  - ${p}\n`;
      });
      if (mod.lesson_content) {
        content += `\nLesson Key Takeaway: ${mod.lesson_content.key_takeaway}\n`;
        content += `Exercise: ${mod.lesson_content.practical_exercise}\n`;
        if (mod.lesson_content.user_reflection) {
          content += `Learner Reflection: ${mod.lesson_content.user_reflection}\n`;
        }
      }
      content += `\n----------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSyllabus.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-syllabus.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Progress calculation
  const completedCount = activeSyllabus?.modules.filter((m) => m.completion_status === 'Completed').length || 0;
  const totalCount = activeSyllabus?.modules.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Top Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6368] mb-1">
            <span>Flow 2</span>
            <span>·</span>
            <span>E-Learning Platform & Roadmap Builder</span>
            <span>·</span>
            <span className="text-[#1A73E8]">Relational Epistemology</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
            Learn New Skills for a Future Project
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">
            Complete the intake form to synthesize a custom 4-phase spiral syllabus, complete instructional course lessons, accredited external links, and interactive knowledge checks.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveView('form')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeView === 'form' ? 'bg-white text-[#202124] shadow-xs' : 'text-[#5F6368] hover:text-[#202124]'
            }`}
          >
            Design New Syllabus
          </button>
          <button
            onClick={() => {
              if (syllabi.length > 0) setActiveView('roadmap');
            }}
            disabled={syllabi.length === 0}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:opacity-40 ${
              activeView === 'roadmap' ? 'bg-white text-[#202124] shadow-xs' : 'text-[#5F6368] hover:text-[#202124]'
            }`}
          >
            Active Roadmaps ({syllabi.length})
          </button>
          {completedCount > 0 && (
            <button
              onClick={() => setActiveView('certificate')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeView === 'certificate' ? 'bg-white text-[#202124] shadow-xs' : 'text-[#5F6368] hover:text-[#202124]'
              }`}
            >
              Certificate
            </button>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* VIEW: CUSTOM INTAKE FORM                             */}
      {/* ==================================================== */}
      {activeView === 'form' && (
        <div className="space-y-6">
          {/* Quick Suggestion Chips */}
          <div className="bg-gray-50 border border-[#E0E0E0] rounded-xl p-4 sm:p-5">
            <span className="block text-xs font-medium text-[#202124] mb-2 uppercase tracking-wide">
              Quick Autofill Starter Inquiries (Click to Load)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SUGGESTED_INQUIRIES.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplySuggestion(sug)}
                  className="text-left p-3 bg-white border border-[#E0E0E0] rounded-lg hover:border-[#1A73E8] hover:bg-blue-50/40 transition-colors"
                >
                  <span className="block text-xs font-medium text-[#202124] truncate mb-1">{sug.goal}</span>
                  <div className="flex items-center gap-2 text-[11px] text-[#5F6368]">
                    <span>{sug.domain}</span>
                    <span>·</span>
                    <span>{sug.scaleFocus.split(' ')[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerateSyllabus} className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#E0E0E0] pb-4">
              <h2 className="text-base font-semibold text-[#202124]">1. Core Learning Intent & Future Project Context</h2>
              <p className="text-xs text-[#5F6368]">Describe what you want to learn and the real-world initiative where you will apply it.</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">
                Target Skill(s) or Subject You Want to Learn *
              </label>
              <input
                type="text"
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Transnational Digital Chain-of-Custody & Forensic Admissibility"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-hidden text-[#202124]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">
                Future Project Context or Problem Space *
              </label>
              <textarea
                rows={3}
                required
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                placeholder="Describe the upcoming initiative, problem space, or organization where you will deploy this skill (e.g. Architecting a verified cross-border evidentiary ledger for international compliance)..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-hidden text-[#202124]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Domain Ecosystem</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value as DomainCategory)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                >
                  {DOMAIN_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Scale Focus</label>
                <select
                  value={scaleFocus}
                  onChange={(e) => setScaleFocus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                >
                  <option value="micro (specific technique/protocol/action)">Micro (Technical protocol / action)</option>
                  <option value="meso (project/workflow/organization)">Meso (Project workflow / coordination)</option>
                  <option value="macro (institution/policy/ecosystem)">Macro (Statutory policy / oversight)</option>
                  <option value="integrated (cross-scale relational translation)">Integrated (All three scales synced)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Starting Experience</label>
                <select
                  value={startingLevel}
                  onChange={(e) => setStartingLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                >
                  <option value="Beginner">Beginner (Foundational orientation)</option>
                  <option value="Intermediate">Intermediate (Practitioner with context)</option>
                  <option value="Advanced">Advanced (Specialist deepening mastery)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Target Timeline</label>
                <select
                  value={learningPace}
                  onChange={(e) => setLearningPace(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                >
                  <option value="2-Week Intensive Sprint">2-Week Intensive Sprint</option>
                  <option value="4-Week Balanced Track">4-Week Balanced Track</option>
                  <option value="8-Week Deep Immersion">8-Week Deep Immersion</option>
                </select>
              </div>
            </div>

            {/* Pedagogical Style Preferences */}
            <div className="border-b border-[#E0E0E0] pt-2 pb-4">
              <h2 className="text-base font-semibold text-[#202124]">2. Teaching Style & Pedagogical Preferences</h2>
              <p className="text-xs text-[#5F6368]">Select the educational modalities you prefer to be emphasized in your course lessons.</p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {PEDAGOGY_STYLE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleStyleTag(tag)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      selectedStyleTags.includes(tag)
                        ? 'border-[#1A73E8] bg-blue-50 text-[#1A73E8]'
                        : 'border-[#E0E0E0] bg-white text-[#5F6368] hover:border-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">
                  Additional Teaching Style Notes
                </label>
                <input
                  type="text"
                  value={teachingStyle}
                  onChange={(e) => setTeachingStyle(e.target.value)}
                  placeholder="e.g. Visual systems diagrams, empirical case study breakdowns, hands-on lab exercises"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                />
              </div>
            </div>

            {/* External Links & Custom E-Learning Course Integrations */}
            <div className="border-b border-[#E0E0E0] pt-2 pb-4">
              <h2 className="text-base font-semibold text-[#202124]">3. External Links & Course Integrations</h2>
              <p className="text-xs text-[#5F6368]">
                Select authoritative repositories and add your own custom external courses, Khan Academy links, GitHub repos, or documentation to embed directly into the modules.
              </p>
            </div>

            {/* Standard Repository Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { id: 'International Standards (ISO/IEC, NIST, IEEE)', desc: 'Official technical standards, RFCs, and cybersecurity guidelines' },
                { id: 'Academic & Peer-Reviewed Literature (arXiv, MIT OCW)', desc: 'Rigorous open research papers, university lecture notes, and proofs' },
                { id: 'Statutory Codes & Regulatory Treaties (UN, EU Directives)', desc: 'Legal jurisprudence, international conventions, and compliance matrices' },
                { id: 'Open-Source Courseware (Khan Academy, MIT OCW, Coursera)', desc: 'Interactive lessons, online tutorials, and open educational videos' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3 border rounded-xl flex items-start gap-3 cursor-pointer transition-colors ${
                    integrations.includes(opt.id)
                      ? 'border-[#1A73E8] bg-blue-50/50 text-[#202124]'
                      : 'border-[#E0E0E0] bg-white text-[#5F6368] hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={integrations.includes(opt.id)}
                    onChange={() => toggleIntegration(opt.id)}
                    className="mt-0.5 accent-[#1A73E8]"
                  />
                  <div>
                    <span className="block font-medium text-[#202124]">{opt.id}</span>
                    <span className="text-[11px] text-[#5F6368]">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Custom External Links Builder in the Form */}
            <div className="bg-gray-50 border border-[#E0E0E0] rounded-xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-[#1A73E8]" />
                  <span className="text-xs font-semibold text-[#202124] uppercase tracking-wide">
                    Add Custom External Links & Courses to Include
                  </span>
                </div>
                <span className="text-[11px] text-[#5F6368]">
                  {customLinks.length} custom integration{customLinks.length === 1 ? '' : 's'} added
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-medium text-[#5F6368] mb-1">Resource / Course Title</label>
                  <input
                    type="text"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder="e.g. Khan Academy Cryptography"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-medium text-[#5F6368] mb-1">Direct URL</label>
                  <input
                    type="url"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://www.khanacademy.org/..."
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-[#5F6368] mb-1">Platform / Type</label>
                  <select
                    value={newLinkPlatform}
                    onChange={(e) => setNewLinkPlatform(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                  >
                    <option value="Khan Academy">Khan Academy</option>
                    <option value="MIT OpenCourseWare">MIT OCW</option>
                    <option value="Coursera">Coursera</option>
                    <option value="edX">edX</option>
                    <option value="GitHub Repo">GitHub Repo</option>
                    <option value="Official Standard">Official Standard</option>
                    <option value="Academic Paper">Academic Paper</option>
                    <option value="Documentation">Documentation</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddCustomLink}
                    disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                    className="w-full py-2 px-3 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>
              </div>

              {/* Added Links List */}
              {customLinks.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <span className="block text-[11px] font-medium text-[#5F6368]">
                    Links to be embedded in generated course modules:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {customLinks.map((link, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white border border-[#E0E0E0] rounded-lg flex items-center justify-between text-xs gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#202124] truncate">{link.title}</span>
                            <span className="text-[10px] font-semibold text-[#1A73E8] bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                              {link.platform}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#5F6368] truncate block">{link.url}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomLink(idx)}
                          className="text-[#5F6368] hover:text-red-600 p-1 rounded"
                          title="Remove link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submission Area */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E0E0E0]">
              <button
                type="submit"
                disabled={isGenerating}
                className="px-6 py-2.5 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Synthesizing Full Course Roadmap & Content...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Build Custom Syllabus & Online Learning Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW: ROADMAP & COURSE EXPERIENCE                   */}
      {/* ==================================================== */}
      {activeView === 'roadmap' && activeSyllabus && (
        <div className="space-y-6">
          {/* Syllabus Switcher Strip if multiple exist */}
          {syllabi.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-[#5F6368] shrink-0 font-medium">Your Syllabi:</span>
              {syllabi.map((syl) => (
                <button
                  key={syl.id}
                  onClick={() => setSelectedSyllabusId(syl.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 transition-colors ${
                    syl.id === activeSyllabus.id
                      ? 'bg-[#1A73E8] text-white'
                      : 'bg-gray-100 text-[#5F6368] hover:text-[#202124]'
                  }`}
                >
                  {syl.title}
                </button>
              ))}
            </div>
          )}

          {/* Master Syllabus Overview Card */}
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E0E0E0]">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#5F6368]">
                  <span className="text-[#1A73E8] font-medium">{activeSyllabus.domain}</span>
                  <span>·</span>
                  <span>Current Phase: {activeSyllabus.spiral_phase}</span>
                  <span>·</span>
                  <span>Status: {activeSyllabus.status}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-normal text-[#202124] tracking-tight">
                  {activeSyllabus.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed max-w-3xl">
                  {activeSyllabus.goal_description}
                </p>
                {activeSyllabus.target_project && (
                  <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg text-xs text-[#202124]">
                    <span className="font-semibold text-[#1A73E8] block mb-0.5">Connected Future Project:</span>
                    <span>{activeSyllabus.target_project}</span>
                  </div>
                )}
              </div>

              {/* Action Toolbar on Roadmap */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsAddModuleModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium text-[#1A73E8] bg-blue-50 hover:bg-blue-100/70 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Module</span>
                </button>

                <button
                  onClick={handleExportText}
                  className="px-3 py-1.5 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Syllabus</span>
                </button>

                <button
                  onClick={() => setActiveView('form')}
                  className="px-3 py-1.5 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Syllabus</span>
                </button>
              </div>
            </div>

            {/* Catalyst & Progress Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 p-3.5 bg-gray-50 border border-[#E0E0E0] rounded-xl flex items-start gap-3">
                <Compass className="w-5 h-5 text-[#1A73E8] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] font-semibold text-[#5F6368] uppercase tracking-wide">
                    Overarching Relational Catalyst
                  </span>
                  <span className="text-xs font-medium text-[#202124] leading-relaxed">
                    {activeSyllabus.catalyst}
                  </span>
                </div>
              </div>

              <div className="md:col-span-4 p-3.5 bg-gray-50 border border-[#E0E0E0] rounded-xl space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#202124]">Course Completion</span>
                  <span className="font-semibold text-[#1A73E8]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#E0E0E0] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1A73E8] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#5F6368] flex justify-between">
                  <span>{completedCount} of {activeSyllabus.modules.length} modules completed</span>
                  {completedCount === activeSyllabus.modules.length && (
                    <span className="text-emerald-700 font-medium">All Complete!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Module Cards: Online Learning Roadmap (Khan Academy / Google styled) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                Online Learning Roadmap & Course Modules ({activeSyllabus.modules.length})
              </h3>
              <span className="text-xs text-[#5F6368]">
                Click &quot;Study Module&quot; to access full course lessons, quizzes, and integrated external resources
              </span>
            </div>

            <div className="space-y-4">
              {activeSyllabus.modules.map((mod, idx) => {
                const isCompleted = mod.completion_status === 'Completed';
                const hasQuizAnswers = !!mod.lesson_content?.userQuizAnswers;

                return (
                  <div
                    key={mod.id || idx}
                    className={`bg-white border rounded-2xl p-6 transition-all shadow-xs ${
                      isCompleted
                        ? 'border-emerald-300 bg-emerald-50/10'
                        : 'border-[#E0E0E0] hover:border-[#1A73E8]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 text-[11px] font-semibold text-[#1A73E8] bg-blue-50 border border-blue-200 rounded">
                            {mod.spiral_phase || 'Initiation'}
                          </span>
                          <span className="text-xs text-[#5F6368]">·</span>
                          <span className="text-xs text-[#5F6368] font-medium">Module {idx + 1}</span>

                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[11px] font-medium text-[#5F6368] bg-gray-100 rounded-full">
                              {mod.completion_status}
                            </span>
                          )}

                          {hasQuizAnswers && (
                            <span className="px-2 py-0.5 text-[11px] font-medium text-purple-700 bg-purple-50 rounded-full border border-purple-200">
                              Quiz Passed ({mod.lesson_content?.userQuizScore}/2)
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-base sm:text-lg font-medium text-[#202124]">
                            {mod.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#5F6368] mt-1 leading-relaxed">
                            {mod.description}
                          </p>
                        </div>

                        {mod.catalyst && (
                          <div className="text-xs text-[#202124] flex items-start gap-1.5">
                            <span className="font-semibold text-[#1A73E8]">Relational Catalyst:</span>
                            <span className="text-[#5F6368]">{mod.catalyst}</span>
                          </div>
                        )}

                        {/* Multi-Scale Focus Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <span className="block text-[10px] font-semibold text-[#5F6368] uppercase">Micro Scale</span>
                            <span className="text-[#202124] text-[11px] font-medium line-clamp-1">{mod.micro_focus}</span>
                          </div>
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <span className="block text-[10px] font-semibold text-[#5F6368] uppercase">Meso Scale</span>
                            <span className="text-[#202124] text-[11px] font-medium line-clamp-1">{mod.meso_focus}</span>
                          </div>
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <span className="block text-[10px] font-semibold text-[#5F6368] uppercase">Macro Scale</span>
                            <span className="text-[#202124] text-[11px] font-medium line-clamp-1">{mod.macro_focus}</span>
                          </div>
                        </div>

                        {/* Integrated Resources Preview */}
                        {mod.resources && mod.resources.length > 0 && (
                          <div className="pt-2 border-t border-gray-100">
                            <span className="block text-[11px] font-semibold text-[#5F6368] uppercase mb-1.5">
                              Integrated External Resources ({mod.resources.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {mod.resources.map((res, rIdx) => (
                                <a
                                  key={rIdx}
                                  href={res.url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-gray-50 hover:bg-blue-50 border border-[#E0E0E0] hover:border-blue-300 rounded-md text-[#202124] transition-colors"
                                >
                                  <span className="font-semibold text-[#1A73E8]">[{res.type}]</span>
                                  <span className="truncate max-w-[200px]">{res.title}</span>
                                  <ExternalLink className="w-3 h-3 text-[#5F6368]" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons on module */}
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 pt-2 md:pt-0">
                        <button
                          onClick={() => handleSelectModule(mod)}
                          className="px-4 py-2 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Study Module</span>
                        </button>

                        <button
                          onClick={() => setTargetModuleForResource(mod.id)}
                          className="px-3 py-1.5 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors whitespace-nowrap"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Link</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* VIEW: COMPLETION CERTIFICATE                          */}
      {/* ==================================================== */}
      {activeView === 'certificate' && activeSyllabus && (
        <div className="bg-white border-2 border-[#1A73E8]/30 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1A73E8] flex items-center justify-center mx-auto border border-blue-200">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#1A73E8] uppercase tracking-widest">
              Relational Epistemology & Systems Pedagogy Institute
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#202124]">
              Certificate of Relational Competency
            </h2>
            <p className="text-xs text-[#5F6368]">
              This certifies that the practitioner has satisfied the 4-phase spiral requirements.
            </p>
          </div>

          <div className="py-4 border-y border-[#E0E0E0] space-y-1">
            <span className="text-xs text-[#5F6368]">Awarded to</span>
            <h3 className="text-xl font-bold text-[#202124]">{user.name || 'Practitioner'}</h3>
            <span className="text-xs text-[#5F6368]">{user.email || 'Verified Learner'}</span>
          </div>

          <div className="space-y-2 text-left bg-gray-50 p-4 rounded-xl text-xs">
            <div className="flex justify-between">
              <span className="font-semibold text-[#202124]">Syllabus:</span>
              <span className="text-[#5F6368]">{activeSyllabus.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#202124]">Domain Arena:</span>
              <span className="text-[#1A73E8] font-medium">{activeSyllabus.domain}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#202124]">Pedagogical Spiral:</span>
              <span className="text-[#5F6368]">Initiation → Descent → Reconfiguration → Ascent (All Completed)</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="px-5 py-2 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Certificate</span>
            </button>
            <button
              onClick={() => setActiveView('roadmap')}
              className="px-4 py-2 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg"
            >
              Return to Course Roadmap
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD RESOURCE TO MODULE                        */}
      {/* ==================================================== */}
      {targetModuleForResource && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#1A73E8]" />
                <h3 className="text-sm font-semibold text-[#202124]">Add External Link / Course to Module</h3>
              </div>
              <button
                onClick={() => setTargetModuleForResource(null)}
                className="text-[#5F6368] hover:text-[#202124] p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddResourceSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[#202124]">Resource / Course Title *</label>
                <input
                  type="text"
                  required
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  placeholder="e.g. Khan Academy Cryptography Lessons"
                  className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#202124]">Direct URL *</label>
                <input
                  type="url"
                  required
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#202124]">Platform / Resource Type</label>
                <select
                  value={resourcePlatform}
                  onChange={(e) => setResourcePlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                >
                  <option value="Khan Academy">Khan Academy</option>
                  <option value="MIT OpenCourseWare">MIT OpenCourseWare</option>
                  <option value="Coursera">Coursera</option>
                  <option value="edX">edX</option>
                  <option value="GitHub Repo">GitHub Repo</option>
                  <option value="Official Standard">Official Standard (ISO/NIST)</option>
                  <option value="Academic Paper">Academic Paper (arXiv/SSRN)</option>
                  <option value="Documentation">Technical Documentation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#202124]">Integration Summary / Notes</label>
                <textarea
                  rows={2}
                  value={resourceSummary}
                  onChange={(e) => setResourceSummary(e.target.value)}
                  placeholder="How does this resource inform this module?"
                  className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E0E0E0]">
                <button
                  type="button"
                  onClick={() => setTargetModuleForResource(null)}
                  className="px-3 py-1.5 text-[#5F6368] hover:text-[#202124]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs"
                >
                  Save Integration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD CUSTOM MODULE TO SYLLABUS                 */}
      {/* ==================================================== */}
      {isAddModuleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#1A73E8]" />
                <h3 className="text-sm font-semibold text-[#202124]">Add Custom Module to Syllabus</h3>
              </div>
              <button
                onClick={() => setIsAddModuleModalOpen(false)}
                className="text-[#5F6368] hover:text-[#202124] p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddModuleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-[#202124]">Module Title *</label>
                <input
                  type="text"
                  required
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder="e.g. 05. Advanced Multi-Jurisdictional Arbitration"
                  className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[#202124]">Spiral Phase</label>
                  <select
                    value={newModulePhase}
                    onChange={(e) => setNewModulePhase(e.target.value as SpiralPhase)}
                    className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                  >
                    <option value="Initiation">Initiation</option>
                    <option value="Descent">Descent</option>
                    <option value="Reconfiguration">Reconfiguration</option>
                    <option value="Ascent">Ascent</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#202124]">Catalyst Concept</label>
                  <input
                    type="text"
                    value={newModuleCatalyst}
                    onChange={(e) => setNewModuleCatalyst(e.target.value)}
                    placeholder="e.g. Polycentric Consensus"
                    className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#202124]">Module Description</label>
                <textarea
                  rows={2}
                  value={newModuleDesc}
                  onChange={(e) => setNewModuleDesc(e.target.value)}
                  placeholder="What core competencies are taught?"
                  className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] outline-hidden text-[#202124]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-medium text-[#202124]">Micro Focus</label>
                  <input
                    type="text"
                    value={newModuleMicro}
                    onChange={(e) => setNewModuleMicro(e.target.value)}
                    placeholder="Technical action"
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E0E0E0] rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#202124]">Meso Focus</label>
                  <input
                    type="text"
                    value={newModuleMeso}
                    onChange={(e) => setNewModuleMeso(e.target.value)}
                    placeholder="Workflow synthesis"
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E0E0E0] rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#202124]">Macro Focus</label>
                  <input
                    type="text"
                    value={newModuleMacro}
                    onChange={(e) => setNewModuleMacro(e.target.value)}
                    placeholder="Statutory policy"
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E0E0E0] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E0E0E0]">
                <button
                  type="button"
                  onClick={() => setIsAddModuleModalOpen(false)}
                  className="px-3 py-1.5 text-[#5F6368] hover:text-[#202124]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs"
                >
                  Add Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* INTERACTIVE LESSON VIEWER MODAL                      */}
      {/* ==================================================== */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-2xl max-w-3xl w-full my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E0E0E0] space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                    <span>Spiral Phase: {selectedModule.spiral_phase || 'Initiation'}</span>
                    <span>·</span>
                    <span className="text-[#1A73E8]">{selectedModule.catalyst || 'Relational Mechanism'}</span>
                  </div>
                  <h3 className="text-xl font-medium text-[#202124]">{selectedModule.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="p-1 text-[#5F6368] hover:text-[#202124] rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs inside the Lesson */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
                <button
                  onClick={() => setLessonActiveTab('study')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    lessonActiveTab === 'study' ? 'bg-[#1A73E8] text-white' : 'text-[#5F6368] hover:bg-gray-100'
                  }`}
                >
                  1. Study & Conceptual Guide
                </button>
                <button
                  onClick={() => setLessonActiveTab('resources')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    lessonActiveTab === 'resources' ? 'bg-[#1A73E8] text-white' : 'text-[#5F6368] hover:bg-gray-100'
                  }`}
                >
                  2. External Links & Courses ({selectedModule.resources?.length || 0})
                </button>
                <button
                  onClick={() => setLessonActiveTab('quiz')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    lessonActiveTab === 'quiz' ? 'bg-[#1A73E8] text-white' : 'text-[#5F6368] hover:bg-gray-100'
                  }`}
                >
                  3. Knowledge Check Quiz
                </button>
                <button
                  onClick={() => setLessonActiveTab('rubric')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    lessonActiveTab === 'rubric' ? 'bg-[#1A73E8] text-white' : 'text-[#5F6368] hover:bg-gray-100'
                  }`}
                >
                  4. REP Rubric & Reflection
                </button>
              </div>
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 text-[#202124]">
              {skillAwardedNotice && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Skill verified and added to your active Skill Inventory!</span>
                  </div>
                </div>
              )}

              {/* TAB 1: STUDY & CONCEPTUAL GUIDE */}
              {lessonActiveTab === 'study' && (
                <div className="space-y-6">
                  {/* Key Takeaway */}
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
                    <span className="block text-xs font-semibold text-[#1A73E8] uppercase tracking-wide mb-1">
                      Key Takeaway
                    </span>
                    <p className="text-sm font-medium text-[#202124] leading-relaxed">
                      {selectedModule.lesson_content?.key_takeaway || selectedModule.description}
                    </p>
                  </div>

                  {/* Conceptual Foundation */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                      Conceptual Foundation
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed whitespace-pre-line">
                      {selectedModule.lesson_content?.conceptual_foundation ||
                        'In relational systems thinking, boundaries are dynamic agreements rather than fixed spatial walls. Examining how feedback loops traverse institutional layers prevents externalized costs from accumulating into unexpected failures.'}
                    </p>
                  </div>

                  {/* Real-World Case Study */}
                  {selectedModule.lesson_content?.case_study && (
                    <div className="p-4 bg-gray-50 border border-[#E0E0E0] rounded-xl space-y-1.5">
                      <span className="block text-xs font-semibold text-[#202124] uppercase tracking-wide">
                        Empirical Case Study
                      </span>
                      <p className="text-xs text-[#5F6368] leading-relaxed">
                        {selectedModule.lesson_content.case_study}
                      </p>
                    </div>
                  )}

                  {/* Practical Exercise */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                      Hands-On Practical Lab
                    </h4>
                    <div className="p-4 border border-[#E0E0E0] rounded-xl bg-white space-y-2">
                      <p className="text-xs sm:text-sm text-[#202124] font-medium">
                        {selectedModule.lesson_content?.practical_exercise ||
                          'Trace three relational linkages in your target project that span from localized code/data to macro regulatory standards.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EXTERNAL LINKS & INTEGRATED COURSES */}
              {lessonActiveTab === 'resources' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E0E0E0]">
                    <div>
                      <h4 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                        Accredited Standards, Course Links & Repositories
                      </h4>
                      <span className="text-xs text-[#5F6368]">
                        External courseware, technical documentation, and primary sources curated for this module.
                      </span>
                    </div>
                    <button
                      onClick={() => setTargetModuleForResource(selectedModule.id)}
                      className="px-3 py-1.5 text-xs font-medium text-[#1A73E8] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Link to Module</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedModule.resources && selectedModule.resources.length > 0 ? (
                      selectedModule.resources.map((res, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white border border-[#E0E0E0] rounded-xl hover:border-[#1A73E8] transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-[#202124]">{res.title}</span>
                                <span className="text-[10px] uppercase font-semibold text-[#1A73E8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  {res.type}
                                </span>
                              </div>
                              {res.summary && <p className="text-xs text-[#5F6368] leading-relaxed">{res.summary}</p>}
                              <span className="text-[11px] text-[#5F6368] block">Authority / Source: {res.source || 'Accredited Reference'}</span>
                            </div>

                            {res.url && res.url !== '#' && (
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-xs font-medium text-[#1A73E8] bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors"
                              >
                                <span>Open Course / Link</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-gray-50 rounded-xl border border-[#E0E0E0]">
                        <BookMarked className="w-8 h-8 text-[#5F6368] mx-auto mb-2" />
                        <span className="block text-xs font-medium text-[#202124]">No external links added yet</span>
                        <p className="text-xs text-[#5F6368] mt-1 mb-3">
                          You can attach Khan Academy courses, documentation links, GitHub repos, or research papers to this module.
                        </p>
                        <button
                          onClick={() => setTargetModuleForResource(selectedModule.id)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-[#1A73E8] rounded-lg"
                        >
                          Add First External Resource
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: KNOWLEDGE CHECK (QUIZ) */}
              {lessonActiveTab === 'quiz' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                      Interactive Relational Knowledge Check
                    </h4>
                    <p className="text-xs text-[#5F6368]">
                      Verify your relational reasoning and distinction-making before applying this module to your project.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {(selectedModule.lesson_content?.quiz || []).map((q, qIdx) => {
                      const userChoice = selectedAnswers[qIdx];
                      const isCorrect = userChoice === q.correctIndex;

                      return (
                        <div key={qIdx} className="p-4 bg-gray-50 border border-[#E0E0E0] rounded-xl space-y-3">
                          <span className="block text-xs font-medium text-[#202124] leading-relaxed">
                            Question {qIdx + 1}: {q.question}
                          </span>

                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = userChoice === optIdx;
                              let btnClass = 'border-[#E0E0E0] bg-white text-[#202124] hover:bg-gray-100';

                              if (quizSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
                                } else if (isSelected && !isCorrect) {
                                  btnClass = 'border-red-400 bg-red-50 text-red-900';
                                }
                              } else if (isSelected) {
                                btnClass = 'border-[#1A73E8] bg-blue-50 text-[#1A73E8] font-medium';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleQuizAnswer(qIdx, optIdx)}
                                  className={`w-full text-left p-3 text-xs border rounded-lg transition-colors flex items-center justify-between ${btnClass}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && optIdx === q.correctIndex && (
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className="p-3 bg-white border border-[#E0E0E0] rounded-lg text-xs space-y-1">
                              <span className="font-semibold block text-[#202124]">
                                {isCorrect ? 'Correct!' : 'Relational Explanation:'}
                              </span>
                              <p className="text-[#5F6368]">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-2">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        className="px-5 py-2 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs"
                      >
                        Submit & Check Answers
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700">
                        Quiz complete! Proceed to the next section or submit your reflection below.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: REP RUBRIC & REFLECTION NOTES */}
              {lessonActiveTab === 'rubric' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                      REP Dimension Self-Evaluation
                    </h4>
                    <p className="text-xs text-[#5F6368]">
                      Rate your mastery for this module across the core Relational Epistemology dimensions (1 = Emerging, 4 = Exemplary).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {Object.entries(repRatings).map(([dim, score]) => (
                      <div key={dim} className="p-3.5 bg-gray-50 border border-[#E0E0E0] rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-[#202124]">{dim}</span>
                          <span className="font-semibold text-[#1A73E8]">Level {score}/4</span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setRepRatings((prev) => ({ ...prev, [dim]: val }))}
                              className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                                score === val
                                  ? 'bg-[#1A73E8] text-white shadow-xs'
                                  : 'bg-white border border-[#E0E0E0] text-[#5F6368] hover:bg-gray-100'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reflection Journal */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                      Reflective Recursion & Notes Journal
                    </h4>
                    <p className="text-xs text-[#5F6368]">
                      {selectedModule.feedback_prompts?.[0] ||
                        'What analytical distinctions did you treat as objective facts rather than institutional conventions?'}
                    </p>
                    <textarea
                      rows={3}
                      value={userReflection}
                      onChange={(e) => setUserReflection(e.target.value)}
                      placeholder="Write your reflective observations here..."
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E0E0E0] rounded-xl focus:border-[#1A73E8] outline-hidden text-[#202124]"
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-[#5F6368] uppercase tracking-wide">
                      Personal Lab Notes & Artifact Links
                    </h4>
                    <textarea
                      rows={2}
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      placeholder="Add personal notes, repo links, or key takeaway summaries..."
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E0E0E0] rounded-xl focus:border-[#1A73E8] outline-hidden text-[#202124]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-5 border-t border-[#E0E0E0] bg-gray-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedModule(null)}
                className="px-4 py-2 text-xs font-medium text-[#5F6368] hover:text-[#202124]"
              >
                Close Modal
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveReflection(false)}
                  className="px-4 py-2 text-xs font-medium text-[#202124] bg-white border border-[#E0E0E0] rounded-lg hover:bg-gray-100"
                >
                  Save Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveReflection(true)}
                  className="px-5 py-2 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete & Award Verified Skill</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
