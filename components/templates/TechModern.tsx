import { Resume, ContactInfo, ProjectEntry, EducationEntry, CertificationEntry } from "@/types/resume";

export function TechTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;
    const { sections } = resume;
    const contact = sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = sections.find(s => s.type === "summary")?.content as string | undefined;
    const experience = sections.find(s => s.type === "experience")?.content as any[];
    const skills = sections.find(s => s.type === "skills")?.content as string[];
    const projects = sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;
    const certifications = sections.find(s => s.type === "certifications")?.content as CertificationEntry[] | undefined;

    return (
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-mono p-8" id="resume-preview">
            {/* Professional Header with actual user data */}
            <header className="border-b-2 border-blue-600 pb-6 mb-6">
                <h1 className="text-3xl font-bold mb-1 text-gray-900">
                    {contact?.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    {contact?.email && <span>{contact.email}</span>}
                    {contact?.phone && <span>• {contact.phone}</span>}
                    {contact?.location && <span>• {contact.location}</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-blue-600 mt-1">
                    {contact?.linkedin && <a href={contact.linkedin} className="hover:underline">LinkedIn</a>}
                    {contact?.github && <a href={contact.github} className="hover:underline">• GitHub</a>}
                    {contact?.portfolio && <a href={contact.portfolio} className="hover:underline">• Portfolio</a>}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">
                        Professional Summary
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
                        Experience
                    </h2>
                    <div className="space-y-4">
                        {experience.map((exp: any, i: number) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                                    <span className="text-xs text-gray-500">{exp.date}</span>
                                </div>
                                <p className="text-sm text-blue-600">{exp.company}</p>
                                <ul className="mt-2 space-y-1">
                                    {exp.bullets?.map((b: string, j: number) => (
                                        <li key={j} className="text-sm text-gray-600 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
                        Projects
                    </h2>
                    <div className="space-y-3">
                        {projects.map((proj, i) => (
                            <div key={i}>
                                <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                                <p className="text-sm text-gray-600">{proj.description}</p>
                                {proj.bullets && proj.bullets.length > 0 && (
                                    <ul className="mt-1 space-y-1">
                                        {proj.bullets.map((b, j) => (
                                            <li key={j} className="text-sm text-gray-600 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-6">
                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map((s, i) => (
                                <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 text-xs rounded border border-blue-100">{s}</span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">
                            Education
                        </h2>
                        <div className="space-y-2">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <p className="font-semibold text-sm text-gray-900">{edu.degree}</p>
                                    <p className="text-xs text-gray-600">{edu.school} • {edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
                <section className="mt-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">
                        Certifications
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {certifications.map((cert, i) => (
                            <span key={i} className="text-sm text-gray-700">
                                {cert.name} {cert.issuer && `(${cert.issuer})`} {cert.date && `• ${cert.date}`}
                                {i < certifications.length - 1 && ","}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
