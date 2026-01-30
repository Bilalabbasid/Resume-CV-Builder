import { NextRequest, NextResponse } from "next/server";
import { generateWithFallback, getCurrentModel } from "@/lib/gemini";

type EnhancementType = "summary" | "experience" | "skills" | "projects" | "education" | "bullet";

const ENHANCEMENT_PROMPTS: Record<EnhancementType, string> = {
    summary: `You are a professional resume writer. Enhance the following summary text to be more professional, concise, and impactful. 
Keep it to 2-3 sentences. Focus on achievements and value. Make it ATS-friendly.
Return ONLY the enhanced text, no explanations.`,
    
    experience: `You are a professional resume writer. Enhance the following work experience bullet point to be more impactful.
Use action verbs, quantify achievements where possible, and make it ATS-friendly.
Return ONLY the enhanced bullet point, no explanations.`,
    
    bullet: `You are a professional resume writer. Improve this bullet point to be more impactful:
- Start with a strong action verb
- Add metrics/numbers if possible
- Focus on results and impact
- Keep it concise (1-2 lines max)
Return ONLY the improved bullet point, no explanations.`,
    
    skills: `You are a professional resume writer. Given the following skill or skills, expand and organize them into a comprehensive skill list.
Group related skills together. Make them ATS-friendly.
Return ONLY a comma-separated list of skills, no explanations.`,
    
    projects: `You are a professional resume writer. Enhance the following project description to be more professional and impactful.
Focus on the technologies used, your role, and the impact/results.
Return ONLY the enhanced description, no explanations.`,
    
    education: `You are a professional resume writer. Enhance the following education information to be more professional.
Include relevant coursework, honors, or achievements if mentioned.
Return ONLY the enhanced text, no explanations.`
};

export async function POST(req: NextRequest) {
    let originalText = "";
    
    try {
        const body = await req.json();
        const { text, sectionType, action } = body as { 
            text: string; 
            sectionType: string;
            action?: "improve" | "shorten" | "metrics" | "ats" | "results";
        };
        
        originalText = text;

        if (!text || !sectionType) {
            return NextResponse.json({ error: "Text and sectionType are required" }, { status: 400 });
        }

        // Handle specific actions for inline suggestions
        let prompt = ENHANCEMENT_PROMPTS[sectionType as EnhancementType] || ENHANCEMENT_PROMPTS.summary;
        
        if (action) {
            switch (action) {
                case "improve":
                    prompt = `Make this text more professional and impactful. Return ONLY the improved text:\n`;
                    break;
                case "shorten":
                    prompt = `Shorten this text while keeping the key information. Return ONLY the shortened text:\n`;
                    break;
                case "metrics":
                    prompt = `Add quantifiable metrics to this text where possible. Return ONLY the enhanced text:\n`;
                    break;
                case "ats":
                    prompt = `Optimize this text for ATS (Applicant Tracking Systems). Use industry keywords. Return ONLY the optimized text:\n`;
                    break;
                case "results":
                    prompt = `Rewrite to focus on results and impact. Use action verbs. Return ONLY the rewritten text:\n`;
                    break;
            }
        }
        
        // Use generateWithFallback for automatic model switching (text mode)
        const enhancedText = await generateWithFallback<string>(
            `Text to enhance:\n${text}`,
            prompt,
            false // Text mode, not JSON
        );

        if (!enhancedText) {
            // Fallback: Return slightly improved version
            return NextResponse.json({ 
                enhancedText: originalText.charAt(0).toUpperCase() + originalText.slice(1) + (originalText.endsWith('.') ? '' : '.'),
                fallback: true,
                modelUsed: getCurrentModel()
            });
        }

        return NextResponse.json({ 
            enhancedText: (enhancedText as string).trim(),
            modelUsed: getCurrentModel()
        });

    } catch (error: unknown) {
        console.error("Enhancement Error:", error);
        
        // Fallback: Return slightly improved version
        if (originalText) {
            return NextResponse.json({ 
                enhancedText: originalText.charAt(0).toUpperCase() + originalText.slice(1) + (originalText.endsWith('.') ? '' : '.'),
                fallback: true,
                modelUsed: getCurrentModel()
            });
        }
        
        return NextResponse.json({ error: "Enhancement failed", modelUsed: getCurrentModel() }, { status: 500 });
    }
}
