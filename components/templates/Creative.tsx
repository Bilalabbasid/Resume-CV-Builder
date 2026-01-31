import { Resume, ContactInfo, ExperienceEntry } from "@/types/resume";

export function CreativeTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;
    const { sections } = resume;
    const contactSection = sections.find(s => s.type === "contact");
    const contact = contactSection?.content as ContactInfo | undefined;
    const summary = sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;

    // Split name for creative layout
    const nameParts = (contact?.fullName || "Your Name").split(" ");
    const firstName = nameParts[0] || "Your";
    const lastName = nameParts.slice(1).join(" ") || "Name";

    return (
        <div className="bg-slate-50 text-gray-900 h-full min-h-[11in] font-sans grid grid-cols-12 overflow-hidden" id="resume-preview">

            {/* Left Header Strip */}
            <div className="col-span-4 bg-indigo-600 text-white p-8 flex flex-col justify-between">
                <div>
                    <h1 className="text-5xl font-black leading-none mb-4">{firstName}<br />{lastName}.</h1>
                    <div className="h-2 w-20 bg-yellow-400 mb-8"></div>
                    {summary && <p className="opacity-80 text-sm mb-12">{summary}</p>}

                    <h3 className="font-bold text-yellow-400 mb-4 tracking-widest text-xs uppercase">Contact</h3>
                    <div className="text-xs space-y-2 opacity-80">
                        {contact?.email && <p>{contact.email}</p>}
                        {contact?.phone && <p>{contact.phone}</p>}
                        {contact?.location && <p>{contact.location}</p>}
                        {contact?.portfolio && <p>{contact.portfolio}</p>}
                        {contact?.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline block">LinkedIn</a>}
                        {contact?.github && <a href={contact.github} target="_blank" rel="noopener noreferrer" className="hover:underline block">GitHub</a>}
                        {!contact && (
                            <>
                                <p>email@example.com</p>
                                <p>+1 234 567 890</p>
                                <p>portfolio.com</p>
                            </>
                        )}
                    </div>
                </div>

                {skills && (
                    <div>
                        <h3 className="font-bold text-yellow-400 mb-4 tracking-widest text-xs uppercase">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((s, i) => (
                                <span key={i} className="border border-white/20 px-2 py-1 rounded text-xs">{s}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Content */}
            <div className="col-span-8 p-12">
                {summary && (
                    <div className="mb-12 bg-white p-6 shadow-sm border-l-4 border-yellow-400">
                        <p className="text-lg italic text-gray-600 font-light>">{summary}</p>
                    </div>
                )}

                {experience && experience.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-black text-indigo-900 mb-8 flex items-center gap-4">
                            Experience <span className="h-px flex-1 bg-indigo-100"></span>
                        </h2>
                        <div className="space-y-8 pl-4 border-l-2 border-indigo-100">
                            {experience.map((exp, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white"></div>
                                    <h3 className="font-bold text-xl">{exp.role}</h3>
                                    <div className="text-indigo-500 font-medium mb-2 text-sm">{exp.company} | {exp.date}</div>
                                    <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                                        {exp.bullets?.slice(0, 4).map((b, j) => (
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
