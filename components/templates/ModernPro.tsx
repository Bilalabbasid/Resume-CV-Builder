import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function ModernProTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-sans overflow-hidden" id="resume-preview">
            {/* Header with accent bar */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-8 py-6">
                <h1 className="text-4xl font-bold tracking-wide break-words">
                    {contact?.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-4 mt-3 text-teal-100 text-sm break-all">
                    {contact?.email && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {contact.email}
                        </span>
                    )}
                    {contact?.phone && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {contact.phone}
                        </span>
                    )}
                    {contact?.location && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {contact.location}
                        </span>
                    )}
                    {contact?.linkedin && <a href={contact.linkedin} className="hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                    {contact?.github && <a href={contact.github} className="hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>}
                </div>
            </div>

            <div className="px-8 py-6">
                {/* Summary */}
                {summary && (
                    <section className="mb-6">
                        <p className="text-gray-600 leading-relaxed italic">
                            {summary}
                        </p>
                    </section>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-base font-bold text-gray-900 uppercase mb-3">
                            Skills
                        </h2>
                        <ul className="list-disc list-outside ml-5 flex flex-wrap gap-x-6 gap-y-1 text-gray-700">
                            {skills.map((skill, i) => (
                                <li key={i} className="text-xs" style={{ flexBasis: 'calc(20% - 1.5rem)', minWidth: 'fit-content' }}>{skill}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-base font-bold text-gray-900 uppercase mb-3">
                            Experience
                        </h2>
                        <div className="space-y-5">
                            {experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{exp.role}</h3>
                                            <p className="text-gray-600 text-sm">{exp.company}</p>
                                        </div>
                                        <span className="text-gray-600 text-sm">{exp.date}</span>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        {exp.bullets?.slice(0, 4).map((bullet, j) => (
                                            <li key={j} className="text-gray-600 text-sm leading-relaxed flex items-start gap-2">
                                                <span className="text-gray-600 mt-1 flex-shrink-0">•</span>
                                                <span>{bullet}</span>
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
                        <h2 className="text-base font-bold text-gray-900 uppercase mb-3">
                            Projects
                        </h2>
                        <div className="space-y-3">
                            {projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-gray-800">{proj.name}</h3>
                                    {proj.description && (
                                        <p className="text-gray-600 text-xs italic mt-1">{proj.description}</p>
                                    )}
                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul className="mt-1 space-y-1">
                                            {proj.bullets.slice(0, 3).map((bullet, j) => (
                                                <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                                                    <span className="text-gray-600 mt-1 flex-shrink-0">•</span>
                                                    <span>{bullet}</span>
                                                </li>
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
                    <section className="mb-6">
                        <h2 className="text-base font-bold text-gray-900 uppercase mb-3">
                            Education
                        </h2>
                        <div className="space-y-3">
                            {education.map((edu, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                                        <p className="text-gray-600 text-sm">{edu.school}</p>
                                    </div>
                                    <span className="text-gray-500 text-sm">{edu.year}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
