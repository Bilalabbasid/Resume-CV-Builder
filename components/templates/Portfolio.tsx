import { Resume } from "@/types/resume";

export function PortfolioTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;
    const { sections } = resume;
    const summary = sections.find(s => s.type === "summary")?.content as string | undefined;
    const experience = sections.find(s => s.type === "experience")?.content as any[];
    const skills = sections.find(s => s.type === "skills")?.content as string[];

    return (
        <div className="bg-neutral-900 text-white h-full min-h-[11in] font-sans p-0 overflow-hidden" id="resume-preview">
            <div className="h-40 bg-gradient-to-br from-violet-600 to-fuchsia-600 p-10 flex items-end">
                <h1 className="text-6xl font-black tracking-tighter mix-blend-overlay opacity-90">PORTFOLIO.</h1>
            </div>

            <div className="p-10">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Your Name</h2>
                        <p className="text-neutral-400">Multidisciplinary Designer & Art Director</p>
                    </div>
                    <div className="text-right text-sm font-mono text-neutral-500">
                        <p>AVAILABLE FOR FREELANCE</p>
                        <p>2024 - 2025</p>
                    </div>
                </div>

                {summary && (
                    <div className="text-xl font-light text-neutral-300 leading-relaxed mb-16 max-w-3xl">
                        {summary}
                    </div>
                )}

                {experience && (
                    <div className="grid grid-cols-2 gap-6 mb-16">
                        {experience.map((exp: any, i: number) => (
                            <div key={i} className="bg-neutral-800/50 p-6 rounded-2xl hover:bg-neutral-800 transition-colors border border-white/5">
                                <div className="text-xs font-bold text-fuchsia-400 mb-4">{exp.date}</div>
                                <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                                <div className="text-sm text-neutral-400 mb-4">{exp.company}</div>
                                <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">{exp.bullets?.[0]}</p>
                            </div>
                        ))}
                    </div>
                )}

                {skills && (
                    <div className="border-t border-white/10 pt-10">
                        <div className="flex flex-wrap gap-2">
                            {skills.map((s, i) => (
                                <span key={i} className="text-8xl font-black text-white/5 hover:text-white/20 transition-colors cursor-default select-none pointer-events-none -ml-4 -mt-4 leading-none">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
