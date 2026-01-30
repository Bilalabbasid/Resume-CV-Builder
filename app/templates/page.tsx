"use client";

import { TEMPLATES } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Wand2, PenTool, X, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type CategoryFilter = "All" | "Photo" | "ATS-Friendly" | "Modern" | "Creative" | "Professional" | "Simple";

export default function TemplatesPage() {
    const { userId } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

    // AI Modal State
    const [aiMode, setAiMode] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [jobDescription, setJobDescription] = useState("");

    const categories: CategoryFilter[] = ["All", "Photo", "ATS-Friendly", "Modern", "Creative", "Professional", "Simple"];
    
    const filteredTemplates = activeCategory === "All" 
        ? TEMPLATES 
        : TEMPLATES.filter(t => t.category === activeCategory);

    // Note: avoid returning a completely different root structure here
    // to prevent hydration mismatches. We keep the same outer markup and
    // render a loading state inside the container when `userId` is not ready.

    const handleSelectTemplate = (id: string) => {
        if (!userId) {
            toast.error("Please wait, loading user data...");
            return;
        }
        setSelectedTemplate(id);
    };

    const closeModal = () => {
        setSelectedTemplate(null);
        setAiMode(false);
        setPrompt("");
        setJobDescription("");
    }

    const handleCreate = async (withAI: boolean) => {
        if (!userId) {
            toast.error("User not loaded. Please refresh the page.");
            return;
        }
        
        if (!selectedTemplate) {
            toast.error("Please select a template");
            return;
        }
        
        if (withAI && !prompt) {
            toast.error("Please enter a description");
            return;
        }
        
        setLoading(selectedTemplate);
        console.log("Creating resume with:", { userId, selectedTemplate, withAI });

        // Wrap the create flow in an IIFE and handle errors so toast.promise receives a proper Promise
        const promise = (async () => {
            try {
                let sections: any[] = [];

                if (withAI) {
                    // Generate content first
                    const aiRes = await fetch("/api/generate", {
                        method: "POST",
                        body: JSON.stringify({ prompt, jobDescription }),
                    });
                    const aiJson = await aiRes.json();
                    if (aiJson.error) throw new Error(aiJson.error);
                    sections = mapToSections(aiJson.data);
                }

                // Create resume
                console.log("Sending create request...");
                const res = await fetch("/api/resumes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: withAI ? "AI Generated Resume" : "New Resume",
                        templateId: selectedTemplate,
                        userId
                    })
                });
                const json = await res.json();
                console.log("Create response:", json);

                if (!res.ok || json.error) {
                    console.error("Creation Error:", json.error);
                    throw new Error(json.error || "Failed to create resume");
                }

                if (!json.data || !json.data.id) {
                    console.error("Invalid response:", json);
                    throw new Error("Invalid response from server");
                }

                if (sections.length > 0) {
                    console.log("Updating sections...");
                    await fetch(`/api/resumes/${json.data.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ sections })
                    });
                }

                // Navigate to editor
                router.push(`/editor/${json.data.id}`);
            } catch (err: unknown) {
                console.error(err);
                // Keep consistent behavior: rethrow so toast.promise marks it as error
                setLoading(null);
                throw err;
            }
        })();

        toast.promise(
            promise,
            {
                loading: 'Creating resume...',
                success: 'Resume created!',
                error: (err) => `Failed to create resume: ${err?.message || err}`,
            }
        );

        promise.finally(() => setLoading(null));
    };

    // Helper function to map AI-generated data to sections
    interface GeneratedData {
        summary?: string;
        skills?: string[];
        experience?: { role: string; company: string; date?: string; bullets: string[] }[];
        projects?: { name: string; description: string; bullets?: string[] }[];
        education?: { school: string; degree: string; year: string }[];
    }

    const mapToSections = (data: GeneratedData) => {
        const sections: { id: string; type: string; content: unknown; order: number }[] = [];
        if (data.summary) sections.push({ id: crypto.randomUUID(), type: "summary", content: data.summary, order: 0 });
        if (data.skills) sections.push({ id: crypto.randomUUID(), type: "skills", content: data.skills, order: 1 });
        if (data.experience) sections.push({ id: crypto.randomUUID(), type: "experience", content: data.experience, order: 2 });
        if (data.projects) sections.push({ id: crypto.randomUUID(), type: "projects", content: data.projects, order: 3 });
        if (data.education) sections.push({ id: crypto.randomUUID(), type: "education", content: data.education, order: 4 });
        return sections;
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* If `userId` not ready, show loader inside the same outer structure to avoid hydration errors */}
                {!userId ? (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                            <p className="text-neutral-400">Loading...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Home</span>
                        </Link>
                        <header className="mb-8 text-center">
                            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-400">Template Gallery</h1>
                            <p className="text-neutral-400 max-w-2xl mx-auto">Choose from {TEMPLATES.length}+ professionally designed templates. Each template is ATS-optimized and fully editable.</p>
                        </header>

                        {/* Category Tabs */}
                        <div className="flex flex-wrap justify-center gap-2 mb-10">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        activeCategory === cat 
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' 
                                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                                    }`}
                                >
                                    {cat}
                                    {cat === "All" && <span className="ml-1 text-xs opacity-70">({TEMPLATES.length})</span>}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredTemplates.map(template => (
                                <div 
                                    key={template.id} 
                                    className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-900/20 hover:-translate-y-1 cursor-pointer"
                                    onClick={() => handleSelectTemplate(template.id)}
                                >
                                    {/* Color Bar Thumbnail */}
                                    <div className="h-48 w-full bg-neutral-800 relative overflow-hidden p-4 flex justify-center items-center">
                                        <div className={`w-32 h-44 bg-white shadow-2xl transform group-hover:scale-105 transition-transform duration-500 flex flex-col text-[5px] overflow-hidden rounded-sm`}>
                                            {/* Template Color Bar */}
                                            <div className={`h-8 w-full ${template.color || 'bg-blue-500'}`}></div>
                                            {/* Content Preview */}
                                            <div className="p-2 flex-1">
                                                <div className="h-2 w-16 bg-gray-300 mb-2"></div>
                                                <div className="space-y-1">
                                                    <div className="h-1 w-full bg-gray-200"></div>
                                                    <div className="h-1 w-5/6 bg-gray-200"></div>
                                                    <div className="h-1 w-4/5 bg-gray-200"></div>
                                                </div>
                                                <div className="h-1.5 w-10 bg-gray-300 mt-3 mb-1"></div>
                                                <div className="space-y-1">
                                                    <div className="h-1 w-full bg-gray-200"></div>
                                                    <div className="h-1 w-3/4 bg-gray-200"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        {template.popular && (
                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
                                                ⭐ Popular
                                            </div>
                                        )}
                                        {template.new && !template.popular && (
                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> New
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors">{template.name}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                template.category === 'Professional' ? 'bg-blue-500/20 text-blue-400' :
                                                template.category === 'Creative' ? 'bg-pink-500/20 text-pink-400' :
                                                template.category === 'Modern' ? 'bg-purple-500/20 text-purple-400' :
                                                template.category === 'ATS-Friendly' ? 'bg-green-500/20 text-green-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {template.category}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-400 mb-4 h-10 line-clamp-2">{template.description}</p>

                                        <Button
                                            variant="premium"
                                            size="sm"
                                            className="w-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectTemplate(template.id);
                                            }}
                                        >
                                            Use Template
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CONFIG MODAL */}
                        {selectedTemplate && (
                            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                                <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full p-6 relative animate-in zoom-in-95">
                                    <button onClick={closeModal} className="absolute top-4 right-4 text-neutral-400 hover:text-white"><X className="w-5 h-5" /></button>

                                    {!aiMode ? (
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-bold text-center">How to start?</h2>
                                            <div className="grid gap-4">
                                                <button
                                                    onClick={() => setAiMode(true)}
                                                    className="flex items-center gap-4 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition"
                                                >
                                                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400"><Wand2 /></div>
                                                    <div className="text-left">
                                                        <h3 className="font-bold">Auto-Fill with AI</h3>
                                                        <p className="text-sm text-neutral-400">Generate content tailored to a job description.</p>
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => handleCreate(false)}
                                                    disabled={!!loading}
                                                    className="flex items-center gap-4 p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition"
                                                >
                                                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400"><PenTool /></div>
                                                    <div className="text-left">
                                                        <h3 className="font-bold">Start Blank</h3>
                                                        <p className="text-sm text-neutral-400">Fill in the details manually.</p>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h2 className="text-xl font-bold flex items-center gap-2"><Wand2 className="w-5 h-5 text-purple-400" /> AI Content Generation</h2>

                                            <textarea
                                                className="w-full h-24 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                                                placeholder="Your Profile (Experience, Skills...)"
                                                value={prompt}
                                                onChange={e => setPrompt(e.target.value)}
                                            />
                                            <textarea
                                                className="w-full h-24 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                                placeholder="Target Job Description (for tailoring)..."
                                                value={jobDescription}
                                                onChange={e => setJobDescription(e.target.value)}
                                            />

                                            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleCreate(true)} disabled={!!loading || prompt.length < 5}>
                                                {loading ? <Loader2 className="animate-spin mr-2" /> : "Generate & Create Resume"}
                                            </Button>
                                            <Button variant="ghost" className="w-full" onClick={() => setAiMode(false)} disabled={!!loading}>Back</Button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}
