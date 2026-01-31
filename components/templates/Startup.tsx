import { Resume } from "@/types/resume";

export function StartupTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;
    const { sections } = resume;
    const summary = sections.find(s => s.type === "summary")?.content as string | undefined;
    const experience = sections.find(s => s.type === "experience")?.content as any[];
    const skills = sections.find(s => s.type === "skills")?.content as string[];

    return (
        <div className="bg-white text-slate-800 h-full min-h-[11in] font-sans" id="resume-preview">
            <header className="bg-gradient-to-r from-orange-500 to-pink-600 text-white p-10 clip-path-slant mb-8">
                <h1 className="text-5xl font-black mb-2 tracking-tight">Your Name.</h1>
                <p className="text-white/80 font-medium text-lg">Growth Hacker & Product Builder</p>
                <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold bg-white/10 p-3 rounded-lg backdrop-blur-sm w-fit">
                    <span>🚀 github.com/me</span>
                    <span>📫 email@startup.com</span>
                    <span>📱 +1 555 0199</span>
                </div>
            </header>

            <div className="px-10">
                {summary && (
                    <div className="mb-10">
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600 mb-4">About Me</h3>
                        <p className="text-lg leading-relaxed text-slate-600 font-medium">{summary}</p>
                    </div>
                )}

                {skills && (
                    <div className="mb-12">
                        <ul className="list-disc list-outside ml-5 flex flex-wrap gap-x-6 gap-y-1 text-slate-700">
                            {skills.map((s, i) => (
                                <li key={i} className="text-xs" style={{ flexBasis: 'calc(20% - 1.5rem)', minWidth: 'fit-content' }}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="col-span-2">
                        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-sm">EXP</span>
                            Work History
                        </h3>

                        <div className="space-y-12">
                            {experience && experience.map((exp: any, i: number) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-xl group-hover:text-orange-600 transition-colors">{exp.role}</h4>
                                            <div className="text-sm text-slate-400 font-medium">{exp.company}</div>
                                        </div>
                                        <span className="px-3 py-1 rounded bg-slate-100 text-xs font-bold text-slate-500">{exp.date}</span>
                                    </div>
                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul className="mt-3 space-y-1">
                                            {exp.bullets.slice(0, 4).map((bullet: string, j: number) => (
                                                <li key={j} className="text-slate-600 text-sm leading-relaxed flex items-start gap-2">
                                                    <span className="text-orange-500 mt-1 flex-shrink-0">•</span>
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
