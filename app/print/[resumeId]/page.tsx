"use client";

import { useEffect, useState } from "react";
import { Resume } from "@/types/resume";
import { SingleColumnTemplate } from "@/components/templates/SingleColumn";
import { TwoColumnTemplate } from "@/components/templates/TwoColumn";
import { MinimalistTemplate } from "@/components/templates/Minimalist";
import { CreativeTemplate } from "@/components/templates/Creative";
import { ExecutiveTemplate } from "@/components/templates/Executive";
import { TechTemplate } from "@/components/templates/TechModern";
import { IvyLeagueTemplate } from "@/components/templates/IvyLeague";
import { StartupTemplate } from "@/components/templates/Startup";
import { FinanceTemplate } from "@/components/templates/Finance";
import { PortfolioTemplate } from "@/components/templates/Portfolio";
import { ModernProTemplate } from "@/components/templates/ModernPro";
import { ElegantTemplate } from "@/components/templates/Elegant";
import { BoldTemplate } from "@/components/templates/Bold";
import { CleanTemplate } from "@/components/templates/Clean";
import { CorporateTemplate } from "@/components/templates/Corporate";
import { GradientTemplate } from "@/components/templates/Gradient";
import { InfographicTemplate } from "@/components/templates/Infographic";
import { Modern2024Template } from "@/components/templates/Modern2024";
import { Creative2Template } from "@/components/templates/Creative2";
import { ProfessionalTemplate } from "@/components/templates/Professional";
import { SidebarTemplate } from "@/components/templates/Sidebar";
import { PhotoModernTemplate } from "@/components/templates/PhotoModern";
import { PhotoCreativeTemplate } from "@/components/templates/PhotoCreative";
import { PhotoProfessionalTemplate } from "@/components/templates/PhotoProfessional";

export default function PrintPage({ params }: { params: Promise<{ resumeId: string }> }) {
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const [resumeId, setResumeId] = useState<string>("");

    useEffect(() => {
        async function init() {
            const resolved = await params;
            setResumeId(resolved.resumeId);
        }
        init();
    }, [params]);

    useEffect(() => {
        if (!resumeId) return;
        
        async function fetchResume() {
            try {
                const res = await fetch(`/api/resumes/${resumeId}`);
                const json = await res.json();
                if (json.data) {
                    setResume(json.data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchResume();
    }, [resumeId]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!resume) return <div className="flex items-center justify-center min-h-screen">Resume not found</div>;

    return (
        <div className="print:block">
            {resume.templateId === "single-column" && <SingleColumnTemplate resume={resume} />}
            {resume.templateId === "two-column" && <TwoColumnTemplate resume={resume} />}
            {resume.templateId === "minimalist" && <MinimalistTemplate resume={resume} />}
            {resume.templateId === "creative" && <CreativeTemplate resume={resume} />}
            {resume.templateId === "exec-1" && <ExecutiveTemplate resume={resume} />}
            {resume.templateId === "tech-1" && <TechTemplate resume={resume} />}
            {resume.templateId === "acad-1" && <IvyLeagueTemplate resume={resume} />}
            {resume.templateId === "start-1" && <StartupTemplate resume={resume} />}
            {resume.templateId === "fin-1" && <FinanceTemplate resume={resume} />}
            {resume.templateId === "art-1" && <PortfolioTemplate resume={resume} />}
            {/* New Templates */}
            {resume.templateId === "modern-pro" && <ModernProTemplate resume={resume} />}
            {resume.templateId === "elegant" && <ElegantTemplate resume={resume} />}
            {resume.templateId === "bold" && <BoldTemplate resume={resume} />}
            {resume.templateId === "clean" && <CleanTemplate resume={resume} />}
            {resume.templateId === "corporate" && <CorporateTemplate resume={resume} />}
            {resume.templateId === "gradient" && <GradientTemplate resume={resume} />}
            {resume.templateId === "infographic" && <InfographicTemplate resume={resume} />}
            {resume.templateId === "modern-2024" && <Modern2024Template resume={resume} />}
            {resume.templateId === "creative-2" && <Creative2Template resume={resume} />}
            {resume.templateId === "professional" && <ProfessionalTemplate resume={resume} />}
            {resume.templateId === "sidebar" && <SidebarTemplate resume={resume} />}
            {/* Photo Templates */}
            {resume.templateId === "photo-modern" && <PhotoModernTemplate resume={resume} />}
            {resume.templateId === "photo-creative" && <PhotoCreativeTemplate resume={resume} />}
            {resume.templateId === "photo-professional" && <PhotoProfessionalTemplate resume={resume} />}
        </div>
    );
}
