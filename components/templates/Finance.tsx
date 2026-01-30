import { Resume } from "@/types/resume";

export function FinanceTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;
    const { sections } = resume;
    const summary = sections.find(s => s.type === "summary")?.content as string | undefined;
    const experience = sections.find(s => s.type === "experience")?.content as any[];

    return (
        <div className="bg-white text-slate-900 h-full min-h-[11in] font-sans p-12 border-t-[20px] border-slate-800" id="resume-preview">
            <header className="flex justify-between items-end border-b pb-8 mb-8 border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-800">Your Name</h1>
                    <p className="text-slate-500 font-medium mt-1">Investment Banking | Financial Analysis</p>
                </div>
                <div className="text-right text-xs text-slate-500 space-y-1">
                    <p>New York, NY</p>
                    <p>email@firm.com</p>
                    <p>(212) 555-0123</p>
                </div>
            </header>

            {summary && (
                <div className="bg-slate-50 p-6 border border-slate-100 mb-8 rounded-sm">
                    <p className="text-sm leading-relaxed text-slate-700">{summary}</p>
                </div>
            )}

            {experience && (
                <section>
                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-6 tracking-wider">Professional Experience</h3>
                    <div className="space-y-6">
                        {experience.map((exp: any, i: number) => (
                            <div key={i} className="grid grid-cols-12 gap-4">
                                <div className="col-span-2 text-xs font-bold text-slate-400 pt-1">
                                    {exp.date}
                                </div>
                                <div className="col-span-10">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-slate-800 text-base">{exp.role}</h4>
                                        <span className="text-xs font-bold text-slate-600">{exp.company}</span>
                                    </div>
                                    <ul className="list-disc ml-4 text-xs text-slate-600 space-y-1">
                                        {exp.bullets?.map((b: string, j: number) => (
                                            <li key={j}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
