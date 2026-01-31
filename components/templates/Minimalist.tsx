import { Resume } from "@/types/resume";

export function MinimalistTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;
    const { sections } = resume;
    const summary = sections.find(s => s.type === "summary")?.content as string | undefined;
    const experience = sections.find(s => s.type === "experience")?.content as any[];

    return (
        <div className="bg-white text-gray-800 p-12 h-full min-h-[11in] font-serif" id="resume-preview">
            <header className="mb-12 text-center">
                <h1 className="text-4xl italic mb-2 font-light">Your Name</h1>
                <p className="text-xs tracking-widest uppercase text-gray-500">Senior Professional</p>
            </header>

            {summary && (
                <div className="mb-10 text-center max-w-xl mx-auto leading-loose text-sm">
                    {summary}
                </div>
            )}

            <hr className="border-gray-200 mb-10 w-1/2 mx-auto" />

            {experience && experience.length > 0 && (
                <section>
                    <h3 className="text-center text-xs font-bold uppercase tracking-widest mb-8 text-gray-400">Experience</h3>
                    <div className="space-y-8">
                        {experience.map((exp: any, i: number) => (
                            <div key={i} className="grid grid-cols-4 gap-4">
                                <div className="col-span-1 text-right text-xs text-gray-500 pt-1">{exp.date}</div>
                                <div className="col-span-3">
                                    <div className="font-bold text-sm mb-1">{exp.role}</div>
                                    <div className="text-xs italic mb-2 text-gray-600">{exp.company}</div>
                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {exp.bullets.slice(0, 4).map((bullet: string, j: number) => (
                                                <li key={j} className="text-xs leading-relaxed text-gray-700 flex items-start gap-2">
                                                    <span className="mt-1 flex-shrink-0">•</span>
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
