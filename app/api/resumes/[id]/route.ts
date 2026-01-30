import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Database Error (GET ID):", error.message);
        return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const body = await req.json() as Record<string, unknown>;

        // Map frontend field names to database column names
        const updateData: Record<string, unknown> = {};
        
        if (body.sections !== undefined) updateData.sections = body.sections;
        if (body.templateId !== undefined) updateData.template_id = body.templateId;
        if (body.title !== undefined) updateData.title = body.title;
        if (body.jobDescription !== undefined) updateData.job_description = body.jobDescription;
        if (body.atsScore !== undefined) updateData.ats_score = body.atsScore;
        
        // Add updated_at timestamp
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from("resumes")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ data });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Update failed";
        console.error("Database Error (PATCH):", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
