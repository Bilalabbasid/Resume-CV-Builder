import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function GradientTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-gradient-to-br from-violet-50 to-pink-50 text-gray-800 h-full min-h-[11in] font-sans overflow-hidden" id="resume-preview">
            {/* Gradient Header */}
            <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white px-8 py-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold break-words">
                        {contact?.fullName || "Your Name"}
                    </h1>
                    <div className="mt-3 flex flex-wrap gap-4 text-white/90 text-sm">
                        {contact?.email && <span>📧 {contact.email}</span>}
                        {contact?.phone && <span>📱 {contact.phone}</span>}
                        {contact?.location && <span>📍 {contact.location}</span>}
                    </div>
                    <div className="mt-2 flex gap-3">
                        {contact?.linkedin && (
                            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/20 px-3 py-1 rounded-full text-xs hover:bg-white/30">LinkedIn</a>
                        )}
                        {contact?.github && (
                            <a href={contact.github} target="_blank" rel="noopener noreferrer" className="bg-white/20 px-3 py-1 rounded-full text-xs hover:bg-white/30">GitHub</a>
                        )}
                        {contact?.portfolio && (
                            <a href={contact.portfolio} target="_blank" rel="noopener noreferrer" className="bg-white/20 px-3 py-1 rounded-full text-xs hover:bg-white/30">Portfolio</a>
                        )}
                    </div>
                </div>
            </header>

            <div className="px-8 py-8">
                {/* Summary */}
                {summary && (
                    <section className="mb-8">
                        <h2 className="text-base font-bold text-gray-900 uppercase mb-2">About Me</h2>
                        <p className="text-gray-600 leading-relaxed">{summary}</p>
                    </section>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-base font-bold text-gray-900 uppercase mb-4">Skills & Technologies</h2>
                        <ul className="list-disc list-outside ml-5 flex flex-wrap gap-x-6 gap-y-1">
                            {skills.map((skill, i) => (
                                <li key={i} className="text-xs text-gray-700" style={{ flexBasis: 'calc(20% - 1.5rem)', minWidth: 'fit-content' }}>{skill}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-base font-bold text-gray-900 uppercase mb-4">Work Experience</h2>
                        <div className="space-y-4">
                            {experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                                            <p className="text-purple-600 font-medium">{exp.company}</p>
                                        </div>
                                        <span className="text-gray-500 text-sm bg-purple-50 px-3 py-1 rounded-full">{exp.date}</span>
                                    </div>
                                    <ul className="mt-3 space-y-2">
                                        {exp.bullets?.slice(0, 4).map((bullet, j) => (
                                            <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                                                <span className="text-purple-500 mt-0.5">✦</span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects & Education */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-base font-bold text-gray-900 uppercase mb-4">Projects</h2>
                            <div className="space-y-3">
                                {projects.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                        {proj.description && (
                                            <p className="text-gray-600 text-xs italic mt-1">{proj.description}</p>
                                        )}
                                        {proj.bullets && proj.bullets.length > 0 && (
                                            <ul className="mt-2 space-y-1">
                                                {proj.bullets.slice(0, 3).map((bullet, j) => (
                                                    <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                                                        <span className="text-purple-500 mt-0.5">✦</span>
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
                        <section>
                            <h2 className="text-base font-bold text-gray-900 uppercase mb-4">Education</h2>
                            <div className="space-y-3">
                                {education.map((edu, i) => (
                                    <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="text-purple-600 text-sm">{edu.school}</p>
                                        <p className="text-gray-500 text-xs">{edu.year}</p>
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
