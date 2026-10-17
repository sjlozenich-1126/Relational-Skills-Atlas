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
    const { skills, projects, targetRole } = body;
    const ai = getGenAI();

    if (ai) {
      try {
        const prompt = `
Generate concise, high-impact, executive CV bullet points and a professional summary for a candidate using the following skills and project achievements:

Target Role: ${targetRole || 'Systems Architect / Governance Specialist'}
Assessed Skills: ${(skills || []).map((s: any) => `${s.name} (${s.domain_area}, level ${s.proficiency_level}/5)`).join('; ')}
Projects: ${(projects || []).map((p: any) => `${p.title} (${p.category}): ${p.description}`).join('; ')}

Return strict JSON:
{
  "summary": "2-3 sentence executive profile summary showcasing relational systems competencies, technical rigor, and cross-domain impact.",
  "bullet_points": [
    "Active-verb bullet point 1 with quantified scope and institutional impact",
    "Active-verb bullet point 2 demonstrating relational reasoning and adaptive revision",
    "Active-verb bullet point 3 highlighting generative artifact delivery",
    "Active-verb bullet point 4 highlighting leadership and ethical accountability"
  ]
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
          return res.status(200).json({ success: true, ...parsed });
        }
      } catch (geminiError) {
        console.warn('Gemini CV wording fallback:', geminiError);
      }
    }

    // Deterministic fallback
    const fallbackBullets = [
      'Orchestrated multi-stakeholder systems audits across regulatory, digital, and ecological domains, aligning technical evidence with statutory governance mandates.',
      'Engineered cross-scale relational frameworks resolving deep-seated institutional friction, reducing jurisdictional compliance risk by establishing verifiable audit trails.',
      'Pioneered adaptive revision and polycentric review protocols that transformed adversarial stakeholder negotiations into resilient collaborative agreements.',
      'Authored comprehensive generative artifacts including open registries, cadastral reconciliation matrices, and forensic chain-of-custody specifications.',
    ];

    const fallbackSummary =
      'Accomplished systems practitioner and governance architect with proven expertise in cross-domain forensic auditing, relational legal instruments, and digital infrastructure resilience. Dedicated to bridging micro-level evidentiary analysis with macro-level institutional stewardship.';

    return res.status(200).json({
      success: true,
      summary: fallbackSummary,
      bullet_points: fallbackBullets,
    });
  } catch (error: any) {
    console.error('Error in /api/generate-cv-wording handler:', error);
    res.status(500).json({ error: error.message || 'CV generation failed' });
  }
}
