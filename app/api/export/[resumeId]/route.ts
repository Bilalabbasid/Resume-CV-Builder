import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { supabase } from "@/lib/supabase";

// Get resume title for filename
async function getResumeName(resumeId: string): Promise<string> {
    try {
        const { data } = await supabase.from("resumes").select("title").eq("id", resumeId).single();
        if (data?.title) {
            // Sanitize filename
            return data.title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_');
        }
    } catch {
        // Fallback
    }
    return `resume-${resumeId}`;
}

export async function GET(req: NextRequest, context: { params: Promise<{ resumeId: string }> }) {
    const { resumeId } = await context.params;

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();

        // Determine base URL dynamically
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.includes("localhost") ? "http" : "https";
        const baseUrl = `${protocol}://${host}`;

        await page.goto(`${baseUrl}/print/${resumeId}`, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "0.5in",
                right: "0.5in",
                bottom: "0.5in",
                left: "0.5in"
            }
        });

        await browser.close();

        // Get proper filename
        const filename = await getResumeName(resumeId);

        return new NextResponse(Buffer.from(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}.pdf"`,
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "PDF generation failed";
        console.error("PDF Generation Error", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
