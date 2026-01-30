import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Environment check
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn("⚠️ Missing GEMINI_API_KEY environment variable. AI features will not work.");
}

// Initialize the Gemini client
export const genAI = new GoogleGenerativeAI(apiKey || "");

/**
 * Model priority list from BEST to WORST (as of Jan 2026)
 * Based on Google Gemini API documentation: https://ai.google.dev/gemini-api/docs/models
 * 
 * Tier 1 (Premium):
 *   - gemini-2.5-pro: Most intelligent, state-of-the-art thinking model
 *   - gemini-2.5-flash: Best price-performance, fast with thinking capability
 * 
 * Tier 2 (Standard):
 *   - gemini-2.0-flash: Second generation workhorse, 1M context
 *   - gemini-2.0-flash-lite: Cost-optimized version
 * 
 * Tier 3 (Preview/Experimental):
 *   - gemini-3-flash-preview: Next-gen preview (may not be stable)
 */
export const MODEL_PRIORITY = [
    "gemini-2.5-flash",       // Best: Fast, stable, supports structured output
    "gemini-2.5-pro",         // Premium: Most intelligent, good for complex tasks
    "gemini-2.0-flash",       // Fallback: Second gen, stable
    "gemini-2.0-flash-lite",  // Last resort: Cost-efficient
] as const;

export type GeminiModelName = typeof MODEL_PRIORITY[number];

// Track current model for logging/debugging
let currentModelIndex = 0;
let currentModel: GeminiModelName = MODEL_PRIORITY[0];

/**
 * Get the next available model in the priority list
 * Call this when a model fails with 404
 */
export function getNextModel(): GeminiModelName | null {
    currentModelIndex++;
    if (currentModelIndex >= MODEL_PRIORITY.length) {
        console.error("❌ All Gemini models exhausted. No fallback available.");
        return null;
    }
    currentModel = MODEL_PRIORITY[currentModelIndex];
    console.log(`⚡ Switching to fallback model: ${currentModel}`);
    return currentModel;
}

/**
 * Reset model selection to best available
 */
export function resetModelSelection(): void {
    currentModelIndex = 0;
    currentModel = MODEL_PRIORITY[0];
}

/**
 * Get current active model name
 */
export function getCurrentModel(): GeminiModelName {
    return currentModel;
}

/**
 * Create a model instance with the specified name
 */
function createModel(modelName: string, forJson: boolean = true): GenerativeModel {
    return genAI.getGenerativeModel({
        model: modelName,
        generationConfig: forJson ? {
            responseMimeType: "application/json",
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 8192,
        } : {
            temperature: 0.8,
            topP: 0.95,
            maxOutputTokens: 4096,
        }
    });
}

// Primary model for JSON responses (resume generation, analysis)
export let model: GenerativeModel = createModel(currentModel, true);

// Text model for cover letters and text-only responses
export let textModel: GenerativeModel = createModel(currentModel, false);

/**
 * Execute AI generation with automatic model fallback
 * Tries models in priority order until one succeeds
 */
export async function generateWithFallback<T>(
    prompt: string,
    systemPrompt: string,
    useJsonMode: boolean = true
): Promise<T | null> {
    resetModelSelection();
    
    while (currentModelIndex < MODEL_PRIORITY.length) {
        const modelName = MODEL_PRIORITY[currentModelIndex];
        console.log(`🤖 Attempting generation with: ${modelName}`);
        
        try {
            const activeModel = createModel(modelName, useJsonMode);
            const fullPrompt = `${systemPrompt}\n\n${prompt}`;
            const result = await activeModel.generateContent(fullPrompt);
            const text = result.response.text();
            
            if (useJsonMode) {
                const parsed = parseAIResponse<T>(text);
                if (parsed) {
                    console.log(`✅ Success with model: ${modelName}`);
                    // Update exports to use successful model
                    model = createModel(modelName, true);
                    textModel = createModel(modelName, false);
                    currentModel = modelName;
                    return parsed;
                }
            } else {
                console.log(`✅ Success with model: ${modelName}`);
                model = createModel(modelName, true);
                textModel = createModel(modelName, false);
                currentModel = modelName;
                return text as unknown as T;
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const isModelNotFound = errorMessage.includes("404") || 
                                    errorMessage.includes("not found") ||
                                    errorMessage.includes("not supported");
            
            if (isModelNotFound) {
                console.warn(`⚠️ Model ${modelName} not available, trying next...`);
                currentModelIndex++;
                continue;
            }
            
            // For non-404 errors, throw immediately
            console.error(`❌ Error with ${modelName}:`, errorMessage);
            throw error;
        }
    }
    
    console.error("❌ All models failed. Unable to generate content.");
    return null;
}

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
