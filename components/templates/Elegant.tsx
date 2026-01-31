import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function ElegantTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-serif" id="resume-preview">
            {/* Elegant Header */}
            <header className="text-center py-10 border-b-2 border-gray-800">
                <h1 className="text-5xl font-light tracking-[0.3em] text-gray-800 uppercase">
                    {contact?.fullName || "Your Name"}
                </h1>
                <div className="mt-4 flex justify-center gap-6 text-sm text-gray-600">
                    {contact?.email && <span>{contact.email}</span>}
                    {contact?.phone && <span>|</span>}
                    {contact?.phone && <span>{contact.phone}</span>}
                    {contact?.location && <span>|</span>}
                    {contact?.location && <span>{contact.location}</span>}
                </div>
                <div className="mt-2 flex justify-center gap-4 text-sm text-gray-500">
                    {contact?.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>}
                    {contact?.github && <a href={contact.github} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>}
                    {contact?.portfolio && <a href={contact.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio</a>}
                </div>
            </header>

            <div className="px-12 py-8">
                {/* Summary */}
                {summary && (
                    <section className="mb-8 text-center">
                        <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto italic text-lg">
                            "{summary}"
                        </p>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-center text-sm font-bold tracking-[0.4em] text-gray-800 uppercase mb-6">
                            Professional Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map((exp, i) => (
                                <div key={i} className="border-l border-gray-300 pl-6 ml-4">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{exp.role}</h3>
                                            <p className="text-gray-600 italic">{exp.company}</p>
                                        </div>
                                        <span className="text-gray-500 text-sm">{exp.date}</span>
                                    </div>
                                    <ul className="mt-3 space-y-2">
                                        {exp.bullets?.slice(0, 4).map((bullet, j) => (
                                            <li key={j} className="text-gray-600 text-sm leading-relaxed">
                                                — {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Two Column Layout for Skills & Education */}
                <div className="grid grid-cols-2 gap-12">
                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold tracking-[0.4em] text-gray-800 uppercase mb-4 text-center">
                                Expertise
                            </h2>
                            <ul className="list-disc list-outside ml-5 flex flex-wrap gap-x-6 gap-y-1 text-gray-700">
                                {skills.map((skill, i) => (
                                    <li key={i} className="text-xs" style={{ flexBasis: 'calc(20% - 1.5rem)', minWidth: 'fit-content' }}>{skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold tracking-[0.4em] text-gray-800 uppercase mb-4 text-center">
                                Education
                            </h2>
                            <div className="text-center space-y-2">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <p className="font-semibold text-gray-800">{edu.degree}</p>
                                        <p className="text-gray-600 text-sm">{edu.school} • {edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <section className="mt-8 pt-6 border-t border-gray-200">
                        <h2 className="text-center text-sm font-bold tracking-[0.4em] text-gray-800 uppercase mb-6">
                            Notable Projects
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            {projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-semibold text-gray-800">{proj.name}</h3>
                                    {proj.description && (
                                        <p className="text-gray-600 text-xs italic mt-1">{proj.description}</p>
                                    )}
                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {proj.bullets.slice(0, 3).map((bullet, j) => (
                                                <li key={j} className="text-gray-600 text-sm">
                                                    — {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
