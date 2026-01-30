import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback, getCurrentModel } from "@/lib/gemini";

// Increase limit for PDF uploads if needed, but Next.js default is usually fine for resumes.
// For parsing, we first extract text then ask Gemini to structure it.

interface ParsedResume {
    summary: string;
    skills: string[];
    experience: Array<{
        company: string;
        role: string;
        date: string;
        bullets: string[];
    }>;
    projects: Array<{
        name: string;
        description: string;
    }>;
    education: Array<{
        school: string;
        degree: string;
        year: string;
    }>;
}

const CLEANUP_PROMPT = `
You are an expert Resume Parser. 
Convert the following unstructured resume text into the STRICT JSON format below.
If a section is missing, leave it as empty array or empty string.
Do not invent information.

JSON FORMAT:
{
  "summary": "string",
  "skills": ["string"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "date": "string", 
      "bullets": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string"
    }
  ],
  "education": [
      {
          "school": "string",
          "degree": "string",
          "year": "string"
      }
  ]
}
`;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 1. Extract Text
        let textContent = "";
        try {
            const pdfModule = await import('pdf-parse');
            const pdf = (pdfModule as any).default ?? pdfModule;
            const data = await pdf(buffer);
            textContent = data.text;
        } catch (_e) {
            console.error("PDF Parse Error", _e);
            return NextResponse.json({ error: "Failed to parse PDF text" }, { status: 500 });
        }

        // 2. AI Structure using fallback mechanism
        const structuredData = await generateWithFallback<ParsedResume>(
            `RESUME TEXT:\n${textContent}`,
            CLEANUP_PROMPT,
            true // JSON mode
        );

        if (!structuredData) {
            return NextResponse.json({ 
                error: "AI failed to structure data after trying all models",
                modelUsed: getCurrentModel()
            }, { status: 500 });
        }

        return NextResponse.json({ 
            data: structuredData,
            modelUsed: getCurrentModel()
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Parse failed";
        console.error("Parse API Error", error);
        return NextResponse.json({ error: message, modelUsed: getCurrentModel() }, { status: 500 });
    }
}
