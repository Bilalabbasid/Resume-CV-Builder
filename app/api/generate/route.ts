import { NextRequest, NextResponse } from "next/server";
import { model, PROMPTS, parseAIResponse } from "@/lib/gemini";

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
}

const RESPONSE_FORMAT = `
AI RESPONSE FORMAT (STRICT):
{
  "summary": "Professional summary (2-3 sentences, impactful, ATS-friendly)",
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
      "description": "Brief description with tech stack",
      "bullets": ["Key achievement", "Technical impact"]
    }
  ],
  "education": [
    {
      "school": "University Name",
      "degree": "Degree Type",
      "year": "Graduation Year"
    }
  ]
}`;

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
TARGET JOB DESCRIPTION (tailor resume to match this):
${jobDescription}

IMPORTANT: 
- Use keywords from the job description naturally
- Align skills and experience with JD requirements
- Emphasize relevant achievements
` : ""}

${contactInfo ? `
CONTACT INFO (for reference):
Name: ${contactInfo.fullName || 'Not provided'}
Email: ${contactInfo.email || 'Not provided'}
` : ""}

Generate a complete resume with all sections. Make it compelling and ATS-friendly.
`;

    const systemPrompt = PROMPTS.RESUME_GENERATION + RESPONSE_FORMAT;
    
    const result = await model.generateContent([
      systemPrompt,
      userPrompt
    ]);

    const responseText = result.response.text();
    const structuredData = parseAIResponse<GeneratedResume>(responseText);

    if (!structuredData) {
      console.error("Failed to parse JSON", responseText);
      return NextResponse.json({ error: "AI produced invalid JSON", raw: responseText }, { status: 500 });
    }

    return NextResponse.json({ data: structuredData });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
