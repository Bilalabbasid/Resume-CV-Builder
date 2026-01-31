"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Resume, ResumeSection, SectionType, ATSScore, ContactInfo, SectionContent, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";
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
import { ATSClassicTemplate } from "@/components/templates/ATSClassic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, Download, ArrowLeft, Plus, Trash, Undo2, Redo2, Eye, EyeOff, Palette, Keyboard, Sparkles, Target, FileText, User, Mail, Phone, MapPin, Linkedin, Github, Globe, Zap, TrendingUp, AlertCircle, CheckCircle2, Camera, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useKeyboardShortcuts, KeyboardShortcutsHelp } from "@/hooks/useKeyboardShortcuts";

export default function EditorLayout({ resumeId }: { resumeId: string }) {
    const router = useRouter();
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [history, setHistory] = useState<Resume[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [showPreview, setShowPreview] = useState(true);
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showATSPanel, setShowATSPanel] = useState(false);
    const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
    const [scoringATS, setScoringATS] = useState(false);
    const [showCoverLetter, setShowCoverLetter] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
    const [jobDescription, setJobDescription] = useState("");
    const [draggedSection, setDraggedSection] = useState<string | null>(null);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [applyingEnhancement, setApplyingEnhancement] = useState<string | null>(null);
    const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

    // Load Resume
    useEffect(() => {
        async function fetchResume() {
            try {
                const res = await fetch(`/api/resumes/${resumeId}`);
                const json = await res.json();
                
                if (json.error) {
                    toast.error(json.error);
                    setLoading(false);
                    return;
                }
                
                if (json.data) {
                    // API now returns properly mapped Resume object
                    const resumeData: Resume = {
                        ...json.data,
                        createdAt: new Date(json.data.createdAt),
                        updatedAt: new Date(json.data.updatedAt)
                    };
                    
                    setResume(resumeData);
                    setHistory([resumeData]);
                    setHistoryIndex(0);
                    // Set first section as active if exists
                    if (resumeData.sections.length > 0) setActiveTab(resumeData.sections[0].id);
                }
            } catch (e) {
                console.error(e);
                toast.error("Failed to load resume");
            } finally {
                setLoading(false);
            }
        }
        fetchResume();
    }, [resumeId]);

    // Auto-save with debouncing
    useEffect(() => {
        if (!resume || historyIndex === -1) return;

        if (autoSaveTimeout.current) {
            clearTimeout(autoSaveTimeout.current);
        }

        autoSaveTimeout.current = setTimeout(() => {
            handleSave(true); // true = silent save
        }, 2000); // 2 second debounce

        return () => {
            if (autoSaveTimeout.current) {
                clearTimeout(autoSaveTimeout.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resume]);

    const handleSave = async (silent = false) => {
        if (!resume) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/resumes/${resumeId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sections: resume.sections, templateId: resume.templateId })
            });
            
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to save");
            }
            
            if (!silent) {
                toast.success("Resume saved successfully!");
            }
        } catch (e) {
            console.error("Save failed", e);
            const errorMsg = e instanceof Error ? e.message : "Failed to save resume";
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleExport = () => {
        toast.promise(
            fetch(`/api/export/${resumeId}`).then(res => {
                if (!res.ok) throw new Error("Export failed");
                window.open(`/api/export/${resumeId}`, '_blank');
            }),
            {
                loading: 'Generating PDF...',
                success: 'PDF downloaded!',
                error: 'Failed to export PDF',
            }
        );
    };

    const handleExportDocx = () => {
        toast.promise(
            fetch(`/api/export-docx/${resumeId}`).then(async (res) => {
                if (!res.ok) throw new Error("Export failed");
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `resume-${resumeId}.docx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }),
            {
                loading: 'Generating DOCX...',
                success: 'DOCX downloaded!',
                error: 'Failed to export DOCX',
            }
        );
    };

    const updateResume = useCallback((newResume: Resume) => {
        setResume(newResume);
        // Add to history for undo/redo
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newResume);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const updateSectionContent = (id: string, content: SectionContent) => {
        if (!resume) return;
        const newSections = resume.sections.map(s => s.id === id ? { ...s, content } : s);
        
        // If updating contact info, also update the resume title if it's "Untitled Resume"
        const section = resume.sections.find(s => s.id === id);
        if (section?.type === "contact") {
            const contactInfo = content as ContactInfo;
            if (contactInfo.fullName && (resume.title === "Untitled Resume" || resume.title === "")) {
                updateResume({ ...resume, sections: newSections, title: `${contactInfo.fullName}'s Resume` });
                return;
            }
        }
        
        updateResume({ ...resume, sections: newSections });
    };

    const handleRemoveSection = (id: string) => {
        if (!resume) return;
        toast.promise(
            new Promise((resolve) => {
                const newSections = resume.sections.filter(s => s.id !== id);
                updateResume({ ...resume, sections: newSections });
                if (activeTab === id) setActiveTab(resume.sections[0]?.id || null);
                resolve(true);
            }),
            {
                loading: 'Removing section...',
                success: 'Section removed',
                error: 'Failed to remove section',
            }
        );
    };

    const handleAddSection = (type: SectionType = "summary") => {
        if (!resume) return;
        
        // Initialize content based on type
        let initialContent: SectionContent = "";
        if (type === "contact") {
            initialContent = { fullName: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" } as ContactInfo;
        } else if (type === "skills") {
            initialContent = [];
        } else if (type === "experience") {
            initialContent = [{ role: "Job Title", company: "Company Name", date: "2024", bullets: ["Achievement 1", "Achievement 2"] }] as ExperienceEntry[];
        } else if (type === "projects") {
            initialContent = [{ name: "Project Name", description: "Project description", bullets: ["Key feature 1", "Key feature 2"] }] as ProjectEntry[];
        } else if (type === "education") {
            initialContent = [{ school: "University Name", degree: "Degree", year: "2024" }] as EducationEntry[];
        } else if (type === "certifications") {
            initialContent = [{ name: "Certification Name", issuer: "Issuing Organization", date: "2024" }];
        }
        
        const newSection: ResumeSection = {
            id: `section-${Date.now()}`,
            type,
            content: initialContent,
            order: type === "contact" ? 0 : resume.sections.length  // Contact always first
        };
        
        // If adding contact, insert at beginning
        const newSections = type === "contact" 
            ? [newSection, ...resume.sections.map(s => ({ ...s, order: s.order + 1 }))]
            : [...resume.sections, newSection];
            
        updateResume({ ...resume, sections: newSections });
        setActiveTab(newSection.id);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} section added`);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setResume(history[historyIndex - 1]);
            toast.success("Undone");
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setResume(history[historyIndex + 1]);
            toast.success("Redone");
        }
    };

    const changeTemplate = (templateId: string) => {
        if (!resume) return;
        updateResume({ ...resume, templateId });
        setShowTemplateSelector(false);
        toast.success("Template changed!");
    };

    // ATS Score calculation
    const calculateATSScore = async () => {
        if (!resume || resume.sections.length === 0) {
            toast.error("Add some content first");
            return;
        }
        
        setScoringATS(true);
        setShowATSPanel(true);
        
        try {
            const res = await fetch('/api/ats-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resume, jobDescription: jobDescription || undefined })
            });
            const data = await res.json();
            
            if (data.data) {
                setAtsScore(data.data);
                toast.success(`ATS Score: ${data.data.overall}/100`);
            } else {
                throw new Error(data.error || "Scoring failed");
            }
        } catch (error) {
            console.error("ATS scoring failed", error);
            toast.error("Failed to calculate ATS score");
        } finally {
            setScoringATS(false);
        }
    };

    // One-click enhancement for entire resume
    const applyQuickEnhancement = async (action: "senior" | "ats" | "shorten" | "stronger" | "startup" | "corporate") => {
        if (!resume) return;
        
        setApplyingEnhancement(action);
        setShowQuickActions(false);
        
        const actionPrompts: Record<string, string> = {
            senior: "Rewrite to sound more senior and leadership-focused. Add strategic language and impact metrics.",
            ats: "Optimize all content for ATS. Add industry keywords and ensure clean formatting.",
            shorten: "Condense all content to be more concise while keeping impact. Aim for 1 page.",
            stronger: "Make all bullet points stronger with action verbs, metrics, and quantifiable achievements.",
            startup: "Rewrite with startup/tech energy. Use modern language, emphasize innovation and agility.",
            corporate: "Rewrite with professional corporate tone. Use formal language suitable for Fortune 500."
        };
        
        const prompt = actionPrompts[action];
        const toastId = toast.loading(`Applying "${action}" enhancement...`);
        
        try {
            // Enhance summary if exists
            const summarySection = resume.sections.find(s => s.type === "summary");
            if (summarySection && typeof summarySection.content === "string") {
                const summaryRes = await fetch('/api/enhance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: summarySection.content,
                        type: "summary",
                        action: "improve",
                        context: prompt
                    })
                });
                const summaryData = await summaryRes.json();
                if (summaryData.data) {
                    updateSectionContent(summarySection.id, summaryData.data);
                }
            }
            
            // Enhance experience bullets
            const expSection = resume.sections.find(s => s.type === "experience");
            if (expSection && Array.isArray(expSection.content)) {
                const experiences = expSection.content as ExperienceEntry[];
                const enhancedExp = await Promise.all(experiences.map(async (exp) => {
                    if (exp.bullets && exp.bullets.length > 0) {
                        const enhancedBullets = await Promise.all(exp.bullets.map(async (bullet) => {
                            if (!bullet.trim()) return bullet;
                            const res = await fetch('/api/enhance', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    text: bullet,
                                    type: "bullet",
                                    action: "improve",
                                    context: prompt
                                })
                            });
                            const data = await res.json();
                            return data.data || bullet;
                        }));
                        return { ...exp, bullets: enhancedBullets };
                    }
                    return exp;
                }));
                updateSectionContent(expSection.id, enhancedExp);
            }
            
            toast.success(`"${action}" enhancement applied!`, { id: toastId });
        } catch (error) {
            console.error("Enhancement failed", error);
            toast.error("Enhancement failed", { id: toastId });
        } finally {
            setApplyingEnhancement(null);
        }
    };

    // Cover letter generation
    const generateCoverLetter = async () => {
        if (!resume || resume.sections.length === 0) {
            toast.error("Add resume content first");
            return;
        }
        
        if (!jobDescription || jobDescription.length < 50) {
            toast.error("Please add a job description (at least 50 characters)");
            setShowCoverLetter(true);
            return;
        }
        
        setGeneratingCoverLetter(true);
        setShowCoverLetter(true);
        
        try {
            const contactSection = resume.sections.find(s => s.type === "contact");
            const contactInfo = contactSection?.content as ContactInfo | undefined;
            
            const res = await fetch('/api/cover-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    resumeSections: resume.sections,
                    jobDescription,
                    contactInfo
                })
            });
            const data = await res.json();
            
            if (data.data) {
                setCoverLetter(data.data);
                toast.success("Cover letter generated!");
            } else {
                throw new Error(data.error || "Generation failed");
            }
        } catch (error) {
            console.error("Cover letter generation failed", error);
            toast.error("Failed to generate cover letter");
        } finally {
            setGeneratingCoverLetter(false);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, sectionId: string) => {
        setDraggedSection(sectionId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!resume || !draggedSection || draggedSection === targetId) {
            setDraggedSection(null);
            return;
        }

        const sections = [...resume.sections];
        const draggedIndex = sections.findIndex(s => s.id === draggedSection);
        const targetIndex = sections.findIndex(s => s.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) {
            setDraggedSection(null);
            return;
        }

        // Reorder sections
        const [draggedItem] = sections.splice(draggedIndex, 1);
        sections.splice(targetIndex, 0, draggedItem);

        // Update order values
        const reorderedSections = sections.map((s, i) => ({ ...s, order: i }));
        
        updateResume({ ...resume, sections: reorderedSections });
        setDraggedSection(null);
        toast.success("Section reordered");
    };

    const handleDragEnd = () => {
        setDraggedSection(null);
    };

    // Keyboard shortcuts - defined after handlers
    const shortcuts = [
        { key: 's', ctrlKey: true, handler: () => handleSave(false), description: 'Save' },
        { key: 'z', ctrlKey: true, handler: handleUndo, description: 'Undo' },
        { key: 'z', ctrlKey: true, shiftKey: true, handler: handleRedo, description: 'Redo' },
        { key: 'p', ctrlKey: true, handler: handleExport, description: 'Export PDF' },
        { key: 'e', ctrlKey: true, handler: () => setShowPreview(!showPreview), description: 'Toggle Preview' },
        { key: '/', ctrlKey: true, handler: () => setShowShortcuts(!showShortcuts), description: 'Show Shortcuts' },
    ];

    useKeyboardShortcuts(shortcuts);

    if (loading) return <div className="flex h-screen items-center justify-center bg-neutral-950 text-white"><Loader2 className="animate-spin w-8 h-8" /></div>;
    if (!resume) return <div className="text-white p-10">Resume not found</div>;

    const templates = [
        // ATS-Friendly
        { id: "ats-classic", name: "ATS Classic", color: "bg-slate-700", category: "ATS" },
        { id: "single-column", name: "Classic", color: "bg-blue-500", category: "ATS" },
        { id: "professional", name: "Professional", color: "bg-gray-700", category: "ATS" },
        { id: "clean", name: "Clean", color: "bg-slate-500", category: "ATS" },
        // Modern
        { id: "two-column", name: "Modern Sidebar", color: "bg-purple-600", category: "Modern" },
        { id: "modern-pro", name: "Teal Modern", color: "bg-teal-500", category: "Modern" },
        { id: "modern-2024", name: "2024 Style", color: "bg-zinc-800", category: "Modern" },
        { id: "gradient", name: "Gradient", color: "bg-gradient-to-r from-violet-500 to-pink-500", category: "Modern" },
        // Creative
        { id: "creative", name: "Bold Creative", color: "bg-indigo-600", category: "Creative" },
        { id: "creative-2", name: "Warm Creative", color: "bg-amber-500", category: "Creative" },
        { id: "bold", name: "Dark Bold", color: "bg-gray-900", category: "Creative" },
        { id: "infographic", name: "Infographic", color: "bg-emerald-600", category: "Creative" },
        // Professional
        { id: "corporate", name: "Corporate", color: "bg-slate-800", category: "Professional" },
        { id: "elegant", name: "Elegant", color: "bg-gray-600", category: "Professional" },
        { id: "sidebar", name: "Blue Sidebar", color: "bg-blue-700", category: "Professional" },
        { id: "exec-1", name: "Executive", color: "bg-indigo-700", category: "Professional" },
        // Simple
        { id: "minimalist", name: "Minimalist", color: "bg-gray-400", category: "Simple" },
        // Industry
        { id: "tech-1", name: "Tech Modern", color: "bg-cyan-600", category: "Tech" },
        { id: "art-1", name: "Portfolio", color: "bg-rose-500", category: "Creative" },
        { id: "acad-1", name: "Academic", color: "bg-green-600", category: "Professional" },
        { id: "start-1", name: "Startup", color: "bg-orange-500", category: "Creative" },
        { id: "fin-1", name: "Finance", color: "bg-emerald-700", category: "Professional" },
    ];

    return (
        <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">

            {/* LEFT PANEL: Editor */}
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col border-r border-neutral-800 transition-all duration-300`}>
                {/* Toolbar */}
                <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                        <div className="text-xs text-neutral-500 flex items-center gap-2">
                            {saving ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span className="text-green-500">✓ Saved</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleUndo} 
                            disabled={historyIndex <= 0}
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo2 className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleRedo} 
                            disabled={historyIndex >= history.length - 1}
                            title="Redo (Ctrl+Shift+Z)"
                        >
                            <Redo2 className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                            title="Change Template"
                        >
                            <Palette className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowPreview(!showPreview)}
                            title={showPreview ? "Hide Preview (Ctrl+E)" : "Show Preview (Ctrl+E)"}
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowShortcuts(!showShortcuts)}
                            title="Keyboard Shortcuts (Ctrl+/)"
                        >
                            <Keyboard className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={calculateATSScore}
                            disabled={scoringATS}
                            title="Check ATS Score"
                            className={atsScore ? (atsScore.overall >= 80 ? "text-green-400" : atsScore.overall >= 60 ? "text-yellow-400" : "text-red-400") : ""}
                        >
                            {scoringATS ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                            {atsScore && <span className="ml-1 text-xs">{atsScore.overall}</span>}
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowCoverLetter(!showCoverLetter)}
                            title="Generate Cover Letter"
                        >
                            <FileText className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowQuickActions(!showQuickActions)}
                            disabled={!!applyingEnhancement}
                            title="Quick AI Enhancements"
                            className="text-purple-400"
                        >
                            {applyingEnhancement ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Zap className="w-4 h-4" />
                            )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSave(false)}>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </Button>
                        <div className="flex">
                            <Button variant="premium" size="sm" onClick={handleExport} className="rounded-r-none">
                                <Download className="w-4 h-4 mr-2" /> PDF
                            </Button>
                            <Button 
                                variant="premium" 
                                size="sm" 
                                onClick={handleExportDocx}
                                className="rounded-l-none border-l border-purple-700 px-2"
                                title="Export as DOCX"
                            >
                                DOCX
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Template Selector Dropdown */}
                {showTemplateSelector && (
                    <div className="absolute top-16 right-6 z-50 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl p-4 w-80 animate-fade-in-up">
                        <h3 className="font-semibold mb-3 text-sm">Choose Template</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {templates.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => changeTemplate(template.id)}
                                    className={`p-3 rounded-lg border-2 text-sm transition-all ${
                                        resume.templateId === template.id 
                                            ? 'border-purple-500 bg-purple-500/10' 
                                            : 'border-neutral-800 hover:border-neutral-700'
                                    }`}
                                >
                                    <div className={`h-2 w-full ${template.color} rounded mb-2`} />
                                    {template.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Keyboard Shortcuts */}
                {showShortcuts && (
                    <div className="absolute top-16 right-6 z-50 animate-fade-in-up">
                        <KeyboardShortcutsHelp shortcuts={shortcuts} />
                    </div>
                )}

                {/* Quick Actions Menu */}
                {showQuickActions && (
                    <div className="absolute top-16 right-6 z-50 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl p-3 w-64 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-400" />
                                Quick AI Enhancements
                            </h3>
                            <button onClick={() => setShowQuickActions(false)} className="text-neutral-500 hover:text-white">×</button>
                        </div>
                        <p className="text-xs text-neutral-500 mb-3">One-click to transform your entire resume</p>
                        <div className="space-y-1">
                            <button
                                onClick={() => applyQuickEnhancement("senior")}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm flex items-center gap-2 transition-colors"
                            >
                                <TrendingUp className="w-4 h-4 text-blue-400" />
                                Make it more senior
                            </button>
                            <button
                                onClick={() => applyQuickEnhancement("ats")}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm flex items-center gap-2 transition-colors"
                            >
                                <Target className="w-4 h-4 text-green-400" />
                                Optimize for ATS
                            </button>
                            <button
                                onClick={() => applyQuickEnhancement("shorten")}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm flex items-center gap-2 transition-colors"
                            >
                                <FileText className="w-4 h-4 text-yellow-400" />
                                Shorten to 1 page
                            </button>
                            <button
                                onClick={() => applyQuickEnhancement("stronger")}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm flex items-center gap-2 transition-colors"
                            >
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                Rewrite bullets stronger
                            </button>
                            <div className="border-t border-neutral-800 my-2"></div>
                            <button
                                onClick={() => applyQuickEnhancement("startup")}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm flex items-center gap-2 transition-colors"
                            >
                                <Zap className="w-4 h-4 text-orange-400" />
                                Startup tone
                            </button>
                            <button
                                onClick={() => applyQuickEnhancement("corporate")}
                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-800 text-sm flex items-center gap-2 transition-colors"
                            >
                                <User className="w-4 h-4 text-gray-400" />
                                Corporate tone
                            </button>
                        </div>
                    </div>
                )}

                {/* ATS Score Panel */}
                {showATSPanel && (
                    <div className="absolute top-16 right-6 z-50 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl p-4 w-96 animate-fade-in-up max-h-[70vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Target className="w-4 h-4 text-purple-400" />
                                ATS Score Analysis
                            </h3>
                            <button onClick={() => setShowATSPanel(false)} className="text-neutral-500 hover:text-white">×</button>
                        </div>
                        
                        {/* Job Description Input */}
                        <div className="mb-4">
                            <label className="text-xs text-neutral-500 mb-1 block">Target Job Description (optional)</label>
                            <textarea
                                className="w-full h-20 bg-neutral-800 border border-neutral-700 rounded-md p-2 text-xs resize-none"
                                placeholder="Paste job description for tailored scoring..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full mt-2"
                                onClick={calculateATSScore}
                                disabled={scoringATS}
                            >
                                {scoringATS ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Zap className="w-3 h-3 mr-2" />}
                                {atsScore ? "Recalculate Score" : "Calculate Score"}
                            </Button>
                        </div>
                        
                        {scoringATS && (
                            <div className="text-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400" />
                                <p className="text-sm text-neutral-400 mt-2">Analyzing your resume...</p>
                            </div>
                        )}
                        
                        {atsScore && !scoringATS && (
                            <div className="space-y-4">
                                {/* Overall Score */}
                                <div className="text-center p-4 bg-neutral-800 rounded-lg">
                                    <div className={`text-4xl font-bold ${atsScore.overall >= 80 ? 'text-green-400' : atsScore.overall >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {atsScore.overall}
                                    </div>
                                    <div className="text-xs text-neutral-500 mt-1">Overall ATS Score</div>
                                </div>
                                
                                {/* Score Breakdown */}
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="p-2 bg-neutral-800 rounded">
                                        <div className="text-lg font-semibold text-blue-400">{atsScore.keywordMatch}</div>
                                        <div className="text-xs text-neutral-500">Keywords</div>
                                    </div>
                                    <div className="p-2 bg-neutral-800 rounded">
                                        <div className="text-lg font-semibold text-purple-400">{atsScore.formatting}</div>
                                        <div className="text-xs text-neutral-500">Format</div>
                                    </div>
                                    <div className="p-2 bg-neutral-800 rounded">
                                        <div className="text-lg font-semibold text-cyan-400">{atsScore.sectionCompleteness}</div>
                                        <div className="text-xs text-neutral-500">Complete</div>
                                    </div>
                                </div>
                                
                                {/* Missing Keywords */}
                                {atsScore.missingKeywords.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-neutral-400 mb-2 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3 text-yellow-400" />
                                            Missing Keywords
                                        </h4>
                                        <div className="flex flex-wrap gap-1">
                                            {atsScore.missingKeywords.map((kw, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Suggestions */}
                                {atsScore.suggestions.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-neutral-400 mb-2 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3 text-green-400" />
                                            Suggestions
                                        </h4>
                                        <ul className="space-y-1">
                                            {atsScore.suggestions.map((s, i) => (
                                                <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                                                    <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {/* Red Flags */}
                                {atsScore.redFlags.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-neutral-400 mb-2 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3 text-red-400" />
                                            Red Flags
                                        </h4>
                                        <ul className="space-y-1">
                                            {atsScore.redFlags.map((f, i) => (
                                                <li key={i} className="text-xs text-red-300">{f}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Cover Letter Modal */}
                {showCoverLetter && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl p-4 w-[600px] max-w-[90vw] animate-fade-in-up max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                Cover Letter Generator
                            </h3>
                            <button onClick={() => setShowCoverLetter(false)} className="text-neutral-500 hover:text-white">×</button>
                        </div>
                        
                        <div className="mb-4">
                            <label className="text-xs text-neutral-500 mb-1 block">Job Description (required)</label>
                            <textarea
                                className="w-full h-28 bg-neutral-800 border border-neutral-700 rounded-md p-2 text-sm resize-none"
                                placeholder="Paste the job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                            <Button 
                                variant="premium" 
                                size="sm" 
                                className="w-full mt-2"
                                onClick={generateCoverLetter}
                                disabled={generatingCoverLetter || jobDescription.length < 50}
                            >
                                {generatingCoverLetter ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
                                Generate Cover Letter
                            </Button>
                        </div>
                        
                        {generatingCoverLetter && (
                            <div className="text-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-400" />
                                <p className="text-sm text-neutral-400 mt-2">Writing your cover letter...</p>
                            </div>
                        )}
                        
                        {coverLetter && !generatingCoverLetter && (
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">Generated Cover Letter</label>
                                <textarea
                                    className="w-full h-64 bg-neutral-800 border border-neutral-700 rounded-md p-3 text-sm resize-none"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                />
                                <div className="flex gap-2 mt-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText(coverLetter);
                                            toast.success("Cover letter copied to clipboard!");
                                        }}
                                    >
                                        Copy to Clipboard
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={generateCoverLetter}
                                    >
                                        <Sparkles className="w-3 h-3 mr-1" /> Regenerate
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Sections List & Form */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Tabs / Navigation */}
                    <div className="w-64 bg-neutral-900 border-r border-neutral-800 p-4 space-y-2 overflow-y-auto">
                        {/* Resume Title Editor */}
                        <div className="mb-4 pb-4 border-b border-neutral-800">
                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-2">Resume Title</label>
                            <Input 
                                value={resume.title}
                                onChange={(e) => updateResume({ ...resume, title: e.target.value })}
                                placeholder="My Resume"
                                className="bg-neutral-800 border-neutral-700 text-sm"
                            />
                        </div>
                        
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Sections</h3>
                        <p className="text-xs text-neutral-600 mb-4">Drag to reorder</p>
                        {resume.sections.map(section => (
                            <div
                                key={section.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, section.id)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, section.id)}
                                onDragEnd={handleDragEnd}
                                onClick={() => setActiveTab(section.id)}
                                className={`px-3 py-2 rounded-md text-sm cursor-grab active:cursor-grabbing flex justify-between items-center group transition-all ${
                                    draggedSection === section.id ? 'opacity-50 border-2 border-dashed border-purple-500' : ''
                                } ${activeTab === section.id ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="text-neutral-600 group-hover:text-neutral-400">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                                        </svg>
                                    </div>
                                    <span className="capitalize">{section.type}</span>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleRemoveSection(section.id); }} 
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                                    title="Remove section"
                                >
                                    <Trash className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        
                        {/* Add Section Panel */}
                        <div className="mt-6 pt-4 border-t border-neutral-800">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Add Section</p>
                                <Plus className="w-4 h-4 text-purple-400" />
                            </div>
                            
                            {/* Manual Sections */}
                            <div className="space-y-2 mb-4">
                                <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1.5">✏️ Add Manually</p>
                                {!resume.sections.find(s => s.type === "contact") && (
                                    <button
                                        className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/30 hover:border-blue-400/50 px-3 py-2.5 text-left transition-all"
                                        onClick={() => handleAddSection("contact")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm font-medium text-neutral-200">Contact Info</span>
                                        </div>
                                        <p className="text-[10px] text-neutral-500 mt-0.5 ml-6">Name, email, phone, links</p>
                                    </button>
                                )}
                                <button
                                    className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border border-purple-500/30 hover:border-purple-400/50 px-3 py-2.5 text-left transition-all"
                                    onClick={() => handleAddSection("experience")}
                                >
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-purple-400" />
                                        <span className="text-sm font-medium text-neutral-200">Experience</span>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 mt-0.5 ml-6">Job roles and achievements</p>
                                </button>
                                <button
                                    className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 hover:from-cyan-500/20 hover:to-cyan-600/20 border border-cyan-500/30 hover:border-cyan-400/50 px-3 py-2.5 text-left transition-all"
                                    onClick={() => handleAddSection("education")}
                                >
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-cyan-400" />
                                        <span className="text-sm font-medium text-neutral-200">Education</span>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 mt-0.5 ml-6">Degrees and universities</p>
                                </button>
                            </div>

                            {/* AI-Powered Sections */}
                            <div className="space-y-2 mb-4 p-3 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-lg border border-violet-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                                    <p className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">✨ AI-Powered</p>
                                </div>
                                <button
                                    className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-violet-500/10 to-violet-600/10 hover:from-violet-500/20 hover:to-violet-600/20 border border-violet-500/30 hover:border-violet-400/50 px-3 py-2.5 text-left transition-all"
                                    onClick={() => handleAddSection("summary")}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-violet-400" />
                                            <span className="text-sm font-medium text-neutral-200">Summary</span>
                                        </div>
                                        <Sparkles className="w-3 h-3 text-violet-400 opacity-50" />
                                    </div>
                                    <p className="text-[10px] text-neutral-500 mt-0.5 ml-6">Write or generate with AI</p>
                                </button>
                                <button
                                    className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-500/20 hover:to-amber-600/20 border border-amber-500/30 hover:border-amber-400/50 px-3 py-2.5 text-left transition-all"
                                    onClick={() => handleAddSection("skills")}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-400" />
                                            <span className="text-sm font-medium text-neutral-200">Skills</span>
                                        </div>
                                        <Sparkles className="w-3 h-3 text-amber-400 opacity-50" />
                                    </div>
                                    <p className="text-[10px] text-neutral-500 mt-0.5 ml-6">Add or generate from experience</p>
                                </button>
                                <button
                                    className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 hover:from-emerald-500/20 hover:to-emerald-600/20 border border-emerald-500/30 hover:border-emerald-400/50 px-3 py-2.5 text-left transition-all"
                                    onClick={() => handleAddSection("projects")}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm font-medium text-neutral-200">Projects</span>
                                        </div>
                                        <Sparkles className="w-3 h-3 text-emerald-400 opacity-50" />
                                    </div>
                                    <p className="text-[10px] text-neutral-500 mt-0.5 ml-6">Add or generate relevant projects</p>
                                </button>
                            </div>

                            {/* Optional Sections */}
                            <div className="space-y-1">
                                <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1.5">📄 Optional</p>
                                <button
                                    className="w-full rounded-lg bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 hover:border-emerald-500/30 px-3 py-2 text-left transition-all"
                                    onClick={() => handleAddSection("certifications")}
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm text-neutral-300">Certifications</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form Area */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {activeTab ? (
                            <SectionEditor
                                section={resume.sections.find(s => s.id === activeTab)!}
                                onUpdate={(c) => updateSectionContent(activeTab, c)}
                            />
                        ) : (
                            <div className="text-neutral-500 text-center mt-20">Select a section to edit</div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Preview */}
            {showPreview && (
                <div className="w-1/2 bg-neutral-900 overflow-y-auto p-12 flex justify-center">
                    <div className="w-full max-w-[210mm] transition-all duration-300 origin-top scale-[0.8] sm:scale-100">
                        {resume.templateId === "ats-classic" && <ATSClassicTemplate resume={resume} />}
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
                </div>
            )}
        </div>
    );
}

// Sub-component for editing specific section types
function SectionEditor({ section, onUpdate }: { section: ResumeSection, onUpdate: (c: SectionContent) => void }) {
    const [enhancing, setEnhancing] = useState(false);

    const handleEnhance = async (text: string, sectionType: string, action?: string) => {
        if (!text || text.trim().length < 5) {
            toast.error("Please write some content first");
            return;
        }

        setEnhancing(true);
        try {
            const res = await fetch('/api/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, sectionType, action })
            });
            const data = await res.json();
            
            if (data.enhancedText) {
                return data.enhancedText;
            }
            throw new Error("No enhanced text received");
        } catch (error) {
            console.error("Enhancement failed", error);
            toast.error("AI enhancement failed");
            return text;
        } finally {
            setEnhancing(false);
        }
    };

    // Photo upload handler
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, contact: ContactInfo) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be under 2MB");
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            onUpdate({ ...contact, photo: base64 });
            toast.success("Photo uploaded!");
        };
        reader.readAsDataURL(file);
    };

    // Contact Info Editor
    if (section.type === "contact") {
        const contact = section.content as ContactInfo;
        return (
            <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Edit Contact Information
                </h3>
                <p className="text-xs text-neutral-500">This information appears in your resume header</p>
                
                {/* Photo Upload Section */}
                <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-neutral-700 flex-shrink-0 border-2 border-neutral-600">
                            {contact.photo ? (
                                <>
                                    <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => onUpdate({ ...contact, photo: undefined })}
                                        className="absolute top-0 right-0 bg-red-500 rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-neutral-500" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-neutral-300 mb-1">Profile Photo</p>
                            <p className="text-xs text-neutral-500 mb-2">For Photo templates. Max 2MB, JPG/PNG</p>
                            <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg cursor-pointer transition-colors text-sm">
                                <Camera className="w-4 h-4" />
                                {contact.photo ? "Change Photo" : "Upload Photo"}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => handlePhotoUpload(e, contact)}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input 
                            placeholder="Full Name *" 
                            value={contact.fullName || ""}
                            onChange={(e) => onUpdate({ ...contact, fullName: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input 
                            type="email"
                            placeholder="Email *" 
                            value={contact.email || ""}
                            onChange={(e) => onUpdate({ ...contact, email: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input 
                            placeholder="Phone" 
                            value={contact.phone || ""}
                            onChange={(e) => onUpdate({ ...contact, phone: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                    <div className="relative col-span-2">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input 
                            placeholder="Location (City, State)" 
                            value={contact.location || ""}
                            onChange={(e) => onUpdate({ ...contact, location: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input 
                            placeholder="LinkedIn URL" 
                            value={contact.linkedin || ""}
                            onChange={(e) => onUpdate({ ...contact, linkedin: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                    <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input 
                            placeholder="GitHub URL" 
                            value={contact.github || ""}
                            onChange={(e) => onUpdate({ ...contact, github: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                    <div className="relative col-span-2">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input 
                            placeholder="Portfolio/Website URL" 
                            value={contact.portfolio || ""}
                            onChange={(e) => onUpdate({ ...contact, portfolio: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (section.type === "summary") {
        const summaryContent = section.content as string;
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-violet-400" />
                        Edit Summary
                    </h3>
                </div>

                {/* AI Generation Prompt */}
                {!summaryContent && (
                    <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                            <Sparkles className="w-5 h-5 text-violet-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-violet-300 mb-1">How would you like to create your summary?</h4>
                                <p className="text-xs text-neutral-400">Choose the option that works best for you</p>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <button
                                onClick={async () => {
                                    const enhanced = await handleEnhance("Generate a professional summary", "summary");
                                    if (enhanced) onUpdate(enhanced);
                                }}
                                disabled={enhancing}
                                className="w-full text-left px-4 py-3 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 rounded-lg transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-violet-400" />
                                        <span className="text-sm font-medium text-neutral-200">Generate with AI</span>
                                    </div>
                                    {enhancing ? <Loader2 className="w-4 h-4 animate-spin text-violet-400" /> : <span className="text-xs text-violet-400 group-hover:translate-x-1 transition-transform">→</span>}
                                </div>
                                <p className="text-xs text-neutral-500 mt-1 ml-6">AI will create a professional summary for you</p>
                            </button>
                            <button
                                onClick={() => onUpdate("I am a ")}
                                className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-neutral-400" />
                                        <span className="text-sm font-medium text-neutral-200">Write Myself</span>
                                    </div>
                                    <span className="text-xs text-neutral-400 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                                <p className="text-xs text-neutral-500 mt-1 ml-6">Start from scratch with manual input</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* Summary Editor */}
                {summaryContent && (
                    <>
                        <div className="flex gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={async () => {
                                    const enhanced = await handleEnhance(summaryContent, "summary", "shorten");
                                    if (enhanced) onUpdate(enhanced);
                                }}
                                disabled={enhancing}
                                title="Make shorter"
                            >
                                Shorten
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={async () => {
                                    const enhanced = await handleEnhance(summaryContent, "summary", "ats");
                                    if (enhanced) onUpdate(enhanced);
                                }}
                                disabled={enhancing}
                                title="Optimize for ATS"
                            >
                                ATS
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={async () => {
                                    const enhanced = await handleEnhance(summaryContent, "summary");
                                    if (enhanced) onUpdate(enhanced);
                                }}
                                disabled={enhancing}
                            >
                                {enhancing ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Sparkles className="w-3 h-3 mr-2" />}
                                Enhance
                            </Button>
                        </div>
                        <textarea
                            className="w-full h-40 bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-purple-500 focus:outline-none"
                            value={summaryContent}
                            onChange={(e) => onUpdate(e.target.value)}
                            placeholder="Brief professional summary (e.g., Results-driven software engineer with 5+ years experience building scalable web applications...)"
                        />
                        <p className="text-xs text-neutral-500">
                            💡 Keep it to 2-3 sentences. Focus on your unique value and target role.
                        </p>
                    </>
                )}
            </div>
        )
    }

    if (section.type === "skills") {
        const skills = section.content as string[];
        const skillsText = Array.isArray(skills) ? skills.join(", ") : "";
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        Edit Skills
                    </h3>
                </div>

                {/* AI Generation Prompt */}
                {(!skills || skills.length === 0) && (
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                            <Sparkles className="w-5 h-5 text-amber-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-amber-300 mb-1">How would you like to add skills?</h4>
                                <p className="text-xs text-neutral-400">AI can extract skills from your experience</p>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <button
                                onClick={async () => {
                                    const enhanced = await handleEnhance("Generate relevant skills based on experience", "skills");
                                    if (enhanced) {
                                        onUpdate(enhanced.split(",").map((s: string) => s.trim()).filter(Boolean));
                                    }
                                }}
                                disabled={enhancing}
                                className="w-full text-left px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        <span className="text-sm font-medium text-neutral-200">Generate from Experience</span>
                                    </div>
                                    {enhancing ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform">→</span>}
                                </div>
                                <p className="text-xs text-neutral-500 mt-1 ml-6">AI will analyze your experience and suggest skills</p>
                            </button>
                            <button
                                onClick={() => onUpdate(["JavaScript", "React", "Node.js"])}
                                className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-neutral-400" />
                                        <span className="text-sm font-medium text-neutral-200">Add Manually</span>
                                    </div>
                                    <span className="text-xs text-neutral-400 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                                <p className="text-xs text-neutral-500 mt-1 ml-6">Type your skills separated by commas</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* Skills Editor */}
                {skills && skills.length > 0 && (
                    <>
                        <div className="flex gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={async () => {
                                    const enhanced = await handleEnhance(skillsText, "skills", "ats");
                                    if (enhanced) {
                                        onUpdate(enhanced.split(",").map((s: string) => s.trim()).filter(Boolean));
                                    }
                                }}
                                disabled={enhancing}
                                title="Optimize for ATS"
                            >
                                ATS
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={async () => {
                                    const enhanced = await handleEnhance(skillsText, "skills");
                                    if (enhanced) {
                                        onUpdate(enhanced.split(",").map((s: string) => s.trim()).filter(Boolean));
                                    }
                                }}
                                disabled={enhancing}
                            >
                                {enhancing ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Sparkles className="w-3 h-3 mr-2" />}
                                Expand
                            </Button>
                        </div>
                        <p className="text-xs text-neutral-500">Comma separated. Include technical skills, tools, and soft skills.</p>
                        <textarea
                            className="w-full h-24 bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            value={skillsText}
                            onChange={(e) => onUpdate(e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
                            placeholder="JavaScript, React, Node.js, Python, AWS, Docker, CI/CD, Agile, Team Leadership..."
                        />
                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {skills.filter(Boolean).map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">{skill}</span>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        )
    }

    if (section.type === "experience") {
        const experiences = section.content as ExperienceEntry[];
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Edit Experience</h3>
                    <p className="text-xs text-neutral-500">Use action verbs • Add metrics</p>
                </div>
                {experiences.map((job, idx) => (
                    <div key={idx} className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <Input placeholder="Role/Title" value={job.role || ""} onChange={(e) => {
                                const newExp = [...experiences];
                                newExp[idx] = { ...newExp[idx], role: e.target.value };
                                onUpdate(newExp);
                            }} className="bg-neutral-900 border-neutral-700" />
                            <Input placeholder="Company" value={job.company || ""} onChange={(e) => {
                                const newExp = [...experiences];
                                newExp[idx] = { ...newExp[idx], company: e.target.value };
                                onUpdate(newExp);
                            }} className="bg-neutral-900 border-neutral-700" />
                        </div>
                        <Input placeholder="Date (e.g. Jan 2020 - Present)" value={job.date || ""} onChange={(e) => {
                            const newExp = [...experiences];
                            newExp[idx] = { ...newExp[idx], date: e.target.value };
                            onUpdate(newExp);
                        }} className="bg-neutral-900 border-neutral-700 mb-2" />
                        <div className="relative">
                            <textarea
                                placeholder="Achievements (one per line)&#10;• Led development of microservices reducing latency by 40%&#10;• Mentored 3 junior engineers on best practices"
                                className="w-full h-28 bg-neutral-900 border border-neutral-700 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                value={Array.isArray(job.bullets) ? job.bullets.join("\n") : ""}
                                onChange={(e) => {
                                    const newExp = [...experiences];
                                    newExp[idx] = { ...newExp[idx], bullets: e.target.value.split("\n") };
                                    onUpdate(newExp);
                                }}
                            />
                            <div className="absolute top-1 right-1 flex gap-1">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 text-xs px-2"
                                    onClick={async () => {
                                        const bullets = job.bullets || [];
                                        const enhancedLines = await Promise.all(
                                            bullets.map(async (bullet: string) => {
                                                if (bullet.trim()) {
                                                    return await handleEnhance(bullet, "bullet", "metrics");
                                                }
                                                return bullet;
                                            })
                                        );
                                        const newExp = [...experiences];
                                        newExp[idx] = { ...newExp[idx], bullets: enhancedLines };
                                        onUpdate(newExp);
                                    }}
                                    disabled={enhancing}
                                    title="Add metrics"
                                >
                                    +#
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 text-xs px-2"
                                    onClick={async () => {
                                        const bullets = job.bullets || [];
                                        const enhancedLines = await Promise.all(
                                            bullets.map(async (bullet: string) => {
                                                if (bullet.trim()) {
                                                    return await handleEnhance(bullet, "bullet", "results");
                                                }
                                                return bullet;
                                            })
                                        );
                                        const newExp = [...experiences];
                                        newExp[idx] = { ...newExp[idx], bullets: enhancedLines };
                                        onUpdate(newExp);
                                    }}
                                    disabled={enhancing}
                                    title="Focus on results"
                                >
                                    Results
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 text-xs"
                                    onClick={async () => {
                                        const bullets = job.bullets || [];
                                        const enhancedLines = await Promise.all(
                                            bullets.map(async (bullet: string) => {
                                                if (bullet.trim()) {
                                                    return await handleEnhance(bullet, "experience");
                                                }
                                                return bullet;
                                            })
                                        );
                                        const newExp = [...experiences];
                                        newExp[idx] = { ...newExp[idx], bullets: enhancedLines };
                                        onUpdate(newExp);
                                    }}
                                    disabled={enhancing}
                                >
                                    {enhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                </Button>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-red-400 hover:text-red-300"
                            onClick={() => {
                                const newExp = experiences.filter((_, i) => i !== idx);
                                onUpdate(newExp);
                            }}
                        >
                            <Trash className="w-3 h-3 mr-1" /> Remove
                        </Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => onUpdate([...experiences, { role: "Job Title", company: "Company Name", date: "2024", bullets: ["Achievement 1", "Achievement 2"] }])}>
                    + Add Job
                </Button>
            </div>
        )
    }

    if (section.type === "projects") {
        const projects = section.content as ProjectEntry[];
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        Edit Projects
                    </h3>
                </div>

                {/* AI Generation Prompt */}
                {(!projects || projects.length === 0) && (
                    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3 mb-3">
                            <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-semibold text-emerald-300 mb-1">How would you like to add projects?</h4>
                                <p className="text-xs text-neutral-400">Showcase your best work or let AI suggest relevant projects</p>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <button
                                onClick={async () => {
                                    const enhanced = await handleEnhance("Generate relevant project ideas", "projects");
                                    if (enhanced) {
                                        // Try to parse AI response into project format
                                        onUpdate([{ name: "Project 1", description: enhanced, bullets: [] }]);
                                    }
                                }}
                                disabled={enhancing}
                                className="w-full text-left px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-lg transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm font-medium text-neutral-200">Generate Project Ideas</span>
                                    </div>
                                    {enhancing ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <span className="text-xs text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>}
                                </div>
                                <p className="text-xs text-neutral-500 mt-1 ml-6">AI will suggest relevant projects based on your field</p>
                            </button>
                            <button
                                onClick={() => onUpdate([{ name: "Project Name", description: "Project description", bullets: ["Key feature 1", "Key feature 2"] }])}
                                className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Plus className="w-4 h-4 text-neutral-400" />
                                        <span className="text-sm font-medium text-neutral-200">Add My Own Projects</span>
                                    </div>
                                    <span className="text-xs text-neutral-400 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                                <p className="text-xs text-neutral-500 mt-1 ml-6">Manually enter your project details</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* Projects Editor */}
                {projects && projects.length > 0 && projects.map((project, idx) => (
                    <div key={idx} className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                        <Input 
                            placeholder="Project Name" 
                            value={project.name || ""} 
                            onChange={(e) => {
                                const newProjects = [...projects];
                                newProjects[idx] = { ...newProjects[idx], name: e.target.value };
                                onUpdate(newProjects);
                            }} 
                            className="bg-neutral-900 border-neutral-700 mb-2" 
                        />
                        <div className="relative mb-2">
                            <textarea
                                placeholder="Project Description (include technologies used)&#10;e.g., Built a real-time analytics dashboard using React, TypeScript, and WebSocket"
                                className="w-full h-20 bg-neutral-900 border border-neutral-700 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                value={project.description || ""}
                                onChange={(e) => {
                                    const newProjects = [...projects];
                                    newProjects[idx] = { ...newProjects[idx], description: e.target.value };
                                    onUpdate(newProjects);
                                }}
                            />
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="absolute top-1 right-1 h-6 text-xs"
                                onClick={async () => {
                                    const enhanced = await handleEnhance(project.description || "", "projects");
                                    if (enhanced) {
                                        const newProjects = [...projects];
                                        newProjects[idx] = { ...newProjects[idx], description: enhanced };
                                        onUpdate(newProjects);
                                    }
                                }}
                                disabled={enhancing}
                            >
                                {enhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            </Button>
                        </div>
                        <textarea
                            placeholder="Key Features/Achievements (one per line)"
                            className="w-full h-20 bg-neutral-900 border border-neutral-700 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                            value={project.bullets?.join("\n") || ""}
                            onChange={(e) => {
                                const newProjects = [...projects];
                                newProjects[idx] = { ...newProjects[idx], bullets: e.target.value.split("\n").filter(b => b.trim()) };
                                onUpdate(newProjects);
                            }}
                        />
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-red-400 hover:text-red-300"
                            onClick={() => {
                                const newProjects = projects.filter((_, i) => i !== idx);
                                onUpdate(newProjects);
                            }}
                        >
                            <Trash className="w-3 h-3 mr-1" /> Remove
                        </Button>
                    </div>
                ))}
                {projects && projects.length > 0 && (
                    <Button variant="outline" size="sm" onClick={() => onUpdate([...projects, { name: "Project Name", description: "Description", bullets: [] }])}>
                        + Add Project
                    </Button>
                )}
            </div>
        )
    }

    if (section.type === "education") {
        const education = section.content as EducationEntry[];
        return (
            <div className="space-y-6">
                <h3 className="font-bold text-lg">Edit Education</h3>
                {education.map((edu, idx) => (
                    <div key={idx} className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <Input 
                                placeholder="School/University" 
                                value={edu.school || ""} 
                                onChange={(e) => {
                                    const newEdu = [...education];
                                    newEdu[idx] = { ...newEdu[idx], school: e.target.value };
                                    onUpdate(newEdu);
                                }} 
                                className="bg-neutral-900 border-neutral-700" 
                            />
                            <Input 
                                placeholder="Degree/Major" 
                                value={edu.degree || ""} 
                                onChange={(e) => {
                                    const newEdu = [...education];
                                    newEdu[idx] = { ...newEdu[idx], degree: e.target.value };
                                    onUpdate(newEdu);
                                }} 
                                className="bg-neutral-900 border-neutral-700" 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Input 
                                placeholder="Year (e.g. 2020-2024)" 
                                value={edu.year || ""} 
                                onChange={(e) => {
                                    const newEdu = [...education];
                                    newEdu[idx] = { ...newEdu[idx], year: e.target.value };
                                    onUpdate(newEdu);
                                }} 
                                className="bg-neutral-900 border-neutral-700" 
                            />
                            <Input 
                                placeholder="GPA (optional)" 
                                value={edu.gpa || ""} 
                                onChange={(e) => {
                                    const newEdu = [...education];
                                    newEdu[idx] = { ...newEdu[idx], gpa: e.target.value };
                                    onUpdate(newEdu);
                                }} 
                                className="bg-neutral-900 border-neutral-700" 
                            />
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-red-400 hover:text-red-300"
                            onClick={() => {
                                const newEdu = education.filter((_, i) => i !== idx);
                                onUpdate(newEdu);
                            }}
                        >
                            <Trash className="w-3 h-3 mr-1" /> Remove
                        </Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => onUpdate([...education, { school: "University", degree: "Degree", year: "2024" }])}>
                    + Add Education
                </Button>
            </div>
        )
    }

    // Certifications section
    if (section.type === "certifications") {
        const certs = section.content as { name: string; issuer: string; date?: string; url?: string }[];
        return (
            <div className="space-y-6">
                <h3 className="font-bold text-lg">Edit Certifications</h3>
                {certs.map((cert, idx) => (
                    <div key={idx} className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <Input 
                                placeholder="Certification Name" 
                                value={cert.name || ""} 
                                onChange={(e) => {
                                    const newCerts = [...certs];
                                    newCerts[idx] = { ...newCerts[idx], name: e.target.value };
                                    onUpdate(newCerts);
                                }} 
                                className="bg-neutral-900 border-neutral-700" 
                            />
                            <Input 
                                placeholder="Issuing Organization" 
                                value={cert.issuer || ""} 
                                onChange={(e) => {
                                    const newCerts = [...certs];
                                    newCerts[idx] = { ...newCerts[idx], issuer: e.target.value };
                                    onUpdate(newCerts);
                                }} 
                                className="bg-neutral-900 border-neutral-700" 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Input 
                                placeholder="Date (e.g. 2024)" 
                                value={cert.date || ""} 
                                onChange={(e) => {
                                    const newCerts = [...certs];
                                    newCerts[idx] = { ...newCerts[idx], date: e.target.value };
                                    onUpdate(newCerts);
                                }} 
                                className="bg-neutral-900 border-neutral-700" 
                            />
                            <Input 
                                placeholder="Credential URL (optional)" 
                                value={cert.url || ""} 
                                onChange={(e) => {
                                    const newCerts = [...certs];
                                    newCerts[idx] = { ...newCerts[idx], url: e.target.value };
                                    onUpdate(newCerts);
                                }} 
                                className="bg-neutral-900 border-neutral-700" 
                            />
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-red-400 hover:text-red-300"
                            onClick={() => {
                                const newCerts = certs.filter((_, i) => i !== idx);
                                onUpdate(newCerts);
                            }}
                        >
                            <Trash className="w-3 h-3 mr-1" /> Remove
                        </Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => onUpdate([...certs, { name: "Certification", issuer: "Organization", date: "2024" }])}>
                    + Add Certification
                </Button>
            </div>
        )
    }

    // Default catch-all
    return <div className="text-neutral-400">Editor not implemented for {section.type}</div>
}
