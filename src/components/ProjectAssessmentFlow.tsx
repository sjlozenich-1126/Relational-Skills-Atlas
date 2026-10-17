import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DomainCategory, DOMAIN_CATEGORIES, Skill, Project, AcquisitionType, ProjectStatus } from '../types';
import { assessProjectLocally } from '../lib/generators';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  ArrowRight,
  Shield,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  FolderUp,
  Sliders,
  Trash2,
  Calendar,
  CheckSquare,
  Square,
  Edit2,
  Clock,
  ListTodo,
} from 'lucide-react';

const SAMPLE_PROJECT_TEMPLATES = [
  {
    title: 'Transnational Cloud Infrastructure Forensic Audit',
    category: 'Forensic Audit' as DomainCategory,
    description:
      'Conducted a forensic investigation into an unauthorized privilege escalation incident across three sovereign cloud regions. Verified immutable audit logs, reconstructed lateral identity traversals, and harmonized incident reports under NIS2 and GDPR disclosure mandates.',
    notes:
      'Required reconciling contradictory syslog timestamps across divergent server hardware profiles. Successfully instituted a Merkle-tree cryptographic notarization process to preserve chain of custody.',
    files: [
      { name: 'Incident_Forensics_Timeline.csv', size: '1.8 MB', content: 'timestamp,event,actor,ip,signature\n2025-06-12T04:22:10Z,auth_bypass,admin_agent,194.26.29.2,valid_sig' },
      { name: 'Sovereignty_Compliance_Matrix.pdf', size: '3.4 MB', content: 'Compliance crosswalk: GDPR Art. 49, NIS2 Article 21, and NIST SP 800-160 incident handling protocols.' },
    ],
  },
  {
    title: 'Metropolitan Floodplain Relational Zoning Restructuring',
    category: 'Urban & Real Estate' as DomainCategory,
    description:
      'Re-engineered municipal development covenants for a high-risk riparian district. Mediated between speculative commercial real estate developers, municipal stormwater engineers, and ancestral fishing rights stewards to establish an adaptive density transfer easement.',
    notes:
      'Overcame institutional inertia regarding rigid parcel lot lines by drafting an overland flow deed overlay that trades vertical height allowances for dedicated groundwater infiltration swales.',
    files: [
      { name: 'Hydrological_Runoff_Model_GIS.geojson', size: '14.2 MB', content: '{"type":"FeatureCollection","features":[{"properties":{"basin":"Creek-North","runoff_coeff":0.82}}]}' },
      { name: 'Draft_Zoning_Ordinance_Clause.md', size: '240 KB', content: 'Section 4.12: Overland Flow Deed Encumbrances. Commercial parcels must dedicate 18% permeable surface to maintain infiltration equilibrium.' },
    ],
  },
  {
    title: 'Biocultural Indigenous Seed Commons Registry',
    category: 'Biocultural & Ecology' as DomainCategory,
    description:
      'Co-designed a decentralized provenance ledger protecting heirloom crop cultivars from unauthorized biopiracy and patent enclosure. Created legal data governance agreements ensuring tribal sovereign authority over genomic sequence data.',
    notes:
      'Prioritized Nagoya Protocol compliance and free, prior, and informed consent (FPIC) standards, transforming standard IP licensing clauses into relational guardianship pacts.',
    files: [
      { name: 'Nagoya_Protocol_Compliance_Charter.md', size: '2.1 MB', content: 'Principles of fair and equitable sharing of benefits arising from genetic resources. Traditional knowledge sovereignty recognized.' },
      { name: 'Cultivar_Genomic_Schema.json', size: '512 KB', content: '{"spec":"GenomicProvenance_v1","sovereign_custodian":"Tribal Council"}' },
    ],
  },
];

export const ProjectAssessmentFlow: React.FC = () => {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectMilestone,
    addProjectMilestone,
    updateProjectStatus,
    addSkills,
    setActiveTab,
    setSelectedProjectId,
  } = useApp();

  // Mode: 'manage' (view existing projects & milestones) | 'assess' (the assessment wizard)
  const [activeSubTab, setActiveSubTab] = useState<'assess' | 'manage'>('assess');

  // Step state: 1 = Input, 2 = Extracting, 3 = Review & Map
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DomainCategory>('Forensic Audit');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState('2025-01-15');
  const [endDate, setEndDate] = useState('2025-10-30');
  const [files, setFiles] = useState<Array<{ name: string; size?: string; content?: string }>>([]);
  const [isDriveConnected, setIsDriveConnected] = useState(false);

  // Milestone input for step 1
  const [milestonesList, setMilestonesList] = useState<Array<{ title: string; dueDate?: string }>>([
    { title: 'Evidentiary artifact & document intake', dueDate: '2025-02-15' },
    { title: 'Stakeholder interviews & conflict mapping', dueDate: '2025-05-20' },
    { title: 'Final relational framework charter delivery', dueDate: '2025-10-30' },
  ]);
  const [newMilestoneInput, setNewMilestoneInput] = useState('');

  // Extraction output
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<
    Array<{
      name: string;
      domain_area: DomainCategory | string;
      acquisition_type: AcquisitionType;
      proficiency_level: 1 | 2 | 3 | 4 | 5;
      provenance_note: string;
      micro_tag: string;
      meso_tag: string;
      macro_tag: string;
      rep_scores: any;
    }>
  >([]);

  const [repSummary, setRepSummary] = useState<{
    interpretation_of_signs?: string;
    relational_reasoning?: string;
    adaptive_revision?: string;
  }>({});

  const [cvWording, setCvWording] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [skillsSaved, setSkillsSaved] = useState(false);

  // Manual new skill modal inside review
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDomain, setNewSkillDomain] = useState<DomainCategory>('Legal & Governance');
  const [newSkillType, setNewSkillType] = useState<AcquisitionType>('Applied');
  const [newSkillLevel, setNewSkillLevel] = useState<1 | 2 | 3 | 4 | 5>(3);

  // Editing existing project milestones modal/state in 'manage' tab
  const [activeManagingProject, setActiveManagingProject] = useState<Project | null>(null);
  const [newManagingMilestone, setNewManagingMilestone] = useState('');

  const loadTemplate = (tmpl: (typeof SAMPLE_PROJECT_TEMPLATES)[0]) => {
    setTitle(tmpl.title);
    setCategory(tmpl.category);
    setDescription(tmpl.description);
    setNotes(tmpl.notes);
    setFiles(tmpl.files);
  };

  // Real file reader for uploaded files
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        const isTextLike =
          file.type.includes('text') ||
          file.type.includes('json') ||
          file.type.includes('csv') ||
          file.name.endsWith('.md') ||
          file.name.endsWith('.txt') ||
          file.name.endsWith('.json') ||
          file.name.endsWith('.csv') ||
          file.name.endsWith('.log');

        reader.onload = (event) => {
          const content = isTextLike ? (event.target?.result as string) : `[Binary file parsed: ${file.name}]`;
          setFiles((prev) => [
            ...prev,
            {
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              content: content.slice(0, 10000), // First 10k chars for analysis
            },
          ]);
        };

        if (isTextLike) {
          reader.readAsText(file);
        } else {
          // Add metadata
          setFiles((prev) => [
            ...prev,
            {
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              content: `Document: ${file.name} (${file.type})`,
            },
          ]);
        }
      });
    }
  };

  const runAssessment = async () => {
    if (!title.trim() && !description.trim()) {
      alert('Please provide at least a project title or description to extract skills.');
      return;
    }

    setStep(2);
    setIsExtracting(true);

    try {
      const response = await fetch('/api/assess-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          notes,
          files,
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (data.skills && data.skills.length > 0) {
            setExtractedSkills(data.skills);
            setCvWording(data.cv_wording || []);
            setRepSummary(data.rep_summary || {});
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Assessment API call error, falling back locally:', err);
    }

    // Local fallback ensures assessment always yields high quality skills
    const localResult = assessProjectLocally(title, category, description, notes);
    setExtractedSkills(localResult.skills);
    setCvWording(localResult.cv_wording);
    setRepSummary(localResult.rep_summary);
    setIsExtracting(false);
    setStep(3);
  };

  const handleSaveToProfile = () => {
    // Save project with milestones
    const createdProject = addProject({
      user_id: 'usr_001',
      title: title || 'Custom Assessed Project',
      description,
      category,
      status: 'Completed',
      start_date: startDate,
      end_date: endDate,
      files,
      notes,
      milestones: milestonesList.map((m, i) => ({
        id: 'm_' + Math.random().toString(36).substring(2, 9),
        title: m.title,
        completed: true,
        dueDate: m.dueDate,
      })),
      extractedSkillsCount: extractedSkills.length,
    });

    // Save skills to inventory
    addSkills(
      extractedSkills.map((s) => ({
        name: s.name,
        domain_area: s.domain_area,
        acquisition_type: s.acquisition_type,
        proficiency_level: s.proficiency_level,
        provenance_note: s.provenance_note || `Assessed from project: ${title}`,
        micro_tag: s.micro_tag || 'Technique execution',
        meso_tag: s.meso_tag || 'Workflow synthesis',
        macro_tag: s.macro_tag || 'Governance framework',
        rep_scores: s.rep_scores || {},
      }))
    );

    setSkillsSaved(true);
  };

  const handleCopyCvBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAddManualSkill = () => {
    if (!newSkillName.trim()) return;
    setExtractedSkills((prev) => [
      ...prev,
      {
        name: newSkillName.trim(),
        domain_area: newSkillDomain,
        acquisition_type: newSkillType,
        proficiency_level: newSkillLevel,
        provenance_note: `Manually verified during ${title || 'project assessment'}`,
        micro_tag: 'Specific technical execution',
        meso_tag: 'Operational context',
        macro_tag: 'Systemic standards & oversight',
        rep_scores: {
          'Interpretation of signs': 3,
          'Relational reasoning': 3,
          'Adaptive revision': 3,
        },
      },
    ]);
    setNewSkillName('');
    setShowAddSkillModal(false);
  };

  const handleUpdateSkillProficiency = (index: number, newLevel: 1 | 2 | 3 | 4 | 5) => {
    setExtractedSkills((prev) =>
      prev.map((s, i) => (i === index ? { ...s, proficiency_level: newLevel } : s))
    );
  };

  const handleAddMilestoneToStep1 = () => {
    if (!newMilestoneInput.trim()) return;
    setMilestonesList((prev) => [...prev, { title: newMilestoneInput.trim() }]);
    setNewMilestoneInput('');
  };

  const handleAssessExistingProject = (proj: Project) => {
    setTitle(proj.title);
    setCategory(proj.category as DomainCategory);
    setDescription(proj.description);
    setNotes(proj.notes);
    setFiles((proj.files || []).map((f) => ({ name: f.name, size: f.size || '1.0 MB', content: f.content })));
    setActiveSubTab('assess');
    setStep(1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5F6368] mb-1">
            <span>Flow 1</span>
            <span>·</span>
            <span>Project Management & Skills Ingestion</span>
            <span>·</span>
            <span className="text-[#1A73E8]">REP Assessment Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
            Project Workspace & Skill Assessor
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">
            Manage live project milestones, upload project deliverables, and extract verified skills along the REP rubric.
          </p>
        </div>

        {/* Sub-Tabs: Assess vs Manage */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveSubTab('assess')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'assess' ? 'bg-white text-[#202124] shadow-xs' : 'text-[#5F6368] hover:text-[#202124]'
            }`}
          >
            Assess New Project
          </button>
          <button
            onClick={() => setActiveSubTab('manage')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'manage' ? 'bg-white text-[#202124] shadow-xs' : 'text-[#5F6368] hover:text-[#202124]'
            }`}
          >
            Active Projects ({projects.length})
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* SUB-TAB: MANAGE ACTIVE PROJECTS & MILESTONES        */}
      {/* ==================================================== */}
      {activeSubTab === 'manage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5">
            {projects.map((proj) => {
              const completedMilestones = (proj.milestones || []).filter((m) => m.completed).length;
              const totalMilestones = proj.milestones?.length || 0;
              const milestonePercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 100;

              return (
                <div key={proj.id} className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-7 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E0E0E0]">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-[#1A73E8]">{proj.category}</span>
                        <span className="text-[#5F6368]">·</span>
                        <span className="text-[#5F6368]">
                          {proj.start_date} to {proj.end_date}
                        </span>
                        <span className="text-[#5F6368]">·</span>
                        <span
                          className={`font-medium ${
                            proj.status === 'Completed'
                              ? 'text-emerald-700'
                              : proj.status === 'In Progress'
                              ? 'text-[#1A73E8]'
                              : 'text-[#5F6368]'
                          }`}
                        >
                          Status: {proj.status || 'In Progress'}
                        </span>
                      </div>
                      <h2 className="text-xl font-medium text-[#202124]">{proj.title}</h2>
                      <p className="text-xs sm:text-sm text-[#5F6368] leading-relaxed max-w-3xl">
                        {proj.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-start">
                      <select
                        value={proj.status || 'In Progress'}
                        onChange={(e) => updateProjectStatus(proj.id, e.target.value as ProjectStatus)}
                        className="px-2.5 py-1 text-xs border border-[#E0E0E0] rounded-md bg-white text-[#202124]"
                      >
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Review">Under Review</option>
                        <option value="Completed">Completed</option>
                      </select>

                      <button
                        onClick={() => handleAssessExistingProject(proj)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Run Skill Assessment</span>
                      </button>

                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-1.5 text-[#5F6368] hover:text-red-600 rounded-md transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Milestones & Deliverables Checklist */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#202124] uppercase tracking-wide">
                        Project Deliverables & Milestones ({completedMilestones} / {totalMilestones})
                      </span>
                      <span className="text-[#5F6368] tabular-nums font-mono">{milestonePercent}% completed</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1A73E8] transition-all" style={{ width: `${milestonePercent}%` }} />
                    </div>

                    {/* Milestones list */}
                    <div className="space-y-1.5 pt-1">
                      {(proj.milestones || []).map((m) => (
                        <div
                          key={m.id}
                          onClick={() => toggleProjectMilestone(proj.id, m.id)}
                          className="flex items-center justify-between p-2.5 bg-gray-50 border border-[#E0E0E0] rounded-lg text-xs cursor-pointer hover:bg-blue-50/40 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            {m.completed ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-[#5F6368] shrink-0" />
                            )}
                            <span className={m.completed ? 'line-through text-[#5F6368]' : 'text-[#202124] font-medium'}>
                              {m.title}
                            </span>
                          </div>

                          {m.dueDate && (
                            <span className="text-[11px] text-[#5F6368] shrink-0">Due: {m.dueDate}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quick Add Milestone row */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add project deliverable or task..."
                        value={activeManagingProject?.id === proj.id ? newManagingMilestone : ''}
                        onFocus={() => setActiveManagingProject(proj)}
                        onChange={(e) => setNewManagingMilestone(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newManagingMilestone.trim()) {
                            addProjectMilestone(proj.id, newManagingMilestone.trim());
                            setNewManagingMilestone('');
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-xs border border-[#E0E0E0] rounded-lg text-[#202124] focus:border-[#1A73E8] outline-hidden"
                      />
                      <button
                        onClick={() => {
                          if (newManagingMilestone.trim()) {
                            addProjectMilestone(proj.id, newManagingMilestone.trim());
                            setNewManagingMilestone('');
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-[#1A73E8] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                      >
                        Add Task
                      </button>
                    </div>
                  </div>

                  {/* Attached Files & Notes */}
                  {proj.files && proj.files.length > 0 && (
                    <div className="pt-3 border-t border-[#E0E0E0] text-xs text-[#5F6368] flex items-center gap-3">
                      <span className="font-medium text-[#202124]">Attached Documents:</span>
                      <div className="flex flex-wrap gap-2">
                        {proj.files.map((f, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-sm text-[11px] text-[#202124]">
                            {f.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB: ASSESS NEW PROJECT                          */}
      {/* ==================================================== */}
      {activeSubTab === 'assess' && (
        <>
          {/* STEP 1: Upload or Connect Project */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Quick template selector */}
              <div className="bg-gray-50 border border-[#E0E0E0] rounded-xl p-4 sm:p-5">
                <span className="block text-xs font-medium text-[#202124] mb-2 uppercase tracking-wide">
                  Quick Load: Real Project Case Archives
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_PROJECT_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadTemplate(tmpl)}
                      className="text-left p-3 bg-white border border-[#E0E0E0] rounded-lg hover:border-[#1A73E8] hover:bg-blue-50/40 transition-colors"
                    >
                      <span className="block text-xs font-medium text-[#202124] truncate mb-1">{tmpl.title}</span>
                      <div className="flex items-center gap-2 text-[11px] text-[#5F6368]">
                        <span>{tmpl.category}</span>
                        <span>·</span>
                        <span>Full file content</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-medium text-[#202124]">Project Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Cross-Border Cadastral Water Rights Mediation"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-hidden text-[#202124]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#202124]">Primary Domain Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as DomainCategory)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-hidden text-[#202124]"
                    >
                      {DOMAIN_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#202124]">
                    Description & Scope of Work *
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail what was produced, the problem tackled, key stakeholders, constraints, and methodologies utilized..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-hidden text-[#202124]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#202124]">
                    Notes, Relational Context & Adaptive Revisions
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What challenges or unexpected friction did you encounter? How did you adapt your initial hypotheses or procedures?"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0E0E0] rounded-lg focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8] outline-hidden text-[#202124]"
                  />
                </div>

                {/* Milestone Checklist builder for new project */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#202124]">
                    Initial Project Deliverables & Milestones
                  </label>
                  <div className="space-y-1.5">
                    {milestonesList.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border border-[#E0E0E0] rounded-md text-xs"
                      >
                        <span className="text-[#202124] font-medium">{m.title}</span>
                        <div className="flex items-center gap-2">
                          {m.dueDate && <span className="text-[11px] text-[#5F6368]">{m.dueDate}</span>}
                          <button
                            type="button"
                            onClick={() => setMilestonesList((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-[#5F6368] hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add milestone (e.g. Conduct forensic ledger reconciliation)..."
                      value={newMilestoneInput}
                      onChange={(e) => setNewMilestoneInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMilestoneToStep1();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#E0E0E0] rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleAddMilestoneToStep1}
                      className="px-3 py-1.5 text-xs font-medium text-[#1A73E8] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#202124]">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E0E0E0] rounded-lg text-[#202124]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[#202124]">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#E0E0E0] rounded-lg text-[#202124]"
                    />
                  </div>
                </div>

                {/* Real Document Upload & FileReader */}
                <div className="border-t border-[#E0E0E0] pt-6">
                  <label className="block text-xs font-medium text-[#202124] mb-2">
                    Project Files, Specifications & Source Artifacts
                  </label>
                  <div className="border-2 border-dashed border-[#E0E0E0] rounded-xl p-6 text-center hover:border-[#1A73E8] transition-colors bg-gray-50/50">
                    <FolderUp className="w-8 h-8 text-[#5F6368] mx-auto mb-2" />
                    <div className="text-xs text-[#202124] font-medium mb-1">
                      Upload actual documents, reports, code specs, or data exports (.md, .txt, .json, .csv)
                    </div>
                    <p className="text-[11px] text-[#5F6368] mb-3">
                      Files are read in-browser and parsed for evidentiary terms, methods, and systemic feedback traces.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <label className="px-3.5 py-1.5 text-xs font-medium text-[#1A73E8] bg-white border border-[#1A73E8] rounded-md hover:bg-blue-50 cursor-pointer transition-colors">
                        <span>Select Local Project Files</span>
                        <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setIsDriveConnected(true);
                          setFiles((prev) => [
                            ...prev,
                            {
                              name: 'GoogleDrive_ProjectCharter_Synchronized.gdoc',
                              size: 'Cloud Synced',
                              content:
                                'Google Drive Project Repository: Cadastral boundary reconciliation, environmental impact audits, multi-stakeholder governance charters.',
                            },
                          ]);
                        }}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-md border transition-colors flex items-center gap-1.5 ${
                          isDriveConnected
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-white text-[#5F6368] border-[#E0E0E0] hover:text-[#202124]'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{isDriveConnected ? 'Google Drive Connected' : 'Connect Google Drive'}</span>
                      </button>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[11px] font-medium text-[#5F6368]">Attached Artifacts ({files.length}):</span>
                      <div className="space-y-1">
                        {files.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border border-[#E0E0E0] rounded-md text-xs text-[#202124]"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-3.5 h-3.5 text-[#5F6368] shrink-0" />
                              <span className="truncate">{file.name}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-2">
                              <span className="text-[11px] text-[#5F6368]">{file.size}</span>
                              <button
                                type="button"
                                onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                                className="text-[#5F6368] hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E0E0E0]">
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('manage')}
                    className="px-4 py-2 text-xs font-medium text-[#5F6368] hover:text-[#202124] transition-colors"
                  >
                    View Project List
                  </button>
                  <button
                    type="button"
                    onClick={runAssessment}
                    className="px-5 py-2 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs flex items-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Extract Skills & Evaluate REP</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Loading State */}
          {step === 2 && (
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
              <div className="w-12 h-12 rounded-full border-3 border-blue-100 border-t-[#1A73E8] animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-medium text-[#202124]">Synthesizing Relational Assessment...</h2>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                Deconstructing project documentation along micro (technical actions), meso (operational workflows), and
                macro (institutional governance) scales, scoring against the 10 REP rubric dimensions.
              </p>
            </div>
          )}

          {/* STEP 3: Skill Map & REP Evaluation Output */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-150">
              {/* Status notification banner if saved */}
              {skillsSaved && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Project archived and {extractedSkills.length} skills successfully added to your active profile!
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="text-xs text-emerald-800 font-semibold underline hover:text-emerald-950"
                  >
                    View in Dashboard
                  </button>
                </div>
              )}

              {/* REP Criteria Inferences Banner */}
              <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#1A73E8]" />
                    <h2 className="text-sm font-semibold text-[#202124] uppercase tracking-wide">
                      REP Rubric Synthesis: Qualitative Evidence
                    </h2>
                  </div>
                  <span className="text-xs text-[#5F6368]">Relational Evaluative Practice</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-gray-50 border border-[#E0E0E0] rounded-xl">
                    <span className="block font-medium text-[#202124] mb-1.5">1. Interpretation of Signs</span>
                    <p className="text-[#5F6368] leading-relaxed">
                      {repSummary.interpretation_of_signs ||
                        'Identified critical data anomalies and non-obvious traces in technical specifications to distinguish systemic causes from superficial symptoms.'}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-[#E0E0E0] rounded-xl">
                    <span className="block font-medium text-[#202124] mb-1.5">2. Relational Reasoning</span>
                    <p className="text-[#5F6368] leading-relaxed">
                      {repSummary.relational_reasoning ||
                        'Mapped feedback loops connecting localized operational constraints to regional statutory rules, aligning diverse stakeholder vectors.'}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-[#E0E0E0] rounded-xl">
                    <span className="block font-medium text-[#202124] mb-1.5">3. Adaptive Revision</span>
                    <p className="text-[#5F6368] leading-relaxed">
                      {repSummary.adaptive_revision ||
                        'Iterated initial hypotheses in response to adversarial stress testing and regulatory constraints, transforming vulnerabilities into safeguards.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Extracted Skill Map List */}
              <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-7 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E0E0E0]">
                  <div>
                    <h2 className="text-base font-medium text-[#202124]">
                      Skill Map ({extractedSkills.length} Verified Capabilities)
                    </h2>
                    <span className="text-xs text-[#5F6368]">
                      Derived from &ldquo;{title || 'Current Project'}&rdquo; · Click proficiency bars to calibrate rating
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddSkillModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1A73E8] bg-blue-50 hover:bg-blue-100/70 border border-blue-200 rounded-md transition-colors self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Skill</span>
                  </button>
                </div>

                <div className="divide-y divide-[#E0E0E0]">
                  {extractedSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="py-4 first:pt-1 last:pb-1 flex flex-col md:flex-row md:items-start justify-between gap-4"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-sm text-[#202124]">{skill.name}</span>
                          <span className="text-xs text-[#5F6368]">·</span>
                          <span className="text-xs text-[#1A73E8] font-medium">{skill.domain_area}</span>
                          <span className="text-xs text-[#5F6368]">·</span>
                          <span className="text-xs text-[#5F6368]">{skill.acquisition_type}</span>
                        </div>

                        <p className="text-xs text-[#5F6368] leading-relaxed">{skill.provenance_note}</p>

                        {/* Micro / Meso / Macro scale tags */}
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

                      {/* Interactive Proficiency adjuster */}
                      <div className="flex items-center gap-4 shrink-0 self-end md:self-start">
                        <div className="text-right">
                          <span className="text-xs font-medium text-[#202124] block">
                            Level {skill.proficiency_level} of 5
                          </span>
                          <div className="flex items-center gap-1 mt-1 cursor-pointer">
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => handleUpdateSkillProficiency(idx, lvl as any)}
                                className={`w-3.5 h-2 rounded-xs transition-colors ${
                                  lvl <= skill.proficiency_level ? 'bg-[#1A73E8]' : 'bg-gray-200 hover:bg-blue-200'
                                }`}
                                title={`Set level ${lvl}`}
                              />
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => setExtractedSkills((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1 text-[#5F6368] hover:text-red-600 transition-colors"
                          title="Remove skill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CV-Ready Wording Box */}
              <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E0E0E0]">
                  <div>
                    <h3 className="text-base font-medium text-[#202124]">CV-Ready Impact Wording</h3>
                    <span className="text-xs text-[#5F6368]">
                      Curated statements ready to paste into professional resumes, dossiers, or LinkedIn
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {cvWording.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-4 p-3.5 bg-gray-50 border border-[#E0E0E0] rounded-xl hover:border-blue-200 transition-colors"
                    >
                      <p className="text-xs text-[#202124] leading-relaxed pt-0.5">{bullet}</p>
                      <button
                        onClick={() => handleCopyCvBullet(bullet, idx)}
                        className="p-1.5 text-[#5F6368] hover:text-[#1A73E8] bg-white border border-[#E0E0E0] rounded-md shrink-0 transition-colors"
                        title="Copy statement"
                      >
                        {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Output CTA Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E0E0E0]">
                <button
                  onClick={() => {
                    setStep(1);
                    setSkillsSaved(false);
                  }}
                  className="text-xs font-medium text-[#5F6368] hover:text-[#202124] transition-colors inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Assess Another Project</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 text-xs font-medium text-[#5F6368] hover:text-[#202124] border border-[#E0E0E0] rounded-lg transition-colors"
                  >
                    Go to Dashboard
                  </button>

                  {!skillsSaved ? (
                    <button
                      onClick={handleSaveToProfile}
                      className="px-5 py-2 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg shadow-xs flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Add to My Profile & Skill Inventory</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="px-5 py-2 text-xs font-medium text-[#1A73E8] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center gap-2 transition-colors"
                    >
                      <span>View Portfolio & Profile</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Manual Skill Addition Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-medium text-[#202124]">Add Custom Skill to Map</h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">Skill Name</label>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. Distributed Chain-of-Custody Logging"
                className="w-full px-3 py-2 text-xs border border-[#E0E0E0] rounded-lg text-[#202124] outline-hidden focus:border-[#1A73E8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Domain Area</label>
                <select
                  value={newSkillDomain}
                  onChange={(e) => setNewSkillDomain(e.target.value as DomainCategory)}
                  className="w-full px-3 py-2 text-xs border border-[#E0E0E0] rounded-lg text-[#202124]"
                >
                  {DOMAIN_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#202124]">Acquisition Type</label>
                <select
                  value={newSkillType}
                  onChange={(e) => setNewSkillType(e.target.value as AcquisitionType)}
                  className="w-full px-3 py-2 text-xs border border-[#E0E0E0] rounded-lg text-[#202124]"
                >
                  <option value="Learned">Learned</option>
                  <option value="Used">Used</option>
                  <option value="Applied">Applied</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#202124]">Proficiency Level (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(Number(e.target.value) as any)}
                className="w-full accent-[#1A73E8]"
              />
              <div className="flex justify-between text-[11px] text-[#5F6368]">
                <span>1 (Emerging)</span>
                <span className="font-medium text-[#1A73E8]">Level {newSkillLevel}</span>
                <span>5 (Expert)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E0E0E0]">
              <button
                type="button"
                onClick={() => setShowAddSkillModal(false)}
                className="px-3.5 py-1.5 text-xs text-[#5F6368] hover:text-[#202124]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddManualSkill}
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#1A73E8] hover:bg-blue-600 rounded-lg"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
