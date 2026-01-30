"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { Plus, FileText, Trash2, Copy, Eye } from "lucide-react";
import { Resume } from "@/types/resume";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export default function Dashboard() {
    const { userId } = useUser();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        async function fetchResumes() {
            try {
                const res = await fetch("/api/resumes");
                const json = await res.json();
                if (json.data) {
                    const myResumes = json.data.filter((r: Resume) => r.userId === userId);
                    setResumes(myResumes);
                }
            } catch (error) {
                console.error("Failed to load resumes", error);
                toast.error("Failed to load resumes");
            } finally {
                setLoading(false);
            }
        }

        fetchResumes();
    }, [userId]);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            setResumes(prev => prev.filter(r => r.id !== id));
            setDeleteId(null);
            toast.success("Resume deleted successfully");
        } catch (e) {
            console.error("Delete failed", e);
            toast.error("Failed to delete resume");
        }
    }

    const handleDuplicate = async (resume: Resume, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        toast.promise(
            (async () => {
                const createRes = await fetch("/api/resumes", {
                    method: "POST",
                    body: JSON.stringify({
                        title: `${resume.title} (Copy)`,
                        templateId: resume.templateId,
                        userId,
                    }),
                });
                const createJson = await createRes.json();
                if (!createRes.ok) throw new Error("Failed to duplicate");

                const newId = createJson.data.id;

                // Copy sections
                await fetch(`/api/resumes/${newId}`, {
                    method: "PATCH",
                    body: JSON.stringify({ sections: resume.sections })
                });

                // Refresh list
                const res = await fetch("/api/resumes");
                const json = await res.json();
                if (json.data) {
                    const myResumes = json.data.filter((r: Resume) => r.userId === userId);
                    setResumes(myResumes);
                }
            })(),
            {
                loading: 'Duplicating resume...',
                success: 'Resume duplicated!',
                error: 'Failed to duplicate resume',
            }
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="h-10 w-48 bg-neutral-800 rounded-lg animate-pulse mb-10" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-neutral-900 rounded-xl border border-neutral-800 animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
                        <p className="text-neutral-400">Create, edit, and manage your professional resumes</p>
                    </div>
                    <Link href="/create">
                        <Button variant="premium" size="lg" className="group">
                            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Create New
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Card */}
                    <Link href="/create" className="group relative flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed border-neutral-800 hover:border-purple-500/50 hover:bg-neutral-900/50 transition-all cursor-pointer animate-fade-in">
                        <div className="h-12 w-12 rounded-full bg-neutral-800 group-hover:bg-purple-500/20 flex items-center justify-center transition-all mb-4">
                            <Plus className="w-6 h-6 text-neutral-400 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
                        </div>
                        <p className="font-medium text-neutral-400 group-hover:text-neutral-200 transition-colors">Create New Resume</p>
                    </Link>

                    {/* Resume Cards */}
                    {resumes.map((resume, idx) => (
                        <div
                            key={resume.id}
                            className="group relative h-64 rounded-xl border border-neutral-800 bg-neutral-900 p-6 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-900/10 animate-fade-in"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <Link href={`/editor/${resume.id}`} className="absolute inset-0" />
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => handleDuplicate(resume, e)} 
                                        className="relative z-10 text-neutral-600 hover:text-purple-400 p-2 rounded-lg hover:bg-neutral-800 transition-all"
                                        title="Duplicate"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`/print/${resume.id}`, '_blank'); }} 
                                        className="relative z-10 text-neutral-600 hover:text-blue-400 p-2 rounded-lg hover:bg-neutral-800 transition-all"
                                        title="Preview"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteId(resume.id); }} 
                                        className="relative z-10 text-neutral-600 hover:text-red-400 p-2 rounded-lg hover:bg-neutral-800 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-300 transition-colors truncate">
                                {resume.title}
                            </h3>
                            <p className="text-neutral-500 text-sm">
                                Last updated: {new Date(resume.createdAt).toLocaleDateString()}
                            </p>

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center gap-2 text-xs text-neutral-600">
                                    <div className="h-1.5 flex-1 bg-neutral-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all" 
                                            style={{ width: `${Math.min((resume.sections.length / 5) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <span>{resume.sections.length} sections</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-neutral-600 capitalize">{resume.templateId.replace('-', ' ')}</span>
                                    <span className="text-xs px-2 py-1 bg-neutral-800 rounded-full text-neutral-500">Draft</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {resumes.length === 0 && (
                    <div className="text-center py-20">
                        <FileText className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-neutral-400 mb-2">No resumes yet</h3>
                        <p className="text-neutral-600 mb-6">Create your first resume to get started</p>
                        <Link href="/create">
                            <Button variant="premium">
                                <Plus className="w-4 h-4 mr-2" /> Create Resume
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Resume?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your resume.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="premium" 
                            onClick={() => deleteId && handleDelete(deleteId)}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
