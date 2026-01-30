import { NextRequest, NextResponse } from "next/server";
import { textModel, PROMPTS } from "@/lib/gemini";
import { ContactInfo, ResumeSection } from "@/types/resume";

function extractResumeContext(sections: ResumeSection[]): string {
    let context = "";
    
    for (const section of sections) {
        if (section.type === "summary" && typeof section.content === "string") {
            context += `\nProfessional Summary: ${section.content}\n`;
        } else if (section.type === "skills" && Array.isArray(section.content)) {
            context += `\nSkills: ${(section.content as string[]).join(", ")}\n`;
        } else if (section.type === "experience" && Array.isArray(section.content)) {
            context += "\nExperience:\n";
            for (const exp of section.content as { role: string; company: string; bullets: string[] }[]) {
                context += `- ${exp.role} at ${exp.company}\n`;
                if (exp.bullets?.length > 0) {
                    context += `  Key achievements: ${exp.bullets.slice(0, 2).join("; ")}\n`;
                }
            }
        }
    }
    
    return context;
}

export async function POST(req: NextRequest) {
    try {
        const { resumeSections, jobDescription, contactInfo, companyName, roleName } = await req.json() as {
            resumeSections: ResumeSection[];
            jobDescription: string;
            contactInfo?: ContactInfo;
            companyName?: string;
            roleName?: string;
        };

        if (!resumeSections || resumeSections.length === 0) {
            return NextResponse.json({ 
                error: "Resume sections are required" 
            }, { status: 400 });
        }

        if (!jobDescription || jobDescription.trim().length < 50) {
            return NextResponse.json({ 
                error: "Please provide a job description (at least 50 characters)" 
            }, { status: 400 });
        }

        const resumeContext = extractResumeContext(resumeSections);

        const userPrompt = `
Write a cover letter for this candidate:

CANDIDATE INFO:
${contactInfo?.fullName ? `Name: ${contactInfo.fullName}` : ""}
${contactInfo?.email ? `Email: ${contactInfo.email}` : ""}

RESUME HIGHLIGHTS:
${resumeContext}

TARGET JOB:
${roleName ? `Position: ${roleName}` : ""}
${companyName ? `Company: ${companyName}` : ""}

JOB DESCRIPTION:
${jobDescription}

Write a compelling cover letter that connects the candidate's experience to the job requirements.
`;

        const result = await textModel.generateContent([
            PROMPTS.COVER_LETTER,
            userPrompt
        ]);

        const coverLetter = result.response.text().trim();

        return NextResponse.json({ data: coverLetter });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Cover letter generation failed";
        console.error("Cover Letter Error:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
