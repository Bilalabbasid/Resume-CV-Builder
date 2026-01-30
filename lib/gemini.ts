import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Environment check
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("⚠️ Missing GEMINI_API_KEY environment variable. AI features will not work.");
}

// Initialize the Gemini client
export const genAI = new GoogleGenerativeAI(apiKey || "");

// Primary model for JSON responses (resume generation, analysis)
export const model: GenerativeModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7, // Balanced creativity
        topP: 0.95,
        maxOutputTokens: 8192,
    }
});

// Text model for cover letters and text-only responses
export const textModel: GenerativeModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
    generationConfig: {
        responseMimeType: "text/plain",
        temperature: 0.8, // Slightly more creative for writing
        topP: 0.95,
        maxOutputTokens: 4096,
    }
});

// Helper to safely parse JSON from AI response
export function parseAIResponse<T>(text: string): T | null {
    try {
        // Try direct parse
        return JSON.parse(text) as T;
    } catch {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[1].trim()) as T;
            } catch {
                console.error("Failed to parse extracted JSON:", jsonMatch[1]);
            }
        }
        console.error("Failed to parse AI response as JSON:", text.substring(0, 200));
        return null;
    }
}

// Common prompts for consistency
export const PROMPTS = {
    // Resume generation system prompt
    RESUME_GENERATION: `You are a professional resume writer and ATS optimization expert.
Always return valid JSON. Never include markdown formatting in the JSON values.
Use concise, impactful bullet points with action verbs.
Quantify achievements where possible with realistic metrics.
Avoid fluff and generic statements.

SMART EXPANSION MODE:
When given minimal input like "Software Engineer at Google (2020-2024)":
- Generate 3-5 realistic, impactful bullet points based on the role and company
- Use industry-standard responsibilities for that role
- Add realistic but conservative metrics (e.g., "Improved performance by 15%")
- Match the seniority level implied by the role title
- Tailor bullets to match the job description if provided

When a job description is provided:
- Match keywords and terminology from the JD
- Align skills with JD requirements
- Tailor experience bullets to highlight relevant achievements
- Ensure ATS compatibility
- Prioritize skills mentioned in the JD

STRICT RULES:
- Never invent fake companies or degrees
- Never make impossible or exaggerated claims
- Use realistic, industry-appropriate metrics
- Keep bullet points concise (under 20 words each)
- Start each bullet with a strong action verb`,

    // JD Analysis prompt
    JD_ANALYSIS: `You are an expert job description analyst and ATS optimization specialist.
Analyze the job description and extract key information for resume tailoring.

Return STRICT JSON format:
{
  "role": "Job title extracted from JD",
  "seniority": "junior|mid|senior|lead|executive",
  "requiredSkills": ["Required skill 1", "Required skill 2"],
  "preferredSkills": ["Nice to have skill 1", "Nice to have skill 2"],
  "keywords": ["Important ATS keywords from the JD"],
  "industry": "Industry/sector of the role",
  "tone": "formal|casual|technical|creative"
}

Extract ALL relevant keywords that an ATS would scan for.
Be thorough - missing keywords means the resume won't match.`,

    // ATS Scoring prompt
    ATS_SCORING: `You are an ATS (Applicant Tracking System) expert and resume reviewer.
Analyze the resume against the job description (if provided) and score it.

Return STRICT JSON format:
{
  "overall": 85,
  "keywordMatch": 80,
  "formatting": 90,
  "sectionCompleteness": 85,
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "redFlags": ["Red flag 1 (e.g., too long, weak verbs)"]
}

Scoring criteria:
- overall: 0-100, weighted average of all factors
- keywordMatch: 0-100, how well resume matches JD keywords
- formatting: 0-100, ATS-friendly formatting (no tables, proper sections)
- sectionCompleteness: 0-100, all important sections present and complete

Be specific with suggestions. Include actionable improvements.
Limit to top 5 suggestions and top 3 red flags.`,

    // Enhancement prompt
    ENHANCEMENT: `You are a professional resume writer. Enhance the given text while:
- Keeping the core message intact
- Using strong action verbs
- Adding metrics where appropriate
- Making it more concise and impactful
- Ensuring ATS compatibility

Return only the enhanced text, no explanations.`,

    // Cover letter prompt
    COVER_LETTER: `You are an expert cover letter writer. Create a compelling, personalized cover letter.

Guidelines:
- Professional yet personable tone
- Highlight relevant experience from the resume
- Match keywords and requirements from the job description
- Show enthusiasm for the specific role and company
- Keep it to 3-4 paragraphs (300-400 words)
- Include specific examples from the resume
- End with a clear call to action

Structure:
1. Opening: Hook + position applying for
2. Body 1: Most relevant experience/achievement
3. Body 2: Skills and cultural fit
4. Closing: Enthusiasm + call to action

Return ONLY the cover letter text (no JSON, no explanation).`
};
