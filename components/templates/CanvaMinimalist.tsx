import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry, CertificationEntry } from "@/types/resume";

export function CanvaMinimalistTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;
    const certifications = resume.sections.find(s => s.type === "certifications")?.content as CertificationEntry[] | undefined;

    return (
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-sans text-[11px] leading-relaxed" id="resume-preview">
            {/* Header with Photo */}
            <header className="flex items-center gap-6 px-10 py-8 border-b border-gray-200">
                {/* Profile Photo */}
                <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    {contact?.photo ? (
                        <img src={contact.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl font-bold">
                            {contact?.fullName?.charAt(0) || "?"}
                        </div>
                    )}
                </div>
                
                {/* Name & Contact */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {contact?.fullName || "Your Name"}
                    </h1>
                    <p className="text-gray-500 text-sm mb-3">
                        {resume.title?.replace(/^.*? - /, '') || "Professional Title"}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                        {contact?.phone && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {contact.phone}
                            </span>
                        )}
                        {contact?.email && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {contact.email}
                            </span>
                        )}
                        {contact?.location && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {contact.location}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <div className="px-10 py-6">
                {/* About Me / Summary */}
                {summary && (
                    <section className="mb-6">
                        <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-3 pb-2 border-b border-gray-300">
                            About Me
                        </h2>
                        <p className="text-gray-600 text-center leading-relaxed">{summary}</p>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-4 pb-2 border-b border-gray-300">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {education.map((edu, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-24 text-gray-500 text-xs flex-shrink-0">
                                        {edu.year}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 uppercase text-xs">
                                            {edu.school} | {edu.degree}
                                        </p>
                                        {edu.achievements && edu.achievements.length > 0 && (
                                            <p className="text-gray-600 mt-1">{edu.achievements.join(". ")}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Work Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-4 pb-2 border-b border-gray-300">
                            Work Experience
                        </h2>
                        <div className="space-y-4">
                            {experience.map((exp, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-24 text-gray-500 text-xs flex-shrink-0">
                                        {exp.date}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 uppercase text-xs">
                                            {exp.company} | {exp.role}
                                        </p>
                                        {exp.bullets && exp.bullets.length > 0 && (
                                            <p className="text-gray-600 mt-1">
                                                {exp.bullets.join(". ")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-4 pb-2 border-b border-gray-300">
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {projects.map((proj, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-24 text-gray-500 text-xs flex-shrink-0">
                                        {proj.technologies?.slice(0, 2).join(", ") || ""}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 uppercase text-xs">{proj.name}</p>
                                        <p className="text-gray-600 mt-1">{proj.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills - 3 Column Layout */}
                {skills && skills.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-4 pb-2 border-b border-gray-300">
                            Skills
                        </h2>
                        <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                            {skills.map((skill, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-700">
                                    <span className="text-gray-400">•</span>
                                    <span>{skill}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                    <section>
                        <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-900 mb-4 pb-2 border-b border-gray-300">
                            Certifications
                        </h2>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {certifications.map((cert, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-700">
                                    <span className="text-gray-400">•</span>
                                    <span>{cert.name} {cert.issuer && `(${cert.issuer})`}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
