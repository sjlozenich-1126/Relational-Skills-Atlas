import { User, Project, Skill, Syllabus, Course } from './types';

// Clean initial state for real user - no pre-filled fake data
export const INITIAL_USER: User = {
  id: 'usr_me',
  name: '',
  email: '',
  preferredTeachingStyleNotes: '',
  profileSummary: '',
  targetRole: '',
  location: '',
};

export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_SKILLS: Skill[] = [];
export const INITIAL_SYLLABI: Syllabus[] = [];
export const INITIAL_COURSES: Course[] = [];

// Optional sample/demo data available via "Load Sample Data" button
export const SAMPLE_DEMO_DATA = {
  user: {
    id: 'usr_sample',
    name: 'Sample Practitioner',
    email: 'fiduciacentrale@gmail.com',
    preferredTeachingStyleNotes:
      'Prefers systems diagrams, comparative case analysis, and tracing micro-to-macro feedback loops with iterative revision.',
    profileSummary:
      'Cross-disciplinary systems practitioner specializing in relational governance, evidentiary audits, and socio-ecological coordination.',
    targetRole: 'Director of Relational Governance & Systems Audit',
    location: 'San Francisco, CA / Geneva',
  },
  projects: [
    {
      id: 'proj_sample_01',
      user_id: 'usr_sample',
      title: 'Municipal Biocultural Watershed Audit',
      description:
        'Conducted a relational audit across three municipal water districts. Mapped traditional riparian commons against statutory water rights and real estate zoning overlays to resolve water allocation disputes.',
      category: 'Biocultural & Ecology',
      status: 'Completed' as const,
      start_date: '2025-02-01',
      end_date: '2025-11-15',
      milestones: [
        { id: 'm1', title: 'Compile cadastral titles and GIS watershed layers', completed: true, dueDate: '2025-04-10' },
        { id: 'm2', title: 'Conduct participatory riparian stewardship summits', completed: true, dueDate: '2025-07-22' },
        { id: 'm3', title: 'Ratify inter-district biocultural covenant charter', completed: true, dueDate: '2025-11-15' },
      ],
      files: [
        { name: 'Watershed_SocioEcological_Index_v4.pdf', size: '4.8 MB', content: 'Riparian buffer compliance matrix and hydrological recharge zones.' },
        { name: 'Statutory_Compliance_Matrix.xlsx', size: '1.2 MB', content: 'Inter-district water allocation quotas and groundwater withdrawal limits.' },
      ],
      notes:
        'Shifted from purely legalistic compliance to participatory biocultural mapping, bridging municipal engineers and indigenous river stewards.',
      extractedSkillsCount: 4,
      assessedAt: '2025-11-20',
    },
    {
      id: 'proj_sample_02',
      user_id: 'usr_sample',
      title: 'Cross-Border Digital Chain-of-Custody Framework',
      description:
        'Engineered an evidentiary verification protocol for transnational digital forensic disclosures. Combined cryptographic hash notarization, jurisdictional conflict resolution routines, and multi-tenant access control for human rights documentation.',
      category: 'Forensic Audit',
      status: 'In Progress' as const,
      start_date: '2025-06-10',
      end_date: '2026-03-01',
      milestones: [
        { id: 'm4', title: 'Formalize cryptographic Merkle-tree logging spec', completed: true, dueDate: '2025-09-01' },
        { id: 'm5', title: 'Harmonize GDPR Art. 49 vs US discovery mandates', completed: true, dueDate: '2025-12-15' },
        { id: 'm6', title: 'Conduct red-team jurisdictional arbitrage audit drill', completed: false, dueDate: '2026-05-01' },
      ],
      files: [
        { name: 'ChainOfCustody_RFC_Spec.md', size: '420 KB', content: 'RFC specification for verifiable zero-knowledge evidentiary notarization.' },
      ],
      notes:
        'Reconciled contradictory evidentiary standards between EU privacy directives and US common law discovery mandates.',
      extractedSkillsCount: 4,
      assessedAt: '2026-03-05',
    },
  ],
  skills: [
    {
      id: 'skl_sample_01',
      user_id: 'usr_sample',
      name: 'Biocultural Territorial Mapping',
      domain_area: 'Biocultural & Ecology',
      acquisition_type: 'Applied' as const,
      proficiency_level: 4 as const,
      provenance_note: 'Synthesized during Municipal Biocultural Watershed Audit',
      micro_tag: 'Riparian boundary vector analysis',
      meso_tag: 'Watershed inter-district conflict mediation',
      macro_tag: 'Regional socio-ecological commons policy',
      rep_scores: {
        'Meaningful engagement': 4 as const,
        'Interpretation of signs': 4 as const,
        'Relational reasoning': 4 as const,
        'Adaptive revision': 3 as const,
        'Ethical and contextual awareness': 4 as const,
      },
      added_at: '2025-11-20',
    },
    {
      id: 'skl_sample_02',
      user_id: 'usr_sample',
      name: 'Cryptographic Chain-of-Custody Verification',
      domain_area: 'Forensic Audit',
      acquisition_type: 'Applied' as const,
      proficiency_level: 5 as const,
      provenance_note: 'Lead architect on Cross-Border Evidentiary Protocol',
      micro_tag: 'Merkle tree audit logging & hash notarization',
      meso_tag: 'Multi-jurisdictional evidence handling workflow',
      macro_tag: 'Transnational admissibility treaty standards',
      rep_scores: {
        'Relational reasoning': 4 as const,
        'Generative artifact': 4 as const,
        'Transfer and application': 4 as const,
        'Ethical and contextual awareness': 4 as const,
      },
      added_at: '2026-03-05',
    },
    {
      id: 'skl_sample_03',
      user_id: 'usr_sample',
      name: 'Multi-Scale Relational Governance Charters',
      domain_area: 'Legal & Governance',
      acquisition_type: 'Applied' as const,
      proficiency_level: 4 as const,
      provenance_note: 'Harmonized statutory water law and communal easements',
      micro_tag: 'Statutory clause deconfliction',
      meso_tag: 'Inter-agency consensus frameworks',
      macro_tag: 'Polycentric public trust doctrine',
      rep_scores: {
        'Relational reasoning': 4 as const,
        'Adaptive revision': 4 as const,
        'Ethical and contextual awareness': 4 as const,
      },
      added_at: '2026-03-05',
    },
  ],
  syllabi: [
    {
      id: 'syl_sample_01',
      user_id: 'usr_sample',
      title: 'Relational Urban Ecology & Sovereign Commons Law',
      goal_description:
        'Master the relational mechanics of urban ecological commons, co-governance models, and decentralized legal deeds for climate-resilient metropolitan infrastructure.',
      catalyst:
        'The Co-Governance Matrix: Treating municipal land as an active socio-ecological commons with recursive feedback loops between hydrology, tenant equity, and municipal debt covenants.',
      spiral_phase: 'Reconfiguration' as const,
      status: 'Active' as const,
      domain: 'Urban & Real Estate',
      target_project: 'Metropolitan Climate Adaptation Bond & Commons Registry',
      teaching_style_notes: 'Visual systems diagrams, legal covenant comparative tables, practical simulations',
      created_at: '2026-02-10',
      updated_at: '2026-04-12',
      modules: [
        {
          id: 'mod_s1',
          syllabus_id: 'syl_sample_01',
          title: '01. Diagnostic Deconstruction of Proprietary Cadastres',
          description:
            'Unpack how 19th-century Cartesian boundary surveys severed urban parcels from watershed hydrology and communal stewardship networks.',
          spiral_phase: 'Initiation' as const,
          catalyst: 'The Boundary Illusion vs. Hydrological Reality',
          micro_focus: 'Deconstructing deed descriptions and GIS boundary layers',
          meso_focus: 'Zoning board appeals and district stormwater easements',
          macro_focus: 'Municipal bond covenants and property tax capitalization',
          resources: [
            {
              title: 'Ostrom, E. (1990) Governing the Commons: The Evolution of Institutions',
              type: 'standard' as const,
              source: 'Cambridge University Press',
              summary: 'Eight design principles for stable common-pool resource management.',
            },
            {
              title: 'UN-Habitat Cadastral Reform Guidelines for Resilient Settlements',
              type: 'framework' as const,
              source: 'UN Habitat Policy Papers',
              summary: 'Methodology for mapping communal occupancy and informal water rights.',
            },
          ],
          feedback_prompts: [
            'What distinctions did you treat as legally fixed versus socially negotiated in this land deed?',
            'How does the stormwater runoff path contradict the legal parcel boundary line?',
          ],
          completion_status: 'Completed' as const,
          completed_at: '2026-02-28',
          lesson_content: {
            key_takeaway:
              'A parcel boundary is not an empirical physical barrier; it is an institutional contract that frequently truncates ecological flows and collective stewardship obligations.',
            conceptual_foundation:
              'In conventional property law, the cadastre establishes exclusivity. However, relational geography demonstrates that groundwater, air currents, and municipal infrastructure operate as continuous topological fields. When governance ignores this topology, externalities accumulate as municipal liabilities.',
            case_study:
              'In the Ruhr Valley restructuring, former industrial parcels were re-aggregated into decentralized water retention cooperatives rather than sold as individual speculative lots, reducing flood risk by 68%.',
            practical_exercise:
              'Examine a sample municipal cadastral parcel map. Trace three subterranean ecological flows that cross adjacent property lines, and formulate a joint easement clause.',
            reflection_prompt:
              'Where does your current project assume static ownership boundaries where dynamic ecological relationships actually govern?',
            user_reflection:
              'Our initial audit assumed the district boundary was sovereign, but floodwaters ignored the administrative line entirely. We need cross-district riparian covenants.',
            quiz: [
              {
                question: 'Why do conventional Cartesian cadastres conflict with watershed governance?',
                options: [
                  'Cadastres sever continuous topological hydrological fields into artificial rectilinear property boxes.',
                  'Cadastres are stored on physical parchment without digital backups.',
                  'Cadastres only apply to agricultural zoning.',
                  'Cadastres have no legal standing in statutory municipal courts.',
                ],
                correctIndex: 0,
                explanation:
                  'Cartesian boundary surveys impose rigid rectilinear grids across continuous ecological and fluid networks.',
              },
            ],
          },
        },
      ],
    },
  ],
  courses: [
    {
      id: 'crs_sample_01',
      user_id: 'usr_sample',
      title: 'Relational Systems Auditing: From Evidence to Institutional Revision',
      description:
        'A masterclass for governance practitioners, forensic auditors, and policy designers on tracing non-linear causal loops and evaluating digital chain-of-custody.',
      audience: 'Senior Analysts, Governance Architects, Forensic Investigators',
      domain: 'Forensic Audit',
      publish_status: 'Published' as const,
      created_at: '2026-01-15',
      updated_at: '2026-04-02',
      structure: [
        {
          id: 'crs_les_01',
          title: 'Diagnostic Framing & Sign Interpretation',
          description: 'Distinguishing systemic signals from institutional noise in complex audits.',
          micro_focus: 'Evidentiary artifact verification',
          meso_focus: 'Organizational communication flow audits',
          macro_focus: 'Regulatory statutory mandates',
          resources: ['ISO 19011: Guidelines for Auditing Management Systems'],
          rep_prompts: ['What evidentiary signs did you treat as primary indicators of institutional stress?'],
        },
      ],
    },
  ],
};
