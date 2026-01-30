import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function Modern2024Template({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-zinc-50 text-gray-800 h-full min-h-[11in] font-sans" id="resume-preview">
            {/* Modern Header */}
            <header className="bg-zinc-900 text-white px-10 py-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">
                            {contact?.fullName || "Your Name"}
                        </h1>
                        {summary && (
                            <p className="mt-3 text-zinc-400 max-w-lg text-sm leading-relaxed">{summary}</p>
                        )}
                    </div>
                    <div className="text-right text-sm space-y-1">
                        {contact?.email && (
                            <p className="text-zinc-300">{contact.email}</p>
                        )}
                        {contact?.phone && (
                            <p className="text-zinc-400">{contact.phone}</p>
                        )}
                        {contact?.location && (
                            <p className="text-zinc-500">{contact.location}</p>
                        )}
                        <div className="flex gap-2 justify-end mt-2">
                            {contact?.linkedin && (
                                <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs text-zinc-300">in</span>
                            )}
                            {contact?.github && (
                                <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs text-zinc-300">gh</span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-10 py-8">
                {/* Skills Pills */}
                {skills && skills.length > 0 && (
                    <section className="mb-8">
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-zinc-900 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-black text-zinc-900 mb-6">Experience</h2>
                        <div className="space-y-6">
                            {experience.map((exp, i) => (
                                <div key={i} className="group">
                                    <div className="flex items-baseline gap-4 mb-2">
                                        <h3 className="text-lg font-bold text-zinc-900">{exp.role}</h3>
                                        <span className="text-zinc-500 text-sm">@ {exp.company}</span>
                                        <span className="ml-auto text-zinc-400 text-sm">{exp.date}</span>
                                    </div>
                                    <div className="pl-4 border-l-2 border-zinc-200 group-hover:border-zinc-900 transition-colors">
                                        <ul className="space-y-2">
                                            {exp.bullets?.map((bullet, j) => (
                                                <li key={j} className="text-zinc-600 text-sm leading-relaxed">
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Two Column Grid */}
                <div className="grid grid-cols-2 gap-10">
                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black text-zinc-900 mb-4">Projects</h2>
                            <div className="space-y-4">
                                {projects.map((proj, i) => (
                                    <div key={i} className="p-4 bg-white rounded-lg shadow-sm border border-zinc-100">
                                        <h3 className="font-bold text-zinc-900">{proj.name}</h3>
                                        <p className="text-zinc-600 text-sm mt-1">{proj.description}</p>
                                        {proj.bullets && proj.bullets.length > 0 && (
                                            <ul className="mt-2 space-y-1">
                                                {proj.bullets.map((b, j) => (
                                                    <li key={j} className="text-zinc-500 text-xs">• {b}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black text-zinc-900 mb-4">Education</h2>
                            <div className="space-y-4">
                                {education.map((edu, i) => (
                                    <div key={i} className="p-4 bg-white rounded-lg shadow-sm border border-zinc-100">
                                        <h3 className="font-bold text-zinc-900">{edu.degree}</h3>
                                        <p className="text-zinc-600 text-sm">{edu.school}</p>
                                        <p className="text-zinc-400 text-xs mt-1">{edu.year}</p>
                                        {edu.gpa && <p className="text-zinc-500 text-xs">GPA: {edu.gpa}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
