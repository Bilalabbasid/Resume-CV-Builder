import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback, PROMPTS, getCurrentModel } from "@/lib/gemini";

// Resume data structure
interface GeneratedResume {
    summary?: string;
    skills?: string[];
    experience?: Array<{
        company: string;
        role: string;
        date: string;
        bullets: string[];
    }>;
    projects?: Array<{
        name: string;
        description: string;
        bullets?: string[];
    }>;
    education?: Array<{
        school: string;
        degree: string;
        year: string;
    }>;
    certifications?: Array<{
        name: string;
        issuer: string;
        date?: string;
    }>;
}

const RESPONSE_FORMAT = `
AI RESPONSE FORMAT (STRICT):
{
  "summary": "Professional summary (2-3 sentences, impactful, ATS-friendly, tailored to JD)",
  "skills": ["Skill 1", "Skill 2", "..."],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "date": "Start - End",
      "bullets": ["Achievement with metrics", "Impact statement"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description with tech stack used",
      "bullets": ["Key achievement with metrics", "Technical impact"]
    }
  ],
  "education": [
    {
      "school": "University Name",
      "degree": "Degree Type",
      "year": "Graduation Year"
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Year or Date Obtained"
    }
  ]
}

IMPORTANT FOR PROJECTS:
- Generate 2-3 relevant projects based on the job description
- Each project should demonstrate skills mentioned in the JD
- Use realistic project names and descriptions
- Include technologies/tools mentioned in the JD
- Add 2-3 bullet points with measurable impact

IMPORTANT FOR CERTIFICATIONS:
- Suggest 2-3 relevant certifications based on the JD
- Include industry-standard certifications for the role
- Use real certification names (e.g., AWS Solutions Architect, PMP, Google Analytics)
- Only suggest certifications that are realistic for the role`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, jobDescription, contactInfo } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const userPrompt = `
Create a professional, ATS-optimized resume for the following profile:

PROFILE:
${prompt}

${jobDescription ? `
TARGET JOB DESCRIPTION (tailor ALL sections to match this):
${jobDescription}

CRITICAL REQUIREMENTS:
1. SKILLS: Extract and use keywords from the JD. Prioritize skills mentioned in the JD.
2. EXPERIENCE: Tailor bullet points to match JD requirements. Use action verbs and metrics.
3. PROJECTS: Generate 2-3 relevant projects that demonstrate skills from the JD.
   - Use technologies mentioned in the JD
   - Create realistic project names and descriptions
   - Add measurable outcomes (e.g., "Reduced load time by 40%")
4. CERTIFICATIONS: Suggest 2-3 industry-standard certifications relevant to this role.
   - Use real certification names (AWS, Google, Microsoft, etc.)
   - Only suggest certifications that match the JD requirements
5. SUMMARY: Write a compelling 2-3 sentence summary that matches the JD tone and requirements.
` : `
Generate a general professional resume with:
- 2-3 relevant projects based on the profile
- 2-3 industry-standard certifications for the role
`}

${contactInfo ? `
CONTACT INFO (for reference):
Name: ${contactInfo.fullName || 'Not provided'}
Email: ${contactInfo.email || 'Not provided'}
` : ""}

Generate a COMPLETE resume with ALL sections: summary, skills, experience, projects, education, and certifications.
Make it compelling, professional, and ATS-friendly.
`;

    const systemPrompt = PROMPTS.RESUME_GENERATION + RESPONSE_FORMAT;
    
    // Use generateWithFallback for automatic model switching
    const structuredData = await generateWithFallback<GeneratedResume>(
      userPrompt,
      systemPrompt,
      true // JSON mode
    );

    if (!structuredData) {
      return NextResponse.json({ 
        error: "AI generation failed after trying all available models",
        modelUsed: getCurrentModel()
      }, { status: 500 });
    }

    return NextResponse.json({ 
      data: structuredData,
      modelUsed: getCurrentModel() // For debugging
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: message, modelUsed: getCurrentModel() }, { status: 500 });
  }
}
