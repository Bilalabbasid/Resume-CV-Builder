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
        <div className="bg-gradient-to-br from-violet-50 to-pink-50 text-gray-800 h-full min-h-[11in] font-sans" id="resume-preview">
            {/* Gradient Header */}
            <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white px-8 py-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold">
                        {contact?.fullName || "Your Name"}
                    </h1>
                    <div className="mt-3 flex flex-wrap gap-4 text-white/90 text-sm">
                        {contact?.email && <span>📧 {contact.email}</span>}
                        {contact?.phone && <span>📱 {contact.phone}</span>}
                        {contact?.location && <span>📍 {contact.location}</span>}
                    </div>
                    <div className="mt-2 flex gap-3">
                        {contact?.linkedin && (
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">LinkedIn</span>
                        )}
                        {contact?.github && (
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">GitHub</span>
                        )}
                        {contact?.portfolio && (
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Portfolio</span>
                        )}
                    </div>
                </div>
            </header>

            <div className="px-8 py-8">
                {/* Summary */}
                {summary && (
                    <section className="mb-8 bg-white rounded-xl p-5 shadow-sm border border-purple-100">
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-2">About Me</h2>
                        <p className="text-gray-600 leading-relaxed">{summary}</p>
                    </section>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-4">Skills & Technologies</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-4">Work Experience</h2>
                        <div className="space-y-4">
                            {experience.map((exp, i) => (
                                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{exp.role}</h3>
                                            <p className="text-purple-600 font-medium">{exp.company}</p>
                                        </div>
                                        <span className="text-gray-500 text-sm bg-purple-50 px-3 py-1 rounded-full">{exp.date}</span>
                                    </div>
                                    <ul className="mt-3 space-y-2">
                                        {exp.bullets?.map((bullet, j) => (
                                            <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                                                <span className="text-purple-500 mt-0.5">✦</span>
                                                {bullet}
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
                            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-4">Projects</h2>
                            <div className="space-y-3">
                                {projects.map((proj, i) => (
                                    <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                                        <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-4">Education</h2>
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
