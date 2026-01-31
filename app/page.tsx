import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2, Zap, Target, FileText, Wand2, Layout, Download } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "AI-Powered Writing",
      description: "Describe your experience and let AI craft compelling bullet points with action verbs and metrics."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "JD → Resume Tailoring",
      description: "Paste any job description. AI matches keywords and optimizes your resume for that specific role."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "ATS Optimization",
      description: "Real-time ATS scoring with specific suggestions. Get past the bots and into interviews."
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: "10+ Premium Templates",
      description: "Modern, ATS-friendly designs for tech, finance, creative, and executive roles."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Cover Letter Generator",
      description: "One-click cover letters that match your resume to each job description."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "PDF & DOCX Export",
      description: "Download in any format. Print-ready PDFs and editable Word documents."
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-md fixed top-0 w-full z-50 bg-neutral-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Resume<span className="text-purple-400">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/quick" className="text-sm font-medium hover:text-green-400 transition-colors hidden sm:block">Quick Resume</Link>
            <Link href="/templates" className="text-sm font-medium hover:text-purple-400 transition-colors hidden sm:block">Templates</Link>
            <Link href="/login" className="text-sm font-medium hover:text-purple-400 transition-colors">Log In</Link>
            <Link href="/quick">
              <Button variant="premium" size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Paste Job Description <br />
            <span className="text-purple-500">Get Perfect Resume</span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI that reads job descriptions and writes your resume to match. ATS-optimized, keyword-matched, and ready in 60 seconds. Land more interviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/quick">
              <Button variant="premium" size="lg" className="rounded-full px-8 text-base h-14">
                <Zap className="mr-2 w-5 h-5" />
                60-Second Resume
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-14 border-white/10 hover:bg-white/5 text-white">
                Build Step by Step <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="mt-16 flex flex-wrap justify-center gap-4 sm:gap-8">
            {["60 Seconds", "JD → Resume", "ATS: 95+", "Photo Templates", "20+ Templates"].map((feat) => (
              <div key={feat} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-neutral-300">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 mb-8">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Zero-Friction Resume Builder</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Paste the Job. Get the Resume.</h2>
        <p className="text-neutral-400 text-center mb-12 max-w-2xl mx-auto">No writing. No forms. Just 3 screens to a perfect resume.</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Paste Job Description", desc: "AI extracts role, skills, keywords, and seniority. Knows exactly what the job needs." },
            { step: "2", title: "Quick Details Only", desc: "Just your name, companies, and roles. AI writes all the bullets and descriptions." },
            { step: "3", title: "Resume Delivered", desc: "Full resume, ATS-optimized, JD-matched, template applied. Download and apply." }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-neutral-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Everything You Need</h2>
        <p className="text-neutral-400 text-center mb-12 max-w-2xl mx-auto">AI-powered features that make resume building effortless</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-neutral-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-neutral-300 mb-8 max-w-xl mx-auto">
            Join thousands of professionals who&apos;ve transformed their job search with AI-powered resumes.
          </p>
          <Link href="/create">
            <Button variant="premium" size="lg" className="rounded-full px-10 text-base h-14">
              Create My Resume Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-neutral-500 text-sm">
          <p>© 2024 ResumeAI. Built with AI for job seekers.</p>
        </div>
      </footer>
    </main>
  );
}
