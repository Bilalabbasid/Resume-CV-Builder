import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry, CertificationEntry } from "@/types/resume";

export function CleanTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;
    const certifications = resume.sections.find(s => s.type === "certifications")?.content as CertificationEntry[] | undefined;

    return (
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-sans p-10" id="resume-preview">
            {/* Clean Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">
                    {contact?.fullName || "Your Name"}
                </h1>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                    {contact?.email && (
                        <a href={`mailto:${contact.email}`} className="hover:text-blue-600">{contact.email}</a>
                    )}
                    {contact?.phone && (
                        <>
                            <span className="text-gray-300">|</span>
                            <span>{contact.phone}</span>
                        </>
                    )}
                    {contact?.location && (
                        <>
                            <span className="text-gray-300">|</span>
                            <span>{contact.location}</span>
                        </>
                    )}
                    {contact?.linkedin && (
                        <>
                            <span className="text-gray-300">|</span>
                            <a href={contact.linkedin} className="text-blue-600 hover:underline">LinkedIn</a>
                        </>
                    )}
                    {contact?.github && (
                        <>
                            <span className="text-gray-300">|</span>
                            <a href={contact.github} className="text-blue-600 hover:underline">GitHub</a>
                        </>
                    )}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                        Experience
                    </h2>
                    <div className="space-y-5">
                        {experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                                    <span className="text-sm text-gray-500">{exp.date}</span>
                                </div>
                                <p className="text-gray-600 text-sm">{exp.company}</p>
                                <ul className="mt-2 space-y-1">
                                    {exp.bullets?.map((bullet, j) => (
                                        <li key={j} className="text-gray-600 text-sm pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                                            {bullet}
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
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                        Projects
                    </h2>
                    <div className="space-y-4">
                        {projects.map((proj, i) => (
                            <div key={i}>
                                <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                                <p className="text-gray-600 text-sm">{proj.description}</p>
                                {proj.bullets && proj.bullets.length > 0 && (
                                    <ul className="mt-1 space-y-1">
                                        {proj.bullets.map((bullet, j) => (
                                            <li key={j} className="text-gray-600 text-sm pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
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

            {/* Skills & Education side by side */}
            <div className="grid grid-cols-2 gap-8">
                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-1">
                            {skills.map((skill, i) => (
                                <span key={i} className="text-gray-700 text-sm">
                                    {skill}{i < skills.length - 1 ? "," : ""}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">
                            Education
                        </h2>
                        <div className="space-y-2">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <p className="font-semibold text-gray-900 text-sm">{edu.degree}</p>
                                    <p className="text-gray-600 text-sm">{edu.school} • {edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
                <section className="mt-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200">
                        Certifications
                    </h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {certifications.map((cert, i) => (
                            <span key={i} className="text-gray-700 text-sm">
                                {cert.name} {cert.issuer && `(${cert.issuer})`} {cert.date && `• ${cert.date}`}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
