import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback, PROMPTS, getCurrentModel } from "@/lib/gemini";
import { JDAnalysis } from "@/types/resume";

export async function POST(req: NextRequest) {
    try {
        const { jobDescription } = await req.json() as { jobDescription: string };

        if (!jobDescription || jobDescription.trim().length < 50) {
            return NextResponse.json({ 
                error: "Please provide a complete job description (at least 50 characters)" 
            }, { status: 400 });
        }

        // Use generateWithFallback for automatic model switching
        const analysis = await generateWithFallback<JDAnalysis>(
            `Analyze this job description:\n\n${jobDescription}`,
            PROMPTS.JD_ANALYSIS,
            true // JSON mode
        );

        if (!analysis) {
            return NextResponse.json({ 
                error: "Failed to analyze job description after trying all models",
                modelUsed: getCurrentModel()
            }, { status: 500 });
        }

        return NextResponse.json({ 
            data: analysis,
            modelUsed: getCurrentModel()
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "JD analysis failed";
        console.error("JD Analysis Error:", error);
        return NextResponse.json({ error: message, modelUsed: getCurrentModel() }, { status: 500 });
    }
}
