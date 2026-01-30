"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { 
    ArrowRight, ArrowLeft, Loader2, Sparkles, Target, CheckCircle2, 
    User, Mail, Phone, Linkedin, Briefcase, GraduationCap, Zap,
    FileText, Download, Edit3, TrendingUp, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { JDAnalysis } from "@/types/resume";

type Step = "jd" | "info" | "result";

interface ExperienceInput {
    company: string;
    role: string;
    years: string;
}

interface EducationInput {
    degree: string;
    school: string;
    year: string;
}

export default function QuickResumePage() {
    const { userId } = useUser();
    const router = useRouter();
    
    // Current step
    const [step, setStep] = useState<Step>("jd");
    const [loading, setLoading] = useState(false);
    
    // Step 1: JD
    const [jobDescription, setJobDescription] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [jdAnalysis, setJdAnalysis] = useState<JDAnalysis | null>(null);
    const [analyzingJD, setAnalyzingJD] = useState(false);
    
    // Step 2: Minimal Info
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [experiences, setExperiences] = useState<ExperienceInput[]>([
        { company: "", role: "", years: "" }
    ]);
    const [education, setEducation] = useState<EducationInput>({ degree: "", school: "", year: "" });
    const [keyAchievements, setKeyAchievements] = useState("");
    
    // Step 3: Result
    const [resumeId, setResumeId] = useState<string | null>(null);
    const [jdMatchScore, setJdMatchScore] = useState<number>(0);
    
    // Analyze JD
    const analyzeJD = async () => {
        if (jobDescription.length < 100) {
            toast.error("Please paste a complete job description");
            return;
        }
        
        setAnalyzingJD(true);
        try {
            const res = await fetch("/api/analyze-jd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobDescription })
            });
            const data = await res.json();
            
            if (data.data) {
                setJdAnalysis(data.data);
                toast.success("JD analyzed! We know exactly what this role needs.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to analyze JD");
        } finally {
            setAnalyzingJD(false);
        }
    };
    
    // Generate Resume
    const generateResume = async () => {
        if (!userId) {
            toast.error("Please wait, loading...");
            return;
        }
        
        if (!fullName || !email) {
            toast.error("Name and email are required");
            return;
        }
        
        if (!experiences[0].company || !experiences[0].role) {
            toast.error("Please add at least one work experience");
            return;
        }
        
        setLoading(true);
        
        try {
            // Build the AI prompt from minimal input
            const experienceText = experiences
                .filter(e => e.company && e.role)
                .map(e => `${e.role} at ${e.company} (${e.years})`)
                .join("; ");
            
            const prompt = `
Create a resume for: ${fullName}

WORK EXPERIENCE:
${experienceText}

${education.degree ? `EDUCATION: ${education.degree} from ${education.school} (${education.year})` : ""}

${keyAchievements ? `KEY ACHIEVEMENTS: ${keyAchievements}` : ""}

IMPORTANT INSTRUCTIONS:
- Generate 3-5 impactful bullet points for each role
- Use action verbs and include realistic metrics
- Match the tone and keywords from the job description
- Create a compelling professional summary
- Suggest relevant skills based on the roles
`;

            // Generate content
            const aiRes = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    prompt, 
                    jobDescription,
                    contactInfo: { fullName, email, phone, linkedin }
                })
            });
            const aiData = await aiRes.json();
            
            if (aiData.error) throw new Error(aiData.error);
            
            // Auto-select template based on JD analysis
            const templateId = selectTemplate(jdAnalysis);
            
            // Create resume
            const contactSection = {
                id: crypto.randomUUID(),
                type: "contact",
                content: { fullName, email, phone, linkedin, location: "", github: "", portfolio: "" },
                order: 0
            };
            
            const sections = [
                contactSection,
                ...(aiData.data.summary ? [{ id: crypto.randomUUID(), type: "summary", content: aiData.data.summary, order: 1 }] : []),
                ...(aiData.data.skills ? [{ id: crypto.randomUUID(), type: "skills", content: aiData.data.skills, order: 2 }] : []),
                ...(aiData.data.experience ? [{ id: crypto.randomUUID(), type: "experience", content: aiData.data.experience, order: 3 }] : []),
                ...(aiData.data.projects ? [{ id: crypto.randomUUID(), type: "projects", content: aiData.data.projects, order: 4 }] : []),
                ...(education.degree ? [{ id: crypto.randomUUID(), type: "education", content: [education], order: 5 }] : 
                    aiData.data.education ? [{ id: crypto.randomUUID(), type: "education", content: aiData.data.education, order: 5 }] : []),
            ];
            
            // Create in database
            const createRes = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: `${fullName} - ${jdAnalysis?.role || "Resume"}`,
                    templateId,
                    userId,
                    jobDescription
                })
            });
            const createData = await createRes.json();
            
            if (createData.error) throw new Error(createData.error);
            
            // Update with sections
            await fetch(`/api/resumes/${createData.data.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sections, jobDescription })
            });
            
            // Calculate match score
            const matchScore = calculateMatchScore(aiData.data.skills || [], jdAnalysis?.requiredSkills || []);
            setJdMatchScore(matchScore);
            setResumeId(createData.data.id);
            setStep("result");
            
            toast.success("Resume generated! 🎉");
            
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate resume");
        } finally {
            setLoading(false);
        }
    };
    
    // Auto-select template based on JD
    const selectTemplate = (analysis: JDAnalysis | null): string => {
        if (!analysis) return "modern-2024";
        
        const role = analysis.role.toLowerCase();
        const industry = analysis.industry.toLowerCase();
        
        if (role.includes("engineer") || role.includes("developer") || industry.includes("tech")) {
            return "tech-1";
        }
        if (role.includes("designer") || role.includes("creative") || industry.includes("design")) {
            return "creative";
        }
        if (role.includes("executive") || role.includes("director") || analysis.seniority === "executive") {
            return "exec-1";
        }
        if (industry.includes("finance") || industry.includes("banking")) {
            return "fin-1";
        }
        if (analysis.seniority === "senior" || analysis.seniority === "lead") {
            return "corporate";
        }
        
        return "modern-2024";
    };
    
    // Calculate match score
    const calculateMatchScore = (resumeSkills: string[], jdSkills: string[]): number => {
        if (jdSkills.length === 0) return 85;
        const matched = resumeSkills.filter(s => 
            jdSkills.some(js => js.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(js.toLowerCase()))
        );
        return Math.min(95, Math.round((matched.length / jdSkills.length) * 100) + 10);
    };
    
    // Add experience row
    const addExperience = () => {
        setExperiences([...experiences, { company: "", role: "", years: "" }]);
    };
    
    // Update experience
    const updateExperience = (idx: number, field: keyof ExperienceInput, value: string) => {
        const updated = [...experiences];
        updated[idx][field] = value;
        setExperiences(updated);
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-800 z-50">
                <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                    style={{ width: step === "jd" ? "33%" : step === "info" ? "66%" : "100%" }}
                />
            </div>

            <div className="max-w-3xl mx-auto px-6 py-16">
                {/* Step 1: JD */}
                {step === "jd" && (
                    <div className="animate-in fade-in">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm mb-4">
                                <Zap className="w-4 h-4" />
                                60-Second Resume
                            </div>
                            <h1 className="text-4xl font-bold mb-4">
                                Paste the Job. Get the Resume.
                            </h1>
                            <p className="text-neutral-400 text-lg">
                                Our AI reads the job description and creates a perfectly tailored resume.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Job Description *
                                </label>
                                <textarea
                                    className="w-full h-64 bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white placeholder-neutral-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    placeholder="Paste the full job description here...

Example:
We are looking for a Senior Software Engineer to join our team. You will be responsible for designing and implementing scalable backend systems..."
                                    value={jobDescription}
                                    onChange={(e) => {
                                        setJobDescription(e.target.value);
                                        setJdAnalysis(null);
                                    }}
                                />
                            </div>

                            <Input
                                placeholder="Company name (optional)"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="bg-neutral-900 border-neutral-800"
                            />

                            {/* JD Analysis Preview */}
                            {jdAnalysis && (
                                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 animate-in fade-in">
                                    <div className="flex items-center gap-2 text-green-400 font-medium mb-3">
                                        <CheckCircle2 className="w-5 h-5" />
                                        AI Detected
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-neutral-500">Role:</span>
                                            <span className="ml-2 text-white font-medium">{jdAnalysis.role}</span>
                                        </div>
                                        <div>
                                            <span className="text-neutral-500">Level:</span>
                                            <span className="ml-2 text-white font-medium capitalize">{jdAnalysis.seniority}</span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span className="text-neutral-500 text-sm">Key Skills:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {jdAnalysis.requiredSkills.slice(0, 6).map((skill, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                {!jdAnalysis && jobDescription.length > 100 && (
                                    <Button
                                        variant="outline"
                                        onClick={analyzeJD}
                                        disabled={analyzingJD}
                                        className="flex-1"
                                    >
                                        {analyzingJD ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Target className="w-4 h-4 mr-2" />}
                                        Analyze JD
                                    </Button>
                                )}
                                <Button
                                    variant="premium"
                                    onClick={() => {
                                        if (jobDescription.length < 100) {
                                            toast.error("Please paste a complete job description (at least 100 characters)");
                                            return;
                                        }
                                        if (!jdAnalysis) {
                                            analyzeJD().then(() => setStep("info"));
                                        } else {
                                            setStep("info");
                                        }
                                    }}
                                    disabled={jobDescription.length < 100}
                                    className="flex-1"
                                >
                                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Minimal Info */}
                {step === "info" && (
                    <div className="animate-in fade-in">
                        <button 
                            onClick={() => setStep("jd")}
                            className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">Quick Details</h1>
                            <p className="text-neutral-400">
                                Just the basics. AI will expand everything into a full resume.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Personal Info */}
                            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4 text-purple-400" />
                                    Personal Info
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        placeholder="Full Name *"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="bg-neutral-800 border-neutral-700"
                                    />
                                    <Input
                                        type="email"
                                        placeholder="Email *"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-neutral-800 border-neutral-700"
                                    />
                                    <Input
                                        placeholder="Phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="bg-neutral-800 border-neutral-700"
                                    />
                                    <Input
                                        placeholder="LinkedIn URL"
                                        value={linkedin}
                                        onChange={(e) => setLinkedin(e.target.value)}
                                        className="bg-neutral-800 border-neutral-700"
                                    />
                                </div>
                            </div>

                            {/* Experience - Ultra Light */}
                            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                                <h3 className="font-semibold mb-1 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-blue-400" />
                                    Experience
                                </h3>
                                <p className="text-xs text-neutral-500 mb-4">Just company & title. AI writes the bullets.</p>
                                
                                <div className="space-y-3">
                                    {experiences.map((exp, idx) => (
                                        <div key={idx} className="grid grid-cols-3 gap-2">
                                            <Input
                                                placeholder="Company *"
                                                value={exp.company}
                                                onChange={(e) => updateExperience(idx, "company", e.target.value)}
                                                className="bg-neutral-800 border-neutral-700"
                                            />
                                            <Input
                                                placeholder="Role/Title *"
                                                value={exp.role}
                                                onChange={(e) => updateExperience(idx, "role", e.target.value)}
                                                className="bg-neutral-800 border-neutral-700"
                                            />
                                            <Input
                                                placeholder="Years (e.g. 2020-2024)"
                                                value={exp.years}
                                                onChange={(e) => updateExperience(idx, "years", e.target.value)}
                                                className="bg-neutral-800 border-neutral-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" size="sm" onClick={addExperience} className="mt-2 text-neutral-400">
                                    + Add another role
                                </Button>
                            </div>

                            {/* Education */}
                            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-green-400" />
                                    Education (optional)
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        placeholder="Degree"
                                        value={education.degree}
                                        onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                                        className="bg-neutral-800 border-neutral-700"
                                    />
                                    <Input
                                        placeholder="School"
                                        value={education.school}
                                        onChange={(e) => setEducation({ ...education, school: e.target.value })}
                                        className="bg-neutral-800 border-neutral-700"
                                    />
                                    <Input
                                        placeholder="Year"
                                        value={education.year}
                                        onChange={(e) => setEducation({ ...education, year: e.target.value })}
                                        className="bg-neutral-800 border-neutral-700"
                                    />
                                </div>
                            </div>

                            {/* Optional Achievements */}
                            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-5">
                                <h3 className="font-semibold mb-1 flex items-center gap-2 text-neutral-400">
                                    <TrendingUp className="w-4 h-4" />
                                    Key Achievements (optional)
                                </h3>
                                <p className="text-xs text-neutral-500 mb-3">Any metrics or highlights to include?</p>
                                <Input
                                    placeholder="e.g. Increased revenue by 40%, Led team of 8, Published 3 papers..."
                                    value={keyAchievements}
                                    onChange={(e) => setKeyAchievements(e.target.value)}
                                    className="bg-neutral-800 border-neutral-700"
                                />
                            </div>

                            <Button
                                variant="premium"
                                size="lg"
                                onClick={generateResume}
                                disabled={loading || !fullName || !email || !experiences[0].company}
                                className="w-full"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Generating Your Resume...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Generate My Resume
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Result */}
                {step === "result" && resumeId && (
                    <div className="animate-in fade-in text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>

                        <h1 className="text-4xl font-bold mb-4">Your Resume is Ready! 🎉</h1>
                        
                        {/* Match Score */}
                        <div className="inline-flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-full px-6 py-3 mb-8">
                            <div className={`text-2xl font-bold ${jdMatchScore >= 80 ? 'text-green-400' : jdMatchScore >= 60 ? 'text-yellow-400' : 'text-orange-400'}`}>
                                {jdMatchScore}%
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-medium">JD Match Score</div>
                                <div className="text-xs text-neutral-500">Keywords & skills aligned</div>
                            </div>
                        </div>

                        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                            AI analyzed the job description and created a tailored resume with matching keywords, skills, and experience bullets.
                        </p>

                        <div className="flex flex-col gap-3 max-w-md mx-auto">
                            <Button
                                variant="premium"
                                size="lg"
                                onClick={() => router.push(`/editor/${resumeId}`)}
                            >
                                <Edit3 className="w-5 h-5 mr-2" />
                                Review & Edit Resume
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => window.open(`/api/export/${resumeId}`, '_blank')}
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download PDF
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setStep("jd");
                                    setJobDescription("");
                                    setJdAnalysis(null);
                                    setResumeId(null);
                                }}
                            >
                                Create Another Resume
                            </Button>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-10 flex justify-center gap-6 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                ATS-Optimized
                            </span>
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                JD-Matched Keywords
                            </span>
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                Editable
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
