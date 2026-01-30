import { Resume } from "@/types/resume";

export function TechTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;
    const { sections } = resume;
    const summary = sections.find(s => s.type === "summary")?.content as string | undefined;
    const experience = sections.find(s => s.type === "experience")?.content as any[];
    const skills = sections.find(s => s.type === "skills")?.content as string[];

    return (
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-mono p-10" id="resume-preview">
            <header className="border-b-2 border-gray-800 pb-8 mb-8">
                <h1 className="text-4xl font-bold mb-2 tracking-tighter text-blue-600">&lt;YourName /&gt;</h1>
                <p className="text-sm text-gray-500">Full Stack Engineer | DevOps | Cloud Architect</p>
                <div className="mt-4 text-xs font-bold text-gray-600 space-x-4">
                    <span>const email = &quot;me@example.com&quot;</span>
                    <span>const phone = &quot;123-456-7890&quot;</span>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8">
                    {summary && (
                        <div className="mb-8 p-4 bg-gray-50 rounded border-l-4 border-blue-500">
                            <p className="text-xs leading-relaxed text-gray-600">
                                <span className="font-bold text-blue-600 mr-2">root@user:~$</span>
                                {summary}
                            </p>
                        </div>
                    )}

                    {experience && (
                        <section>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="text-blue-600">#</span> Experience
                            </h3>
                            <div className="space-y-8">
                                {experience.map((exp: any, i: number) => (
                                    <div key={i} className="relative pl-6 border-l border-gray-200">
                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-base">{exp.role}</h4>
                                            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{exp.date}</span>
                                        </div>
                                        <div className="text-xs text-blue-600 mb-2 font-bold">{exp.company}</div>
                                        <ul className="text-xs text-gray-600 space-y-1.5 ml-2">
                                            {exp.bullets?.map((b: string, j: number) => (
                                                <li key={j} className="flex gap-2">
                                                    <span className="text-gray-400">console.log</span>
                                                    <span>(&quot;{b}&quot;)</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-4">
                    {skills && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold mb-4 uppercase text-gray-400">Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((s, i) => (
                                    <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 text-[10px] font-bold rounded border border-blue-100">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-4 bg-gray-900 text-green-400 text-xs rounded font-mono leading-loose">
                        $ git commit -m &quot;Hired!&quot;<br />
                        $ git push origin master<br />
                        <span className="text-gray-500">...deploying to prod</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
