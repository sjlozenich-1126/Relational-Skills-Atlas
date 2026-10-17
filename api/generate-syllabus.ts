import { GoogleGenAI } from '@google/genai';

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      goal,
      projectIdea,
      domains,
      scaleFocus,
      teachingStyle,
      startingLevel,
      learningPace,
      externalIntegrations,
      customExternalLinks,
    } = body;

    const ai = getGenAI();
    const integrationsList = (
      externalIntegrations || [
        'ISO/NIST Standards',
        'Academic Peer Review (arXiv/MIT OCW)',
        'Open Technical Specifications',
      ]
    ).join(', ');

    const customLinksList =
      Array.isArray(customExternalLinks) && customExternalLinks.length > 0
        ? customExternalLinks
            .map(
              (l: any) =>
                `- [${l.platform || 'Course/Resource'}] ${l.title}: ${l.url} (${l.notes || 'Integrated course resource'})`
            )
            .join('\n')
        : 'None provided; generate curated industry-standard courseware and documentation links.';

    if (ai) {
      try {
        const prompt = `
You are the chief pedagogical architect for "Relational Skills Atlas".
Build a custom syllabus and full online learning roadmap with complete instructional content, external accredited links, and interactive knowledge checks.

Learner Intake Form Responses:
- Target Skill / Outcome Goal: ${goal || 'Relational Systems Analysis'}
- Future Project Context: ${projectIdea || 'Cross-domain governance framework'}
- Domain Ecosystem: ${(domains || ['Digital & Systems']).join(', ')}
- Scale Focus: ${scaleFocus || 'meso (project/workflow)'}
- Pedagogical Style: ${teachingStyle || 'Systems diagrams, relational reasoning, case studies'}
- Starting Level: ${startingLevel || 'Intermediate'}
- Learning Pace & Timeline: ${learningPace || '4-Week Track'}
- External Integrations Requested: ${integrationsList}
- Custom External Links & Courses Added by Learner:
${customLinksList}

The syllabus MUST use the 4 Spiral Phases:
1. Phase 1: Initiation (Diagnostic framing, boundary deconstruction)
2. Phase 2: Descent (Deep mechanics, forensic breakdown of failure modes)
3. Phase 3: Reconfiguration (Polycentric synthesis, cross-scale translation)
4. Phase 4: Ascent (Generative artifact creation, live deployment)

For each module, provide:
- title (e.g. "01. Title")
- description
- spiral_phase ("Initiation" | "Descent" | "Reconfiguration" | "Ascent")
- catalyst (the core relational insight)
- micro_focus (specific technique / protocol)
- meso_focus (project / workflow)
- macro_focus (ecosystem / policy)
- resources: Array of 2-3 authoritative external links and standards with title, type ("standard" | "framework" | "case_study" | "article" | "tool"), source, url, and summary.
- feedback_prompts: 2 REP-informed reflective questions.
- lesson_content: {
    "key_takeaway": "Profound, actionable insight",
    "conceptual_foundation": "Multi-paragraph in-depth instructional lesson teaching the relational mechanics",
    "case_study": "Concrete real-world historical or contemporary case study",
    "practical_exercise": "Step-by-step practical assignment",
    "reflection_prompt": "Probing question challenging analytical assumptions",
    "quiz": [
      {
        "question": "Multiple choice question testing conceptual relational understanding",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "explanation": "Why this option is correct"
      },
      {
        "question": "Second multiple choice question",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 1,
        "explanation": "Why this option is correct"
      }
    ]
  }

Return strict JSON:
{
  "title": "Evocative syllabus title tailored to ${goal}",
  "goal_description": "Precise summary of outcome and competencies",
  "catalyst": "Overarching relational catalyst concept",
  "spiral_phase": "Initiation",
  "domain": "${domains?.[0] || 'Digital & Systems'}",
  "modules": [ 4 complete module objects ]
}
Output only valid JSON without markdown wrapping.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.status(200).json({ success: true, syllabus: parsed });
        }
      } catch (geminiError) {
        console.warn('Gemini syllabus generation fallback:', geminiError);
      }
    }

    // High quality deterministic fallback
    const targetDomain = domains?.[0] || 'Legal & Governance';
    const primaryGoal = goal || 'Relational Institutional Auditing & Systems Governance';

    const fallbackSyllabus = {
      title: `${primaryGoal}: A Relational Mastery Syllabus`,
      goal_description: `Equip the practitioner to autonomously architect, evaluate, and navigate complex ${targetDomain} frameworks with cross-scale relational accountability.`,
      catalyst:
        'The Epistemic Pivot: Moving from transactional compliance checklists to relational systems mapping where governance emerges from reciprocal feedback loops.',
      spiral_phase: 'Initiation',
      domain: targetDomain,
      modules: [
        {
          id: 'mod_' + Math.random().toString(36).substring(2, 9),
          title: '01. Diagnostic Framing & Boundary Deconstruction',
          description:
            'Interrogate the unexamined institutional assumptions and static definitions that conceal systemic risk in early project planning.',
          spiral_phase: 'Initiation',
          catalyst: 'Cartesian Categories vs. Dynamic Socio-Technical Realities',
          micro_focus: 'Deconstructing specification documents and statutory definitions',
          meso_focus: 'Project charter scoping and stakeholder boundary arbitration',
          macro_focus: 'Institutional incentives and systemic accountability deficits',
          resources: [
            {
              title: 'Ostrom, E. Understanding Institutional Diversity (Princeton University Press)',
              type: 'standard',
              source: 'Academic Press',
              summary:
                'Analytical framework for unpacking operational rules, collective choice, and constitutional choices.',
            },
            {
              title: 'ISO 31000: Risk Management Principles & Relational Scoping',
              type: 'framework',
              source: 'International Organization for Standardization',
              summary: 'Establishing internal and external contextual parameters for complex risk assessments.',
            },
          ],
          feedback_prompts: [
            'What analytical distinctions did you treat as objective facts rather than institutional conventions?',
            'Where does your boundary delineation truncate relevant ecological or technical feedback?',
          ],
          completion_status: 'Not Started',
          lesson_content: {
            key_takeaway:
              'Every project boundary is a choice of what to externalize. True relational mastery begins by auditing what has been excluded.',
            conceptual_foundation:
              'In traditional management, project scope is defined to minimize localized liability. However, in interconnected systems, excluded variables do not disappear; they accumulate unmonitored until they trigger systemic failure. By tracing relational linkages upfront, practitioners prevent late-stage project crises.',
            case_study:
              'In the Apollo guidance software development, treating software as separate from telemetry hardware produced cascading memory overflows during lunar descent. Margaret Hamilton’s asynchronous executive architecture resolved this by prioritizing critical operational threads.',
            practical_exercise:
              'Take the project scope statement for your upcoming initiative. Draw a circle representing the formal boundaries, and map at least five critical dependencies or downstream impacts that currently lie outside the boundary.',
            reflection_prompt:
              'What organizational incentive discourages your team from acknowledging externalized risks early?',
            quiz: [
              {
                question: 'Why does Phase 1 emphasize boundary deconstruction?',
                options: [
                  'To reveal which systemic feedback loops were arbitrarily excluded from governance.',
                  'To delete statutory records.',
                  'To skip technical design phases.',
                  'To prevent teams from collaborating.',
                ],
                correctIndex: 0,
                explanation:
                  'Deconstructing boundaries exposes externalized feedback loops that would otherwise cause cascading failure.',
              },
            ],
          },
        },
        {
          id: 'mod_' + Math.random().toString(36).substring(2, 9),
          title: '02. Forensic Decomposition of Systemic Friction Points',
          description:
            'Conduct deep technical audits into the hidden points of failure, perverse incentives, and data silos that compromise project execution.',
          spiral_phase: 'Descent',
          catalyst: 'Friction as Diagnostic Signal rather than Mere Inconvenience',
          micro_focus: 'Root cause anomaly analysis and transactional audit logs',
          meso_focus: 'Inter-team handover friction and feedback latency',
          macro_focus: 'Conflicting regulatory mandates and statutory arbitrage',
          resources: [
            {
              title: 'Perrow, C. Normal Accidents: Living with High-Risk Technologies',
              type: 'case_study',
              source: 'Princeton University Press',
              summary:
                'How interactive complexity and tight coupling make operational failures inevitable without relational buffers.',
            },
            {
              title: 'NIST Special Publication 800-160: Systems Security Engineering',
              type: 'standard',
              source: 'National Institute of Standards and Technology',
              summary: 'Trustworthiness criteria and relational verification techniques for complex systems.',
            },
          ],
          feedback_prompts: [
            'How did you distinguish between a temporary human error and a structurally induced failure mode?',
            'What relational reasoning exposed the hidden feedback loop behind the observed latency?',
          ],
          completion_status: 'Not Started',
          lesson_content: {
            key_takeaway:
              'Systemic friction is not a flaw to be paved over; it is evidentiary data exposing where different institutional worldviews clash.',
            conceptual_foundation:
              'During the Descent phase, the learner investigates the mechanical underpinnings of failure. Rather than assigning blame, relational forensics examines informational asymmetries, misaligned timelines, and unshared vocabularies.',
            case_study:
              'The Three Mile Island incident was accelerated because control room indicators showed whether a valve was commanded shut, not whether it had physically closed—a catastrophic confusion of sign and reality.',
            practical_exercise:
              'Construct a 3-column Friction Diagnostic Matrix: Column 1: Observed symptom; Column 2: Immediate explanation; Column 3: Structural relational incentive maintaining the condition.',
            reflection_prompt:
              'Where in your workflow are you currently treating a structural design defect as a personal motivation problem?',
            quiz: [
              {
                question: 'What is the diagnostic significance of operational friction?',
                options: [
                  'It provides empirical data showing where system boundaries clash.',
                  'It shows that staff should be fired.',
                  'It indicates software should never be updated.',
                  'It has no analytical relevance.',
                ],
                correctIndex: 0,
                explanation:
                  'Operational friction highlights misalignment between theoretical procedures and physical reality.',
              },
            ],
          },
        },
        {
          id: 'mod_' + Math.random().toString(36).substring(2, 9),
          title: '03. Polycentric Reconfiguration & Relational Synthesis',
          description:
            'Re-architect the operational workflow into an adaptive, multi-tiered governance model capable of continuous self-correction.',
          spiral_phase: 'Reconfiguration',
          catalyst: 'Dynamic Equilibrium: Replacing Rigid Hierarchies with Nested Feedbacks',
          micro_focus: 'Drafting adaptive protocol triggers and consensus rules',
          meso_focus: 'Establishing multi-stakeholder review cadence and error budgets',
          macro_focus: 'Formulating systemic governance charters and resilience pacts',
          resources: [
            {
              title: 'Meadows, D. Leverage Points: Places to Intervene in a System',
              type: 'framework',
              source: 'The Sustainability Institute',
              summary: 'Twelve intervention leverage points ranked by systemic transformative impact.',
            },
            {
              title: 'Deliberative Governance in Public Decision-Making (OECD Guidelines)',
              type: 'standard',
              source: 'OECD Public Governance Reports',
              summary: 'Good practice principles for representative deliberative processes.',
            },
          ],
          feedback_prompts: [
            'How does this reconfigured architecture empower downstream participants to challenge upstream assumptions?',
            'What adaptive revision safeguards ensure the protocol remains viable under unexpected stress?',
          ],
          completion_status: 'Not Started',
          lesson_content: {
            key_takeaway:
              'Resilience is not the absence of disturbance; it is the capacity to reconfigure relationships without dissolving core purpose.',
            conceptual_foundation:
              'Reconfiguration marks the turning point where diagnostic critique transforms into constructive design. Polycentric governance distributes authority across independent decision nodes with overlapping jurisdictions.',
            case_study:
              'The Internet Engineering Task Force (IETF) operates on "rough consensus and running code," avoiding bureaucratic gridlock by testing working implementations.',
            practical_exercise:
              'Draft an Adaptive Escalation Protocol outlining the exact quantitative triggers and qualitative review councils that convene when key metrics deviate by more than 15%.',
            reflection_prompt:
              'What control mechanisms are you reluctant to decentralize, and what fear drives that reluctance?',
            quiz: [
              {
                question: 'How does polycentric governance reduce single points of failure?',
                options: [
                  'By distributing authority across multiple overlapping, coordinated decision nodes.',
                  'By removing all leadership.',
                  'By enforcing rigid top-down commands.',
                  'By eliminating feedback channels.',
                ],
                correctIndex: 0,
                explanation:
                  'Overlapping jurisdictions allow neighboring nodes to maintain continuity if any single component fails.',
              },
            ],
          },
        },
        {
          id: 'mod_' + Math.random().toString(36).substring(2, 9),
          title: '04. Generative Deployment & Ecosystem Transfer',
          description:
            'Finalize the capstone generative artifact—a living operational framework, open registry, or audited prototype—and validate its transferability.',
          spiral_phase: 'Ascent',
          catalyst: 'Artifact as Catalyst: Translating Theory into Durable Institutional Infrastructure',
          micro_focus: 'Polishing code, schemas, and operational checklists',
          meso_focus: 'Conducting live pilot simulation and user feedback intake',
          macro_focus: 'Disseminating open framework to peer institutions and public registries',
          resources: [
            {
              title: 'The Open Source Initiative Standards for Public Infrastructure',
              type: 'tool',
              source: 'Open Source Initiative',
              summary: 'Licensing, contribution covenants, and governance models for open digital goods.',
            },
            {
              title: 'Evaluation Standards for Generative Socio-Technical Artifacts',
              type: 'framework',
              source: 'Journal of Systems and Software',
              summary:
                'Methodology for evaluating transferability and long-term utility across disparate organizational domains.',
            },
          ],
          feedback_prompts: [
            'How does the generative artifact invite continuous recursive critique from its users?',
            'What evidence demonstrates successful transfer of principles to adjacent problem spaces?',
          ],
          completion_status: 'Not Started',
          lesson_content: {
            key_takeaway:
              'Mastery is demonstrated not when you hold all the answers, but when you produce an artifact that allows others to discover answers independently.',
            conceptual_foundation:
              'The Ascent phase represents the completion of the learning spiral. The practitioner does not return to the starting point unchanged, but elevated with actionable generative authority.',
            case_study:
              'Linus Torvalds created Git not simply as a tool for Linux kernel maintenance, but as an open generative artifact that fundamentally redefined global software collaboration.',
            practical_exercise:
              'Package your project deliverables into a three-part package: (1) Technical Blueprint, (2) User Onboarding Runbook, and (3) Relational Evaluation Rubric.',
            reflection_prompt:
              'How will you know when the artifact has outgrown your personal stewardship and successfully belongs to the community?',
            quiz: [
              {
                question: 'What defines a generative artifact in the Ascent phase?',
                options: [
                  'A living, deployable tool or protocol that enables ongoing inquiry by others.',
                  'A static exam paper.',
                  'A private note that is never shared.',
                  'A temporary draft.',
                ],
                correctIndex: 0,
                explanation:
                  'Generative artifacts empower broader communities to reproduce, verify, and adapt the solutions.',
              },
            ],
          },
        },
      ],
    };

    // Weave learner-provided custom links
    if (Array.isArray(customExternalLinks) && customExternalLinks.length > 0) {
      customExternalLinks.forEach((link: any, idx: number) => {
        const targetMod = fallbackSyllabus.modules[idx % fallbackSyllabus.modules.length];
        if (targetMod) {
          targetMod.resources.push({
            title: link.title || 'Custom Learning Resource',
            type: link.platform || 'course',
            source: link.platform || 'External Integration',
            url: link.url || '#',
            summary: link.notes || 'Learner-provided integrated course reference and study material.',
          } as any);
        }
      });
    }

    return res.status(200).json({ success: true, syllabus: fallbackSyllabus });
  } catch (error: any) {
    console.error('Error in /api/generate-syllabus handler:', error);
    res.status(500).json({ error: error.message || 'Syllabus generation failed' });
  }
}
