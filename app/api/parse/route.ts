import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";


// Increase limit for PDF uploads if needed, but Next.js default is usually fine for resumes.
// For parsing, we first extract text then ask Gemini to structure it.

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

        // 2. AI Structure
        const result = await model.generateContent([
            CLEANUP_PROMPT,
            `RESUME TEXT:\n${textContent}`
        ]);

        const responseText = result.response.text();
        let structuredData;
        try {
            // Attempt to find JSON block if wrapped in markdown
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const cleanJson = jsonMatch ? jsonMatch[0] : responseText;
            structuredData = JSON.parse(cleanJson);
        } catch (_e) {
            return NextResponse.json({ error: "AI failed to structure data", raw: responseText }, { status: 500 });
        }

        return NextResponse.json({ data: structuredData });

    } catch (error: any) {
        console.error("Parse API Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
