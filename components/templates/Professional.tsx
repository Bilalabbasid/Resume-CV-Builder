import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function ProfessionalTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-white text-gray-900 h-full min-h-[11in] font-sans overflow-hidden" id="resume-preview">
            {/* Classic Header */}
            <header className="text-center border-b-2 border-gray-900 pb-4 mb-6">
                <h1 className="text-3xl font-bold tracking-wide uppercase">
                    {contact?.fullName || "Your Name"}
                </h1>
                <div className="mt-2 text-sm text-gray-700 flex justify-center flex-wrap gap-2">
                    {contact?.email && <span>{contact.email}</span>}
                    {contact?.phone && (
                        <>
                            <span>|</span>
                            <span>{contact.phone}</span>
                        </>
                    )}
                    {contact?.location && (
                        <>
                            <span>|</span>
                            <span>{contact.location}</span>
                        </>
                    )}
                </div>
                {(contact?.linkedin || contact?.github) && (
                    <div className="mt-1 text-sm text-gray-600 flex justify-center gap-4">
                        {contact?.linkedin && <a href={contact.linkedin} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                        {contact?.github && <a href={contact.github} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>}
                    </div>
                )}
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-5">
                    <h2 className="text-base font-bold uppercase mb-2 pb-1 border-b border-gray-400">Professional Summary</h2>
                    <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        Professional Experience
                    </h2>
                    <div className="space-y-4">
                        {experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                    <span className="text-sm text-gray-600">{exp.date}</span>
                                </div>
                                <p className="text-gray-700 italic text-sm">{exp.company}</p>
                                <ul className="mt-2 space-y-1 text-sm">
                                    {exp.bullets?.slice(0, 4).map((bullet, j) => (
                                        <li key={j} className="text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0">
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-base font-bold uppercase mb-3 pb-1 border-b border-gray-400">
                        Education
                    </h2>
                    <div className="space-y-2">
                        {education.map((edu, i) => (
                            <div key={i} className="flex justify-between">
                                <div>
                                    <p className="font-bold text-gray-900">{edu.degree}</p>
                                    <p className="text-gray-700 text-sm">{edu.school}</p>
                                </div>
                                <span className="text-gray-600 text-sm">{edu.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-base font-bold uppercase mb-2 pb-1 border-b border-gray-400">
                        Skills
                    </h2>
                    <p className="text-gray-700 text-sm">{skills.join(" • ")}</p>
                </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-3 border-b border-gray-300 pb-1">
                        Projects
                    </h2>
                    <div className="space-y-2">
                        {projects.map((proj, i) => (
                            <div key={i}>
                                <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                {proj.description && (
                                    <p className="text-xs text-gray-700 italic mt-1">{proj.description}</p>
                                )}
                                {proj.bullets && proj.bullets.length > 0 && (
                                    <ul className="mt-1 space-y-1 text-sm">
                                        {proj.bullets.slice(0, 3).map((bullet, j) => (
                                            <li key={j} className="text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0">
                                                {bullet}
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
    );
}
