import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function ATSClassicTemplate({ resume }: { resume: Resume }) {
    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[];
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[];
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[];
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[];
    const certifications = resume.sections.find(s => s.type === "certifications")?.content as { name: string; issuer: string; date?: string }[];

    return (
        <div className="w-full max-w-[210mm] mx-auto bg-white text-black p-12 shadow-lg font-serif overflow-hidden" style={{ minHeight: '297mm' }}>
            {/* Header */}
            {contact && (
                <div className="border-b border-black pb-2 mb-6">
                    <h1 className="text-3xl font-bold uppercase tracking-wide mb-1 break-words">
                        {contact.fullName}
                    </h1>
                    <h2 className="text-base font-semibold uppercase tracking-wider mb-2">
                        {resume.title.replace("'s Resume", "")}
                    </h2>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs break-all">
                        {contact.email && <span className="break-all">{contact.email}</span>}
                        {contact.phone && <span>| {contact.phone}</span>}
                        {contact.location && <span>| {contact.location}</span>}
                        {contact.linkedin && <span>| <a href={contact.linkedin} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{contact.linkedin.replace('https://', '').replace('http://', '')}</a></span>}
                        {contact.github && <span>| <a href={contact.github} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{contact.github.replace('https://', '').replace('http://', '')}</a></span>}
                        {contact.portfolio && <span>| <a href={contact.portfolio} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{contact.portfolio.replace('https://', '').replace('http://', '')}</a></span>}
                    </div>
                </div>
            )}

            {/* Summary */}
            {summary && (
                <div className="mb-6">
                    <h3 className="text-base font-bold uppercase mb-3 pb-1 border-b border-gray-400">
                        Summary
                    </h3>
                    <p className="text-sm leading-relaxed text-justify">
                        {summary}
                    </p>
                </div>
            )}

            {/* Professional Experience */}
            {experience && experience.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-base font-bold uppercase mb-3 pb-1 border-b border-gray-400">
                        Professional Experience
                    </h3>
                    <div className="space-y-4">
                        {experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <div className="flex-1">
                                        <span className="text-sm font-bold">{exp.company}</span>
                                        {exp.role && <span className="text-sm">, {exp.role}</span>}
                                    </div>
                                    <span className="text-xs text-right whitespace-nowrap ml-2">{exp.date}</span>
                                </div>
                                {exp.bullets && exp.bullets.length > 0 && (
                                    <ul className="space-y-1 mt-2">
                                        {exp.bullets.slice(0, 4).map((bullet, i) => (
                                            <li key={i} className="text-sm leading-relaxed flex items-start">
                                                <span className="mr-2 flex-shrink-0">•</span>
                                                <span className="flex-1">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-base font-bold uppercase mb-3 pb-1 border-b border-gray-400">
                        Projects
                    </h3>
                    <div className="space-y-4">
                        {projects.map((project, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm font-bold">{project.name}</span>
                                    <span className="text-xs text-right whitespace-nowrap ml-2">{project.url || ''}</span>
                                </div>
                                {project.description && (
                                    <p className="text-xs mb-1 italic">{project.description}</p>
                                )}
                                {project.bullets && project.bullets.length > 0 && (
                                    <ul className="space-y-1 mt-1">
                                        {project.bullets.slice(0, 3).map((bullet, i) => (
                                            <li key={i} className="text-sm leading-relaxed flex items-start">
                                                <span className="mr-2 flex-shrink-0">•</span>
                                                <span className="flex-1">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-base font-bold uppercase mb-3 pb-1 border-b border-gray-400">
                        Skills
                    </h3>
                    <ul className="list-disc list-outside ml-5 flex flex-wrap gap-x-6 gap-y-1">
                        {skills.map((skill, idx) => (
                            <li key={idx} className="text-xs" style={{ flexBasis: 'calc(20% - 1.5rem)', minWidth: 'fit-content' }}>{skill}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-base font-bold uppercase mb-3 pb-1 border-b border-gray-400">
                        Education
                    </h3>
                    <div className="space-y-3">
                        {education.map((edu, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm font-bold">{edu.degree}</span>
                                    <span className="text-xs text-right whitespace-nowrap ml-2">{edu.year}</span>
                                </div>
                                <div className="text-sm">{edu.school}</div>
                                {edu.achievements && edu.achievements.length > 0 && (
                                    <ul className="space-y-1 mt-1">
                                        {edu.achievements.map((achievement, i) => (
                                            <li key={i} className="text-sm leading-relaxed flex">
                                                <span className="mr-2">•</span>
                                                <span className="flex-1">{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Additional Information / Certifications */}
            {certifications && certifications.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 mb-3">
                        Additional Information
                    </h3>
                    <div className="space-y-2">
                        {certifications.map((cert, idx) => (
                            <div key={idx} className="text-sm">
                                <span className="font-semibold">{cert.name}</span>
                                {cert.issuer && <span>: {cert.issuer}</span>}
                                {cert.date && <span> ({cert.date})</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
