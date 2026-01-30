import { NextRequest, NextResponse } from "next/server";
import { model, PROMPTS, parseAIResponse } from "@/lib/gemini";
import { ATSScore, Resume, ResumeSection } from "@/types/resume";

function extractResumeText(sections: ResumeSection[]): string {
    let text = "";
    
    for (const section of sections) {
        text += `\n--- ${section.type.toUpperCase()} ---\n`;
        
        if (typeof section.content === "string") {
            text += section.content + "\n";
        } else if (Array.isArray(section.content)) {
            if (section.type === "skills") {
                text += (section.content as string[]).join(", ") + "\n";
            } else if (section.type === "experience") {
                for (const exp of section.content as { role: string; company: string; bullets: string[] }[]) {
                    text += `${exp.role} at ${exp.company}\n`;
                    if (exp.bullets) {
                        for (const bullet of exp.bullets) {
                            text += `• ${bullet}\n`;
                        }
                    }
                }
            } else if (section.type === "projects") {
                for (const proj of section.content as { name: string; description: string }[]) {
                    text += `${proj.name}: ${proj.description}\n`;
                }
            } else if (section.type === "education") {
                for (const edu of section.content as { school: string; degree: string; year: string }[]) {
                    text += `${edu.degree} from ${edu.school} (${edu.year})\n`;
                }
            }
        } else if (section.type === "contact") {
            const contact = section.content as { fullName?: string; email?: string };
            if (contact.fullName) text += `Name: ${contact.fullName}\n`;
            if (contact.email) text += `Email: ${contact.email}\n`;
        }
    }
    
    return text;
}

export async function POST(req: NextRequest) {
    try {
        const { resume, jobDescription } = await req.json() as { 
            resume: Resume | { sections: ResumeSection[] }; 
            jobDescription?: string;
        };

        if (!resume || !resume.sections || resume.sections.length === 0) {
            return NextResponse.json({ 
                error: "Resume with sections is required" 
            }, { status: 400 });
        }

        const resumeText = extractResumeText(resume.sections);

        const userPrompt = `
Analyze this resume for ATS compatibility:

RESUME:
${resumeText}

${jobDescription ? `
TARGET JOB DESCRIPTION:
${jobDescription}

Score the resume's match to this specific JD.
` : `
No specific JD provided. Score for general ATS best practices.
`}

Provide detailed scoring and actionable suggestions.
`;

        const result = await model.generateContent([
            PROMPTS.ATS_SCORING,
            userPrompt
        ]);

        const responseText = result.response.text();
        const score = parseAIResponse<ATSScore>(responseText);

        if (!score) {
            console.error("Failed to parse ATS score JSON", responseText);
            // Return a default score on parse failure
            return NextResponse.json({ 
                data: {
                    overall: 70,
                    keywordMatch: 70,
                    formatting: 80,
                    sectionCompleteness: 70,
                    missingKeywords: [],
                    suggestions: ["Add more specific keywords", "Include metrics in your achievements"],
                    redFlags: ["Could not fully analyze - try adding more content"]
                } 
            });
        }

        return NextResponse.json({ data: score });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "ATS scoring failed";
        console.error("ATS Score Error:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
