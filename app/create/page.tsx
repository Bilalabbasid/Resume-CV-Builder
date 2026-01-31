"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { ArrowRight, Wand2, Upload, FileText, Layout, Loader2, PenTool, User, Mail, Phone, MapPin, Linkedin, Github, Globe, Sparkles, Target, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { ContactInfo, JDAnalysis } from "@/types/resume";
import { TEMPLATES } from "@/lib/templates";

export default function CreateResume() {
    const { userId } = useUser();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"ai" | "manual" | "upload" | "examples">("ai");
    const [step, setStep] = useState<"contact" | "template" | "content">("contact");
    const [prompt, setPrompt] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [jdAnalysis, setJdAnalysis] = useState<JDAnalysis | null>(null);
    const [analyzingJD, setAnalyzingJD] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("canva-minimalist"); // Default to Canva-style minimalist template
    
    // Contact info state
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: ""
    });

    const updateContact = (field: keyof ContactInfo, value: string) => {
        setContactInfo(prev => ({ ...prev, [field]: value }));
    };

    // Analyze JD for keywords
    const analyzeJobDescription = async () => {
        if (!jobDescription || jobDescription.length < 50) {
            toast.error("Please enter a complete job description");
            return;
        }
        
        setAnalyzingJD(true);
        try {
            const res = await fetch("/api/analyze-jd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobDescription })
            });
            const json = await res.json();
            if (json.data) {
                setJdAnalysis(json.data);
                toast.success("JD analyzed! Keywords extracted for ATS optimization.");
            } else {
                throw new Error(json.error || "Analysis failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to analyze job description");
        } finally {
            setAnalyzingJD(false);
        }
    };

    // --- HANDLERS ---

    const handleCreateAI = async () => {
        if (!userId || !prompt) {
            toast.error("Please enter a description");
            return;
        }
        
        // Validate contact info
        if (!contactInfo.fullName || !contactInfo.email) {
            toast.error("Please enter your name and email");
            setStep("contact");
            return;
        }
        
        setLoading(true);
        
        const p = (async () => {
            // 1. Generate Content
            const aiRes = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, jobDescription, contactInfo }),
            });
            const aiJson = await aiRes.json();
            if (aiJson.error) throw new Error(aiJson.error);

            // 2. Create Resume with contact info
            const sections = mapToSections(aiJson.data, contactInfo);
            const title = contactInfo.fullName ? `${contactInfo.fullName}'s Resume` : "AI Generated Resume";
            await createAndRedirect(title, sections);
        })();

        toast.promise(p, {
            loading: 'Generating your ATS-optimized resume with AI...',
            success: 'Resume created successfully!',
            error: (err) => `Failed to create resume: ${err}`,
        });

        p.finally(() => setLoading(false));
    };

    const handleUpload = async () => {
        if (!userId || !file) {
            toast.error("Please select a file");
            return;
        }
        setLoading(true);
        
        const p = (async () => {
            const formData = new FormData();
            formData.append("file", file);

            const parseRes = await fetch("/api/parse", {
                method: "POST",
                body: formData
            });
            const parseJson = await parseRes.json();
            if (parseJson.error) throw new Error(parseJson.error);

            const sections = mapToSections(parseJson.data, contactInfo.fullName ? contactInfo : undefined);
            const title = contactInfo.fullName ? `${contactInfo.fullName}'s Resume` : file.name.replace(".pdf", "");
            await createAndRedirect(title, sections);
        })();

        toast.promise(p, {
            loading: 'Parsing your resume...',
            success: 'Resume uploaded successfully!',
            error: (err) => `Upload failed: ${err}`,
        });

        p.finally(() => setLoading(false));
    };

    const handleManual = async () => {
        if (!userId) return;
        
        // Validate contact info if provided
        if (contactInfo.fullName && !contactInfo.email) {
            toast.error("Please also enter your email");
            return;
        }
        
        setLoading(true);
        
        // Create with contact info if provided
        const initialSections = contactInfo.fullName ? [
            { id: crypto.randomUUID(), type: "contact", content: contactInfo, order: 0 }
        ] : [];
        
        const title = contactInfo.fullName ? `${contactInfo.fullName}'s Resume` : "Untitled Resume";
        const p = createAndRedirect(title, initialSections);
        
        toast.promise(p, {
            loading: 'Creating blank resume...',
            success: 'Resume created!',
            error: 'Failed to create resume',
        });
        p.finally(() => setLoading(false));
    };

    // Helper to standardise creation
    const createAndRedirect = async (title: string, sections: { id: string; type: string; content: unknown; order: number }[]) => {
        try {
            const createRes = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    templateId: selectedTemplate,
                    userId,
                    contactInfo,
                    jobDescription: jobDescription || undefined,
                }),
            });
            const createJson = await createRes.json();

            if (!createRes.ok || createJson.error) {
                throw new Error(createJson.error || "Failed to create resume");
            }

            const resumeId = createJson.data.id;

            // Patch sections if any
            if (sections.length > 0) {
                await fetch(`/api/resumes/${resumeId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sections, jobDescription: jobDescription || undefined })
                });
            }

            router.push(`/editor/${resumeId}`);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    interface GeneratedData {
        summary?: string;
        skills?: string[];
        experience?: { role: string; company: string; date?: string; bullets: string[] }[];
        projects?: { name: string; description: string; bullets?: string[] }[];
        education?: { school: string; degree: string; year: string }[];
    }

    const mapToSections = (data: GeneratedData, contact?: ContactInfo) => {
        const sections: { id: string; type: string; content: unknown; order: number }[] = [];
        
        // Always add contact first if provided
        if (contact && (contact.fullName || contact.email)) {
            sections.push({ id: crypto.randomUUID(), type: "contact", content: contact, order: 0 });
        }
        
        if (data.summary) sections.push({ id: crypto.randomUUID(), type: "summary", content: data.summary, order: 1 });
        if (data.skills) sections.push({ id: crypto.randomUUID(), type: "skills", content: data.skills, order: 2 });
        if (data.experience) sections.push({ id: crypto.randomUUID(), type: "experience", content: data.experience, order: 3 });
        if (data.projects) sections.push({ id: crypto.randomUUID(), type: "projects", content: data.projects, order: 4 });
        if (data.education) sections.push({ id: crypto.randomUUID(), type: "education", content: data.education, order: 5 });
        return sections;
    }

    // Show loading if userId not ready
    if (!userId) {
        return (
            <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400">Loading...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">

            <div className="max-w-5xl w-full">
                <h1 className="text-4xl font-bold mb-4">How do you want to start?</h1>
                <p className="text-neutral-400 mb-12">Choose availability options that best suit your needs.</p>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

                    {/* OPTION 1: AI */}
                    <OptionCard
                        active={activeTab === "ai"}
                        onClick={() => setActiveTab("ai")}
                        icon={<Wand2 className="w-8 h-8 text-purple-400" />}
                        title="Create with AI"
                        desc="Generate from a simple prompt"
                    />

                    {/* OPTION 2: Upload */}
                    <OptionCard
                        active={activeTab === "upload"}
                        onClick={() => setActiveTab("upload")}
                        icon={<Upload className="w-8 h-8 text-blue-400" />}
                        title="Upload Resume"
                        desc="Parse PDF/Text interactively"
                    />

                    {/* OPTION 3: Manual */}
                    <OptionCard
                        active={activeTab === "manual"}
                        onClick={() => setActiveTab("manual")}
                        icon={<PenTool className="w-8 h-8 text-green-400" />}
                        title="Start from Scratch"
                        desc="Blank canvas, manual entry"
                    />

                    {/* OPTION 4: Examples */}
                    <OptionCard
                        active={activeTab === "examples"}
                        onClick={() => setActiveTab("examples")}
                        icon={<Layout className="w-8 h-8 text-orange-400" />}
                        title="Browse Templates"
                        desc="Pick from 1000s of examples"
                    />

                </div>

                {/* Dynamic Content Area */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300">

                    {activeTab === "ai" && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                                <Wand2 className="w-6 h-6 text-purple-500" /> AI Resume Builder
                            </h2>
                            
                            {/* Step indicator */}
                            <div className="flex justify-center gap-2 mb-4">
                                <button 
                                    onClick={() => setStep("contact")}
                                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${step === "contact" ? 'bg-purple-500 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                                >
                                    {(step === "template" || step === "content") && contactInfo.fullName ? <CheckCircle2 className="w-3 h-3" /> : "1."}
                                    Contact
                                </button>
                                <button 
                                    onClick={() => contactInfo.fullName && contactInfo.email ? setStep("template") : toast.error("Fill contact info first")}
                                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${step === "template" ? 'bg-purple-500 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                                >
                                    {step === "content" && selectedTemplate ? <CheckCircle2 className="w-3 h-3" /> : "2."}
                                    Template
                                </button>
                                <button 
                                    onClick={() => selectedTemplate ? setStep("content") : toast.error("Select a template first")}
                                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${step === "content" ? 'bg-purple-500 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                                >
                                    3. Profile & JD
                                </button>
                            </div>

                            {step === "contact" && (
                                <div className="space-y-4 animate-in fade-in">
                                    <p className="text-neutral-400 text-sm">Enter your basic information (appears in resume header)</p>
                                    <p className="text-xs text-amber-400">* Name and Email are required to continue</p>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2">
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                                <Input 
                                                    placeholder="Full Name *" 
                                                    value={contactInfo.fullName}
                                                    onChange={e => updateContact("fullName", e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                            <Input 
                                                type="email"
                                                placeholder="Email *" 
                                                value={contactInfo.email}
                                                onChange={e => updateContact("email", e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                            <Input 
                                                placeholder="Phone" 
                                                value={contactInfo.phone}
                                                onChange={e => updateContact("phone", e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                            <Input 
                                                placeholder="Location (City, State)" 
                                                value={contactInfo.location}
                                                onChange={e => updateContact("location", e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                            <Input 
                                                placeholder="LinkedIn URL" 
                                                value={contactInfo.linkedin}
                                                onChange={e => updateContact("linkedin", e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                            <Input 
                                                placeholder="GitHub URL" 
                                                value={contactInfo.github}
                                                onChange={e => updateContact("github", e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <div className="relative col-span-2">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                            <Input 
                                                placeholder="Portfolio/Website URL" 
                                                value={contactInfo.portfolio}
                                                onChange={e => updateContact("portfolio", e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        variant="premium" 
                                        size="lg" 
                                        className="w-full" 
                                        onClick={() => {
                                            if (!contactInfo.fullName || !contactInfo.email) {
                                                toast.error("Please fill in your Name and Email to continue");
                                                return;
                                            }
                                            setStep("template");
                                        }}
                                    >
                                        Next: Choose Template <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            {step === "template" && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="flex items-center justify-between">
                                        <button onClick={() => setStep("contact")} className="text-neutral-400 hover:text-white flex items-center gap-1 text-sm">
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                        <p className="text-neutral-400 text-sm">Choose your resume template</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
                                        {TEMPLATES.slice(0, 12).map(template => (
                                            <button
                                                key={template.id}
                                                onClick={() => setSelectedTemplate(template.id)}
                                                className={`p-3 rounded-lg border-2 text-left transition-all hover:scale-[1.02] ${
                                                    selectedTemplate === template.id 
                                                        ? 'border-purple-500 bg-purple-500/10' 
                                                        : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800'
                                                }`}
                                            >
                                                <div className={`h-2 w-full ${template.color} rounded mb-2`} />
                                                <p className="text-sm font-medium truncate">{template.name}</p>
                                                <p className="text-xs text-neutral-500">{template.category}</p>
                                                {selectedTemplate === template.id && (
                                                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Link href="/templates" className="flex-1">
                                            <Button variant="outline" size="lg" className="w-full">
                                                Browse All Templates
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="premium" 
                                            size="lg" 
                                            className="flex-1"
                                            onClick={() => setStep("content")}
                                        >
                                            Next: Add Profile <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === "content" && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="flex items-center justify-between">
                                        <button onClick={() => setStep("template")} className="text-neutral-400 hover:text-white flex items-center gap-1 text-sm">
                                            <ArrowLeft className="w-4 h-4" /> Back
                                        </button>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-neutral-500">Template:</span>
                                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                                {TEMPLATES.find(t => t.id === selectedTemplate)?.name || "Modern"}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-neutral-400 text-sm">Describe your experience. Add a Job Description for ATS-optimized tailoring.</p>

                                    <div className="grid gap-4">
                                        <textarea
                                            className="w-full h-28 bg-neutral-950 border border-neutral-800 rounded-lg p-4 focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm"
                                            placeholder="Your Profile: e.g. Senior Backend Engineer with 5+ years at FAANG companies. Expert in Python, Go, distributed systems, and cloud architecture. Led teams of 5-10 engineers..."
                                            value={prompt}
                                            onChange={e => setPrompt(e.target.value)}
                                        />
                                        
                                        <div className="relative">
                                            <textarea
                                                className="w-full h-28 bg-neutral-950 border border-neutral-800 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                                                placeholder="Paste Target Job Description here for ATS optimization..."
                                                value={jobDescription}
                                                onChange={e => {
                                                    setJobDescription(e.target.value);
                                                    setJdAnalysis(null);
                                                }}
                                            />
                                            {jobDescription.length > 50 && !jdAnalysis && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="absolute top-2 right-2 text-xs"
                                                    onClick={analyzeJobDescription}
                                                    disabled={analyzingJD}
                                                >
                                                    {analyzingJD ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Target className="w-3 h-3 mr-1" />}
                                                    Analyze JD
                                                </Button>
                                            )}
                                        </div>

                                        {/* JD Analysis Results */}
                                        {jdAnalysis && (
                                            <div className="bg-neutral-900 border border-green-500/30 rounded-lg p-4 text-left animate-in fade-in">
                                                <div className="flex items-center gap-2 text-green-400 font-medium mb-3">
                                                    <Sparkles className="w-4 h-4" />
                                                    JD Analysis Complete
                                                </div>
                                                <div className="grid gap-2 text-xs">
                                                    <div>
                                                        <span className="text-neutral-500">Role:</span>{" "}
                                                        <span className="text-white">{jdAnalysis.role}</span>
                                                        <span className="ml-2 text-neutral-500">({jdAnalysis.seniority})</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-neutral-500">Required Skills:</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {jdAnalysis.requiredSkills.slice(0, 8).map((skill, i) => (
                                                                <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">{skill}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-neutral-500">ATS Keywords:</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {jdAnalysis.keywords.slice(0, 6).map((kw, i) => (
                                                                <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">{kw}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" size="lg" onClick={() => setStep("contact")}>
                                            Back
                                        </Button>
                                        <Button variant="premium" size="lg" className="flex-1" onClick={handleCreateAI} disabled={loading || prompt.length < 10}>
                                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2 w-5 h-5" />} 
                                            Generate ATS-Optimized Resume
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "upload" && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                                <Upload className="w-6 h-6 text-blue-500" /> Upload PDF
                            </h2>
                            <div className="border-2 border-dashed border-neutral-700 rounded-xl p-10 hover:bg-neutral-800/50 transition-colors">
                                <Input type="file" accept=".pdf" className="hidden" id="file-upload" onChange={e => setFile(e.target.files?.[0] || null)} />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                    <FileText className="w-12 h-12 text-neutral-500 mb-4" />
                                    <span className="text-lg font-medium">{file ? file.name : "Click to select PDF"}</span>
                                    <span className="text-sm text-neutral-500 mt-2">Max 5MB</span>
                                </label>
                            </div>
                            <Button variant="premium" size="lg" className="w-full" onClick={handleUpload} disabled={loading || !file}>
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 w-5 h-5" />} Parse & Create
                            </Button>
                        </div>
                    )}

                    {activeTab === "manual" && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                                <PenTool className="w-6 h-6 text-green-500" /> Manual Entry
                            </h2>
                            <p className="text-neutral-400">Prefer full control? Start with a blank slate and fill in your details manually using our advanced editor.</p>
                            <Button variant="outline" size="lg" className="w-full border-green-500/20 hover:bg-green-500/10 hover:text-green-400" onClick={handleManual}>
                                Create Empty Resume <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {activeTab === "examples" && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                                <Layout className="w-6 h-6 text-orange-500" /> Information
                            </h2>
                            <p className="text-neutral-400">Browse our gallery of professionally designed templates to find your perfect match.</p>
                            <Link href="/templates">
                                <Button variant="premium" size="lg" className="w-full bg-gradient-to-r from-orange-500 to-red-500 border-0">
                                    Go to Template Gallery <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}

interface OptionCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

function OptionCard({ title, desc, icon, active, onClick }: OptionCardProps) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${active ? 'bg-neutral-800 border-purple-500 ring-1 ring-purple-500' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'}`}
        >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto ${active ? 'bg-neutral-700' : 'bg-neutral-800'}`}>
                {icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm text-neutral-400">{desc}</p>
        </div>
    )
}
