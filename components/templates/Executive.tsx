import { Resume } from "@/types/resume";

export function ExecutiveTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;
    const { sections } = resume;
    const summary = sections.find(s => s.type === "summary")?.content as string | undefined;
    const experience = sections.find(s => s.type === "experience")?.content as any[];
    const skills = sections.find(s => s.type === "skills")?.content as string[];

    return (
        <div className="bg-slate-100 text-slate-900 h-full min-h-[11in] font-serif p-0" id="resume-preview">
            <header className="bg-slate-900 text-white p-12 text-center border-b-4 border-yellow-600">
                <h1 className="text-4xl font-bold tracking-widest uppercase mb-2">Your Name</h1>
                <p className="text-yellow-600 text-sm font-bold tracking-[0.2em] uppercase">Executive Director</p>
                <div className="mt-6 flex justify-center gap-6 text-xs text-slate-400">
                    <span>email@example.com</span>
                    <span>•</span>
                    <span>+1 234 567 890</span>
                    <span>•</span>
                    <span>San Francisco, CA</span>
                </div>
            </header>

            <div className="p-12 max-w-4xl mx-auto">
                {summary && (
                    <div className="mb-10 text-center">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Executive Profile</h3>
                        <p className="text-slate-700 leading-relaxed">{summary}</p>
                    </div>
                )}

                {skills && (
                    <div className="mb-10 text-center border-y border-slate-200 py-6">
                        <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-800">
                            {skills.map((s, i) => <span key={i}>{s}</span>)}
                        </div>
                    </div>
                )}

                {experience && (
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 border-b-2 border-slate-900 pb-2 mb-8 uppercase">Professional Experience</h3>
                        <div className="space-y-10">
                            {experience.map((exp: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="font-bold text-xl text-slate-800">{exp.role}</h4>
                                        <span className="text-sm font-bold text-slate-500">{exp.date}</span>
                                    </div>
                                    <div className="text-yellow-700 font-bold text-sm mb-4">{exp.company}</div>
                                    <ul className="list-disc ml-4 space-y-2 text-slate-700 text-sm leading-relaxed">
                                        {exp.bullets?.map((b: string, j: number) => (
                                            <li key={j}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
