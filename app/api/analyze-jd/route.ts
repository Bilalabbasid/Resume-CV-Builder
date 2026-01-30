import { NextRequest, NextResponse } from "next/server";
import { model, PROMPTS, parseAIResponse } from "@/lib/gemini";
import { JDAnalysis } from "@/types/resume";

export async function POST(req: NextRequest) {
    try {
        const { jobDescription } = await req.json() as { jobDescription: string };

        if (!jobDescription || jobDescription.trim().length < 50) {
            return NextResponse.json({ 
                error: "Please provide a complete job description (at least 50 characters)" 
            }, { status: 400 });
        }

        const result = await model.generateContent([
            PROMPTS.JD_ANALYSIS,
            `Analyze this job description:\n\n${jobDescription}`
        ]);

        const responseText = result.response.text();
        const analysis = parseAIResponse<JDAnalysis>(responseText);

        if (!analysis) {
            console.error("Failed to parse JD analysis JSON", responseText);
            return NextResponse.json({ 
                error: "Failed to analyze job description" 
            }, { status: 500 });
        }

        return NextResponse.json({ data: analysis });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "JD analysis failed";
        console.error("JD Analysis Error:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
