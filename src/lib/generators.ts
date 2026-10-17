import {
  DomainCategory,
  Syllabus,
  Module,
  ModuleResource,
  Skill,
  SpiralPhase,
} from '../types';

export interface GenerateSyllabusParams {
  goal: string;
  projectIdea?: string;
  domains?: DomainCategory[];
  scaleFocus?: string;
  teachingStyle?: string;
  startingLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  learningPace?: string;
  externalIntegrations?: string[];
  customExternalLinks?: Array<{
    title: string;
    url: string;
    platform?: string;
    notes?: string;
  }>;
}

/**
 * Rich, domain-aware client-side syllabus generator that creates an authentic 4-phase
 * relational learning spiral even when offline, serverless is unavailable, or API key is not configured.
 */
export function generateTailoredSyllabus(params: GenerateSyllabusParams): Syllabus {
  const goal = params.goal.trim() || 'Relational Systems Analysis & Governance';
  const domain: DomainCategory = params.domains?.[0] || 'Digital & Systems';
  const projectIdea = params.projectIdea?.trim() || 'Cross-scale institutional implementation';
  const scaleFocus = params.scaleFocus || 'meso (project/workflow)';
  const styleNotes = params.teachingStyle || 'Systems diagrams, relational reasoning, case studies, and hands-on drills.';
  const startingLevel = params.startingLevel || 'Intermediate';

  // Domain-specific standard references
  const domainResources: Record<DomainCategory, Array<{ title: string; url: string; source: string; summary: string }>> = {
    'Legal & Governance': [
      {
        title: 'OECD Guidelines on Corporate & Deliberative Governance',
        url: 'https://www.oecd.org/governance/',
        source: 'OECD Standard',
        summary: 'Institutional design, multi-stakeholder accountability, and relational agreements.',
      },
      {
        title: 'Elinor Ostrom: Governing the Commons (Cambridge University Press)',
        url: 'https://www.cambridge.org/core/books/governing-the-commons',
        source: 'Academic Monograph',
        summary: 'Core institutional design principles for collective common-pool resource governance.',
      },
    ],
    'Forensic Audit': [
      {
        title: 'NIST SP 800-86 Guide to Integrating Forensic Techniques',
        url: 'https://csrc.nist.gov/pubs/sp/800/86/final',
        source: 'NIST Standard',
        summary: 'Evidentiary integrity matrices and digital chain-of-custody protocols.',
      },
      {
        title: 'ISO/IEC 27037 Digital Evidence Admissibility Guidelines',
        url: 'https://www.iso.org/standard/53547.html',
        source: 'ISO Standard',
        summary: 'Standardized identification, collection, acquisition, and preservation of digital evidence.',
      },
    ],
    'Defense & Security': [
      {
        title: 'NIST SP 800-160 Systems Security Engineering',
        url: 'https://csrc.nist.gov/pubs/sp/800/160/vol1/r1/final',
        source: 'NIST Standard',
        summary: 'Trustworthiness criteria and relational verification techniques for complex defense systems.',
      },
      {
        title: 'ISO/IEC 27001 Information Security Management Systems',
        url: 'https://www.iso.org/standard/27001',
        source: 'ISO Standard',
        summary: 'Continuous compliance checks and multi-level feedback audit loops.',
      },
    ],
    'Urban & Real Estate': [
      {
        title: 'Jane Jacobs: The Death and Life of Great American Cities',
        url: 'https://www.penguinrandomhouse.com/books/86016/the-death-and-life-of-great-american-cities-by-jane-jacobs/',
        source: 'Urban Planning Foundation',
        summary: 'Sidewalk interactions, relational social capital, and organic street governance.',
      },
      {
        title: 'UN-Habitat New Urban Agenda & Spatial Planning Guidelines',
        url: 'https://habitat3.org/the-new-urban-agenda/',
        source: 'UN Standard',
        summary: 'Compact spatial design, zoning easements, and polycentric urban resilience.',
      },
    ],
    'Biocultural & Ecology': [
      {
        title: 'Nagoya Protocol on Access to Genetic Resources and Equitable Benefit-Sharing',
        url: 'https://www.cbd.int/abs/',
        source: 'UN Treaty',
        summary: 'Statutory compliance frameworks for indigenous sovereignty and biocultural research.',
      },
      {
        title: 'FAO Voluntary Guidelines on Governance of Tenure (VGGT)',
        url: 'https://www.fao.org/tenure/voluntary-guidelines/en/',
        source: 'UN FAO Standard',
        summary: 'Principles for customary, collective, and ecological tenure reconciliation.',
      },
    ],
    'Digital & Systems': [
      {
        title: 'NIST AI Risk Management Framework (AI RMF 1.0)',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
        source: 'NIST Standard',
        summary: 'Governing, mapping, measuring, and managing trustworthy AI systems.',
      },
      {
        title: 'EU Artificial Intelligence Act (Official Statutory Text)',
        url: 'https://artificialintelligenceact.eu/',
        source: 'EU Directives',
        summary: 'Mandatory high-risk system conformity assessments and algorithmic audits.',
      },
      {
        title: 'MIT OpenCourseWare: Complex Systems Architecture',
        url: 'https://ocw.mit.edu/courses/esd-04j-frameworks-and-models-in-engineering-systems-engineering-fall-2009/',
        source: 'MIT OCW',
        summary: 'System dynamics, feedback loops, and architectural decomposition.',
      },
    ],
  };

  const domainRefs = domainResources[domain] || domainResources['Digital & Systems'];

  const phaseConfigs: Array<{
    phase: SpiralPhase;
    prefix: string;
    title: string;
    desc: string;
    catalyst: string;
    micro: string;
    meso: string;
    macro: string;
    keyTakeaway: string;
    conceptualFoundation: string;
    caseStudy: string;
    practicalExercise: string;
    reflectionPrompt: string;
    quiz: Array<{ question: string; options: string[]; correctIndex: number; explanation: string }>;
  }> = [
    {
      phase: 'Initiation',
      prefix: '01',
      title: `Diagnostic Framing & Boundary Deconstruction in ${domain}`,
      desc: `Interrogate the unexamined institutional assumptions and static definitions that conceal systemic risk in early ${goal.toLowerCase()} planning.`,
      catalyst: 'Cartesian Categories vs. Dynamic Socio-Technical Realities: Auditing what traditional frameworks externalize.',
      micro: `Deconstructing specification files, data contracts, and statutory definitions related to ${goal}.`,
      meso: `Project charter scoping, stakeholder boundary arbitration, and cross-team workflow mapping.`,
      macro: `Institutional incentives, regulatory liability boundaries, and systemic accountability deficits.`,
      keyTakeaway:
        'Every project boundary is an intentional choice of what to externalize. True relational competence starts by auditing what has been excluded.',
      conceptualFoundation:
        `In conventional practice, ${goal} is often bounded strictly to minimize localized legal or technical liability. However, in modern socio-technical networks, excluded variables do not disappear; they accumulate unmonitored until they cascade into systemic failure. By tracing causal feedback loops upfront across micro-technical details and macro-statutory mandates, practitioners insulate their systems from catastrophic surprises.`,
      caseStudy:
        `During the early development of flight management software, treating autopilot sensor telemetry as separate from pilot interface cognition caused cascading mode confusions. When NASA Langley applied relational boundary mapping, they revealed that the human cognitive load was a core feedback variable in the mechanical loop, permanently changing aviation systems design.`,
      practicalExercise:
        `Take the scope statement for "${projectIdea}". Draw a central circle representing the formal boundaries, and map at least five critical dependencies or downstream societal/technical impacts that currently lie outside your boundary.`,
      reflectionPrompt:
        `What organizational incentive or budgetary boundary discourages your team from acknowledging externalized relational risks early?`,
      quiz: [
        {
          question: `Why does relational pedagogy prioritize 'boundary deconstruction' during Phase 1 Initiation?`,
          options: [
            'Because boundaries determine which real-world feedback loops are monitored and which are blind spots.',
            'To eliminate all organizational departments and operate without structure.',
            'To speed up software delivery by skipping regulatory documentation.',
            'Because technical boundaries are fixed and cannot be questioned.',
          ],
          correctIndex: 0,
          explanation:
            'Boundaries delineate what the organization measures and manages. Unexamined boundaries cause externalized risks to compound until they trigger unexpected crises.',
        },
        {
          question: `When mapping '${goal}' across scales, what does the micro-level focus encompass?`,
          options: [
            'Global treaties and international trade pacts.',
            'Granular code, specific technical protocols, evidentiary traces, and immediate transactions.',
            'Multi-year corporate strategic plans.',
            'Public relations announcements and media campaigns.',
          ],
          correctIndex: 1,
          explanation:
            'The micro scale deals directly with the granular technical substrate—specific data structures, code protocols, logs, and direct human transactions.',
        },
      ],
    },
    {
      phase: 'Descent',
      prefix: '02',
      title: `Forensic Decomposition of Systemic Friction Points`,
      desc: `Conduct deep technical audits into hidden points of failure, perverse incentives, and data silos that compromise ${goal.toLowerCase()} execution.`,
      catalyst: 'Friction as Diagnostic Signal: Treating operational breakdown as evidentiary data rather than mere annoyance.',
      micro: `Root-cause anomaly inspection, protocol fuzzing, and transactional audit log reconciliation.`,
      meso: `Inter-team handover friction, feedback latency, and conflicting performance metrics.`,
      macro: `Statutory arbitrage, unaligned regulatory obligations, and jurisdictional gaps.`,
      keyTakeaway:
        'Systemic friction is not a flaw to be paved over; it is evidentiary data exposing where different institutional worldviews clash.',
      conceptualFoundation:
        `During the Descent phase, the learner investigates the mechanical underpinnings of failure. Rather than assigning personal blame, relational forensics examines informational asymmetries, mismatched sampling frequencies, and incompatible vocabularies. You learn to parse audit logs and systemic friction as symptoms of underlying institutional misalignments.`,
      caseStudy:
        `The Three Mile Island nuclear incident was accelerated because control room instrumentation only indicated whether an electrical solenoid was energized to close a valve, not whether the mechanical valve had actually physically sealed. This fatal confusion of sign vs. reality is the classic failure mode that relational forensics teaches practitioners to eliminate.`,
      practicalExercise:
        `Construct a 3-column Friction Diagnostic Matrix for ${goal}: Column 1: Observed error or delay; Column 2: Immediate conventional explanation; Column 3: Underlying relational incentive maintaining the defect.`,
      reflectionPrompt:
        `Where in your current workflow are you treating an architectural design defect as a personal performance or motivation issue?`,
      quiz: [
        {
          question: `In Relational Evaluative Practice, what is the primary role of friction in a system?`,
          options: [
            'A sign of employee incompetence that requires immediate reprimand.',
            'A diagnostic signal indicating where institutional assumptions contradict operational reality.',
            'An unavoidable noise that should be filtered out from dashboard telemetry.',
            'A purely legal obstacle that should be circumvented.',
          ],
          correctIndex: 1,
          explanation:
            'Friction occurs where systemic boundaries grind against unexpected realities. Diagnosing this friction exposes systemic vulnerabilities before they become catastrophic.',
        },
        {
          question: `How does the 'Interpretation of Signs' REP dimension apply to technical audit logs?`,
          options: [
            'By accepting all dashboard metrics at face value without question.',
            'By distinguishing between the indicator (the sign) and the actual underlying physical/systemic state.',
            'By deleting conflicting logs to keep databases clean.',
            'By generating random sample data for audits.',
          ],
          correctIndex: 1,
          explanation:
            'Interpretation of signs requires interrogating whether our sensors, telemetry, and documents actually correspond to ground-truth reality or merely reflect bureaucratic compliance.',
        },
      ],
    },
    {
      phase: 'Reconfiguration',
      prefix: '03',
      title: `Polycentric Reconfiguration & Relational Synthesis`,
      desc: `Re-architect the operational workflow into an adaptive, multi-tiered governance model capable of continuous self-correction.`,
      catalyst: 'Dynamic Equilibrium: Replacing rigid, top-down hierarchies with nested, reciprocal feedback pacts.',
      micro: `Drafting verifiable protocol triggers, cryptographic checksums, and consensus checklists.`,
      meso: `Establishing cross-functional review councils, feedback budgets, and reciprocal escalation SLA agreements.`,
      macro: `Formulating polycentric governance charters, open interoperability pacts, and statutory alignment.`,
      keyTakeaway:
        'Resilience is not the absence of disturbance; it is the capacity to reconfigure internal relationships without dissolving core purpose.',
      conceptualFoundation:
        `Reconfiguration is the turning point where diagnostic critique transforms into constructive architecture. Polycentric governance, pioneered by Elinor Ostrom, distributes authority across independent decision centers with overlapping jurisdictions. This structure prevents single points of failure and allows local operational insights to rapidly update macro governance policies.`,
      caseStudy:
        `The Internet Engineering Task Force (IETF) maintains global network protocols without formal coercive authority by operating on 'rough consensus and running code.' Working groups independently stress-test implementations and synthesize diverse institutional interests into open standards that outlast corporate silos.`,
      practicalExercise:
        `Draft an Adaptive Escalation Protocol for "${projectIdea}": specify exact quantitative triggers and qualitative review councils that convene when system metrics deviate by more than 15%.`,
      reflectionPrompt:
        `What control mechanisms in your project are you reluctant to decentralize, and what underlying institutional risk drives that reluctance?`,
      quiz: [
        {
          question: `What distinguishes polycentric governance from centralized hierarchical management?`,
          options: [
            'Polycentric models rely on multiple overlapping, autonomous decision nodes bound by mutual feedback agreements.',
            'Polycentric models have no rules or accountability.',
            'Polycentric models concentrate all authority in an executive committee.',
            'Polycentric models only work for small informal hobby groups.',
          ],
          correctIndex: 0,
          explanation:
            'Polycentric systems maintain stability and adaptability by dispersing authority across self-organizing nodes that coordinate through common rules and feedback channels.',
        },
        {
          question: `What does 'Adaptive Revision' mean in practice for a project manager?`,
          options: [
            'Changing project plans randomly whenever a meeting runs long.',
            'Continuously updating working models, code, and charters in response to empirical evidence and user feedback.',
            'Sticking to the original Gantt chart regardless of contradictory field data.',
            'Rewriting company history after a project fails.',
          ],
          correctIndex: 1,
          explanation:
            'Adaptive revision is the disciplined capacity to evolve frameworks, protocols, and assumptions when confronted with genuine empirical feedback.',
        },
      ],
    },
    {
      phase: 'Ascent',
      prefix: '04',
      title: `Generative Artifact Deployment & Ecosystem Transfer`,
      desc: `Finalize the capstone generative artifact—a living operational framework, audited protocol, or open registry—and validate its transferability.`,
      catalyst: 'Artifact as Catalyst: Translating theoretical mastery into durable, verifiable public infrastructure.',
      micro: `Polishing runnable code, schemas, unit-test suites, and interactive validation checklists.`,
      meso: `Conducting live simulation drills, peer review defense, and user feedback intake sessions.`,
      macro: `Publishing to public repositories, cross-institutional knowledge bases, and peer-reviewed registries.`,
      keyTakeaway:
        'True competence is proven not when you hold all the answers, but when you produce an artifact that allows others to discover answers autonomously.',
      conceptualFoundation:
        `The Ascent phase represents the completion of the learning spiral. The practitioner does not return to the starting point unchanged, but elevated with actionable generative authority. The completed artifact serves as an enduring seed for organizational and community transformation, embodying the REP rubric dimensions in living code and practice.`,
      caseStudy:
        `When Linus Torvalds engineered Git, he did not merely solve a local file-versioning problem for the Linux kernel; he built an open, decentralized generative artifact whose relational data graph permanently transformed global software collaboration and auditability.`,
      practicalExercise:
        `Package your deliverable for "${projectIdea}" into a three-part portfolio package: (1) Technical Architectural Specification, (2) User Onboarding Runbook, and (3) Relational Evaluative Rubric (REP).`,
      reflectionPrompt:
        `How will you verify when this artifact has outgrown your personal stewardship and successfully belongs to the broader ecosystem?`,
      quiz: [
        {
          question: `Why is the final phase termed 'Ascent' rather than simply 'Conclusion'?`,
          options: [
            'Because the practitioner ascends to an elevated capability level, producing an artifact that elevates others in the ecosystem.',
            'Because it takes place at high physical altitude.',
            'To indicate that no further learning is ever required.',
            'Because the course creator receives a promotion.',
          ],
          correctIndex: 0,
          explanation:
            'In a learning spiral, Ascent signifies rising above initial constraints to deploy generative artifacts that expand the problem-solving capacity of the entire ecosystem.',
        },
        {
          question: `What constitutes a 'Generative Artifact' under the REP framework?`,
          options: [
            'A static multiple-choice score sheet.',
            'A tangible deliverable—such as code, a governance treaty, or diagnostic tool—that produces ongoing value for real users.',
            'A certificate of course completion saved as a PNG.',
            'A slide deck with generic stock photography.',
          ],
          correctIndex: 1,
          explanation:
            'A generative artifact is an active, functional creation that solves real-world problems and enables continuous downstream learning and adaptation.',
        },
      ],
    },
  ];

  // Build the 4 modules
  const now = new Date().toISOString();
  const modules: Module[] = phaseConfigs.map((cfg, idx) => {
    const pickedResources: ModuleResource[] = domainRefs.slice(0, 2).map((ref) => ({
      title: ref.title,
      type: 'standard',
      source: ref.source,
      url: ref.url,
      summary: ref.summary,
    }));

    if (params.customExternalLinks && params.customExternalLinks.length > 0) {
      params.customExternalLinks.forEach((link, linkIdx) => {
        if (linkIdx % phaseConfigs.length === idx) {
          pickedResources.push({
            title: link.title,
            type: link.platform || 'course',
            source: link.platform || 'Custom Resource',
            url: link.url,
            summary: link.notes || 'Learner-provided integrated course reference.',
            isCustom: true,
          });
        }
      });
    }

    return {
      id: 'mod_' + Math.random().toString(36).substring(2, 9),
      syllabus_id: '',
      title: `${cfg.prefix}. ${cfg.title}`,
      description: cfg.desc,
      spiral_phase: cfg.phase,
      catalyst: cfg.catalyst,
      micro_focus: cfg.micro,
      meso_focus: cfg.meso,
      macro_focus: cfg.macro,
      resources: pickedResources,
      feedback_prompts: [
        `What analytical assumptions in ${cfg.title} did you challenge during this module?`,
        `How does your generative output for this phase trace feedback loops between micro actions and macro outcomes?`,
      ],
      completion_status: 'Not Started',
      lesson_content: {
        key_takeaway: cfg.keyTakeaway,
        conceptual_foundation: cfg.conceptualFoundation,
        case_study: cfg.caseStudy,
        practical_exercise: cfg.practicalExercise,
        reflection_prompt: cfg.reflectionPrompt,
        quiz: cfg.quiz,
      },
    };
  });

  return {
    id: 'syl_' + Math.random().toString(36).substring(2, 9),
    user_id: 'usr_001',
    title: `${goal}: A Relational Mastery Syllabus`,
    goal_description: `Equip the learner to autonomously navigate, architect, and evaluate ${goal} within ${domain} ecosystems across ${scaleFocus} scales.`,
    catalyst: `Moving from transactional checklist compliance to systemic relational inquiry where feedback loops govern sustainable outcomes.`,
    spiral_phase: 'Initiation',
    status: 'Active',
    domain,
    target_project: projectIdea,
    teaching_style_notes: `${styleNotes} (Level: ${startingLevel})`,
    modules,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Local project skill assessment helper for resilient fallback.
 */
export function assessProjectLocally(
  title: string,
  category: DomainCategory | string,
  description: string,
  notes?: string
): {
  skills: Skill[];
  cv_wording: string[];
  rep_summary: {
    interpretation_of_signs: string;
    relational_reasoning: string;
    adaptive_revision: string;
  };
} {
  const cleanTitle = title.trim() || 'Custom Project Assessment';
  const cleanCat = category || 'Digital & Systems';

  const skills: Skill[] = [
    {
      id: 'sk_' + Math.random().toString(36).substring(2, 9),
      user_id: 'usr_001',
      name: `${cleanCat} Relational Decomposition`,
      domain_area: cleanCat,
      acquisition_type: 'Applied',
      proficiency_level: 4,
      provenance_note: `Demonstrated through systematic boundary tracing and requirement synthesis in "${cleanTitle}".`,
      micro_tag: 'Anomaly audit logs & technical schema verification',
      meso_tag: 'Inter-agency workflow arbitration & coordination protocols',
      macro_tag: 'Statutory compliance covenants & ecosystem risk mitigation',
      rep_scores: {
        'Interpretation of signs': 4,
        'Relational reasoning': 4,
        'Adaptive revision': 3,
      },
    },
    {
      id: 'sk_' + Math.random().toString(36).substring(2, 9),
      user_id: 'usr_001',
      name: `Cross-Scale Feedback Architecture`,
      domain_area: cleanCat,
      acquisition_type: 'Learned',
      proficiency_level: 4,
      provenance_note: `Implemented adaptive feedback mechanisms bridging operational anomalies directly into executive governance in "${cleanTitle}".`,
      micro_tag: 'Continuous error-budget telemetry',
      meso_tag: 'Polycentric council review cadence',
      macro_tag: 'Institutional resilience charters',
      rep_scores: {
        'Interpretation of signs': 3,
        'Relational reasoning': 4,
        'Adaptive revision': 4,
      },
    },
    {
      id: 'sk_' + Math.random().toString(36).substring(2, 9),
      user_id: 'usr_001',
      name: `Generative Artifact Validation`,
      domain_area: cleanCat,
      acquisition_type: 'Applied',
      proficiency_level: 4,
      provenance_note: `Delivered verified project deliverables with reproducible audit trails in "${cleanTitle}".`,
      micro_tag: 'Code, blueprints, and data schemas',
      meso_tag: 'Multi-stakeholder pilot simulations',
      macro_tag: 'Public open registries and standards publication',
      rep_scores: {
        'Interpretation of signs': 4,
        'Relational reasoning': 4,
        'Adaptive revision': 4,
      },
    },
  ];

  const cv_wording = [
    `Orchestrated complex ${cleanCat} system audits for "${cleanTitle}", translating technical evidentiary data into actionable executive governance frameworks.`,
    `Engineered cross-scale relational protocols that reduced operational handover friction and aligned micro deliverables with macro statutory standards.`,
    `Delivered audited generative artifacts with transparent evidentiary verification, empowering multi-stakeholder consensus across jurisdictional boundaries.`,
  ];

  const rep_summary = {
    interpretation_of_signs: `Interrogated operational metrics and documentation in "${cleanTitle}" to distinguish superficial indicators from deep-seated structural patterns.`,
    relational_reasoning: `Mapped causal interdependencies between organizational incentives, technical constraints, and statutory mandates.`,
    adaptive_revision: `Iterated foundational working hypotheses into resilient institutional models through continuous field stress-testing.`,
  };

  return { skills, cv_wording, rep_summary };
}

/**
 * Local CV bullet generator for resilient fallback.
 */
export function generateCvWordingLocally(
  targetRole: string,
  skills: Skill[],
  projects: any[]
): {
  summary: string;
  bullet_points: string[];
} {
  const role = targetRole.trim() || 'Systems Architect & Relational Governance Specialist';
  const skillCount = skills.length;
  const projectCount = projects.length;

  return {
    summary: `Accomplished ${role} with a proven record of leading ${projectCount} cross-domain initiatives and mastering ${skillCount} verified relational competencies. Specialized in bridging granular technical telemetry with macro-institutional governance to eliminate systemic risk and architect durable, transparent workflows.`,
    bullet_points: [
      `Directed multi-scale systems audits across complex domains, establishing verifiable digital audit trails and reconciling fragmented organizational workflows.`,
      `Engineered polycentric governance protocols and adaptive revision frameworks, transforming adversarial stakeholder negotiations into resilient collaborative covenants.`,
      `Authored high-impact generative artifacts—including technical specifications, open registries, and evaluative rubrics—that scaled across enterprise environments.`,
      `Leveraged relational evaluative practice (REP) to audit evidentiary signs and feedback loops, proactively mitigating statutory compliance vulnerabilities.`,
    ],
  };
}
