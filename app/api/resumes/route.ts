import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ContactInfo, Resume } from "@/types/resume";

// Helper to map database fields to Resume interface
// Handles missing columns gracefully
function mapDbToResume(dbData: Record<string, unknown>): Resume {
    return {
        id: dbData.id as string,
        userId: (dbData.user_id || dbData.userId || "anonymous") as string,
        title: (dbData.title || "Untitled Resume") as string,
        templateId: (dbData.template_id || dbData.templateId || "modern-2024") as string,
        sections: (dbData.sections as Resume["sections"]) || [],
        jobDescription: (dbData.job_description || dbData.jobDescription) as string | undefined,
        atsScore: (dbData.ats_score || dbData.atsScore) as number | undefined,
        createdAt: dbData.created_at ? new Date(dbData.created_at as string) : new Date(),
        updatedAt: dbData.updated_at ? new Date(dbData.updated_at as string) : new Date(),
    };
}

export async function GET() {
    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Database Error (GET):", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map database fields to Resume interface
    const mappedData = data?.map(mapDbToResume) || [];

    return NextResponse.json({ data: mappedData });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, templateId, userId, contactInfo, jobDescription } = body as {
            title: string;
            templateId?: string;
            userId?: string;
            contactInfo?: ContactInfo;
            jobDescription?: string;
        };

        console.log("Creating Resume:", { title, templateId, userId });

        // Initialize with contact section if provided
        const initialSections = contactInfo ? [
            {
                id: `contact-${Date.now()}`,
                type: "contact",
                content: contactInfo,
                order: 0
            }
        ] : [];

        const { data, error } = await supabase
            .from("resumes")
            .insert([
                {
                    title,
                    user_id: userId || "anonymous",
                    template_id: templateId || "modern-2024",
                    sections: initialSections,
                    job_description: jobDescription || null,
                    is_ai_generated: true
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", JSON.stringify(error, null, 2));
            throw new Error(error.message || error.code || "Database insert failed");
        }

        console.log("Resume created successfully:", data.id);
        
        // Map to Resume interface for consistent response
        const mappedData = mapDbToResume(data);
        return NextResponse.json({ data: mappedData });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("Database Error (POST):", errorMessage);
        console.error("Full error:", err);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
