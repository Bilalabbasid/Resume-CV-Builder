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
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-sans" id="resume-preview">
            {/* Header with accent bar */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-8 py-6">
                <h1 className="text-4xl font-bold tracking-wide">
                    {contact?.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-4 mt-3 text-teal-100 text-sm">
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
                    {contact?.linkedin && <span>LinkedIn</span>}
                    {contact?.github && <span>GitHub</span>}
                </div>
            </div>

            <div className="px-8 py-6">
                {/* Summary */}
                {summary && (
                    <section className="mb-6">
                        <p className="text-gray-600 leading-relaxed border-l-4 border-teal-500 pl-4 italic">
                            {summary}
                        </p>
                    </section>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-teal-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-teal-500"></span>
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium border border-teal-200">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-teal-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-teal-500"></span>
                            Experience
                        </h2>
                        <div className="space-y-5">
                            {experience.map((exp, i) => (
                                <div key={i} className="relative pl-4 border-l-2 border-gray-200">
                                    <div className="absolute -left-[5px] top-1 w-2 h-2 bg-teal-500 rounded-full"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{exp.role}</h3>
                                            <p className="text-teal-600 font-medium text-sm">{exp.company}</p>
                                        </div>
                                        <span className="text-gray-500 text-sm bg-gray-100 px-2 py-0.5 rounded">{exp.date}</span>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        {exp.bullets?.map((bullet, j) => (
                                            <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                                                <span className="text-teal-500 mt-1">•</span>
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
                        <h2 className="text-lg font-bold text-teal-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-teal-500"></span>
                            Projects
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {projects.map((proj, i) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h3 className="font-bold text-gray-800">{proj.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-teal-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-teal-500"></span>
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
