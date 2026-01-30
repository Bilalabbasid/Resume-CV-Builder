import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { supabase } from "@/lib/supabase";
import { ResumeSection, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

interface ResumeData {
    id: string;
    title: string;
    sections: ResumeSection[];
}

// Helper to create heading
function createHeading(text: string) {
    return new Paragraph({
        text: text.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        border: {
            bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 }
        }
    });
}

// Helper to create bullet point
function createBullet(text: string) {
    return new Paragraph({
        children: [new TextRun({ text: `• ${text}` })],
        spacing: { after: 50 },
        indent: { left: 360 }
    });
}

export async function GET(req: NextRequest, context: { params: Promise<{ resumeId: string }> }) {
    const { resumeId } = await context.params;

    try {
        // Fetch resume from database
        const { data: resume, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", resumeId)
            .single();

        if (error || !resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        const resumeData = resume as ResumeData;
        const sections = resumeData.sections || [];

        // Extract sections
        const contactSection = sections.find(s => s.type === "contact");
        const contact = contactSection?.content as ContactInfo | undefined;
        const summary = sections.find(s => s.type === "summary")?.content as string | undefined;
        const skills = sections.find(s => s.type === "skills")?.content as string[] | undefined;
        const experience = sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
        const projects = sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
        const education = sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

        // Build document sections
        const docSections: Paragraph[] = [];

        // Header - Name and Contact
        docSections.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: contact?.fullName || "YOUR NAME",
                        bold: true,
                        size: 48
                    })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 }
            })
        );

        // Contact info line
        const contactParts: string[] = [];
        if (contact?.email) contactParts.push(contact.email);
        if (contact?.phone) contactParts.push(contact.phone);
        if (contact?.location) contactParts.push(contact.location);
        if (contact?.linkedin) contactParts.push(contact.linkedin);
        
        if (contactParts.length > 0) {
            docSections.push(
                new Paragraph({
                    children: [new TextRun({ text: contactParts.join(" | "), size: 20 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 }
                })
            );
        }

        // Summary
        if (summary) {
            docSections.push(createHeading("Professional Summary"));
            docSections.push(
                new Paragraph({
                    children: [new TextRun({ text: summary })],
                    spacing: { after: 200 }
                })
            );
        }

        // Skills
        if (skills && skills.length > 0) {
            docSections.push(createHeading("Skills"));
            docSections.push(
                new Paragraph({
                    children: [new TextRun({ text: skills.join(", ") })],
                    spacing: { after: 200 }
                })
            );
        }

        // Experience
        if (experience && experience.length > 0) {
            docSections.push(createHeading("Experience"));
            for (const exp of experience) {
                // Job title and company
                docSections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.role, bold: true }),
                            new TextRun({ text: ` at ${exp.company}` })
                        ],
                        spacing: { before: 100 }
                    })
                );
                // Date
                if (exp.date) {
                    docSections.push(
                        new Paragraph({
                            children: [new TextRun({ text: exp.date, italics: true, size: 20 })]
                        })
                    );
                }
                // Bullets
                if (exp.bullets) {
                    for (const bullet of exp.bullets) {
                        if (bullet.trim()) {
                            docSections.push(createBullet(bullet));
                        }
                    }
                }
            }
        }

        // Projects
        if (projects && projects.length > 0) {
            docSections.push(createHeading("Projects"));
            for (const proj of projects) {
                docSections.push(
                    new Paragraph({
                        children: [new TextRun({ text: proj.name, bold: true })],
                        spacing: { before: 100 }
                    })
                );
                if (proj.description) {
                    docSections.push(
                        new Paragraph({
                            children: [new TextRun({ text: proj.description })]
                        })
                    );
                }
                if (proj.bullets) {
                    for (const bullet of proj.bullets) {
                        if (bullet.trim()) {
                            docSections.push(createBullet(bullet));
                        }
                    }
                }
            }
        }

        // Education
        if (education && education.length > 0) {
            docSections.push(createHeading("Education"));
            for (const edu of education) {
                docSections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: edu.degree, bold: true }),
                            new TextRun({ text: ` - ${edu.school}` })
                        ],
                        spacing: { before: 100 }
                    })
                );
                if (edu.year) {
                    docSections.push(
                        new Paragraph({
                            children: [new TextRun({ text: edu.year, italics: true, size: 20 })]
                        })
                    );
                }
            }
        }

        // Create document
        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 720,    // 0.5 inch
                            right: 720,
                            bottom: 720,
                            left: 720
                        }
                    }
                },
                children: docSections
            }]
        });

        // Generate buffer
        const buffer = await Packer.toBuffer(doc);

        // Generate filename
        const filename = contact?.fullName 
            ? `${contact.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.docx`
            : `resume-${resumeId}.docx`;

        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "DOCX generation failed";
        console.error("DOCX Generation Error:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
