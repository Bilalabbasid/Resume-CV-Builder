import { Resume } from "@/types/resume";

export function IvyLeagueTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;
    const { sections } = resume;
    const summary = sections.find(s => s.type === "summary")?.content as string | undefined;
    const experience = sections.find(s => s.type === "experience")?.content as any[];
    const education = sections.find(s => s.type === "education")?.content as any[];

    return (
        <div className="bg-white text-black h-full min-h-[11in] font-serif p-14 leading-snug" id="resume-preview">
            <header className="text-center mb-6">
                <h1 className="text-2xl font-bold uppercase mb-2">Your Name</h1>
                <div className="text-sm mb-2">
                    1234 University Ave, Cambridge, MA 02138 &bull; (555) 123-4567 &bull; email@harvard.edu
                </div>
            </header>

            {/* Separator */}
            <hr className="border-black mb-4" />

            {education && (
                <section className="mb-6">
                    <h3 className="font-bold text-sm uppercase mb-2">Education</h3>
                    <div className="space-y-2">
                        {education.map((edu: any, i: number) => (
                            <div key={i} className="flex justify-between">
                                <div>
                                    <span className="font-bold block">{edu.school}</span>
                                    <span className="italic">{edu.degree}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block">{edu.year}</span>
                                    <span className="text-xs">GPS: 4.0</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {summary && (
                <section className="mb-6">
                    <h3 className="font-bold text-sm uppercase mb-2">Professional Summary</h3>
                    <p className="text-sm text-justify">{summary}</p>
                </section>
            )}

            {experience && (
                <section>
                    <h3 className="font-bold text-sm uppercase mb-4">Professional Experience</h3>
                    <div className="space-y-6">
                        {experience.map((exp: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between font-bold text-sm mb-1">
                                    <span>{exp.company}</span>
                                    <span>{exp.date}</span>
                                </div>
                                <div className="italic text-sm mb-2">{exp.role}</div>
                                <ul className="list-disc ml-5 space-y-1 text-sm">
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
    )
}
