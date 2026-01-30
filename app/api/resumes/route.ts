import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ContactInfo } from "@/types/resume";

export async function GET() {
    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Database Error (GET):", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
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
                    user_id: userId || "demo-user",
                    template_id: templateId || "single-column",
                    sections: initialSections,
                    job_description: jobDescription || null,
                },
            ])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.warn("Database Error (POST):", errorMessage);
        console.warn("Activating DEMO MODE for creation.");

        // DEMO MODE: Return a mock created resume
        const demoId = "demo-" + Math.random().toString(36).substring(7);
        return NextResponse.json({
            data: {
                id: demoId,
                title: "Demo Resume (Offline)",
                template_id: "single-column",
                sections: [],
                user_id: "demo-user",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        });
    }
}
