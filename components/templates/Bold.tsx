import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function BoldTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-gray-900 text-white h-full min-h-[11in] font-sans" id="resume-preview">
            {/* Bold Header */}
            <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-8 py-10">
                <h1 className="text-5xl font-black uppercase tracking-tight">
                    {contact?.fullName || "Your Name"}
                </h1>
                <div className="mt-4 flex flex-wrap gap-4 text-white/90 text-sm font-medium">
                    {contact?.email && <span>{contact.email}</span>}
                    {contact?.phone && <span>•</span>}
                    {contact?.phone && <span>{contact.phone}</span>}
                    {contact?.location && <span>•</span>}
                    {contact?.location && <span>{contact.location}</span>}
                </div>
                <div className="mt-2 flex gap-4 text-white/70 text-sm">
                    {contact?.linkedin && <span>LinkedIn</span>}
                    {contact?.github && <span>GitHub</span>}
                    {contact?.portfolio && <span>Portfolio</span>}
                </div>
            </header>

            <div className="px-8 py-8">
                {/* Summary */}
                {summary && (
                    <section className="mb-8">
                        <p className="text-gray-300 leading-relaxed text-lg border-l-4 border-orange-500 pl-4">
                            {summary}
                        </p>
                    </section>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-black text-orange-500 mb-4 uppercase">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-gray-800 text-white px-4 py-2 rounded font-bold text-sm border border-gray-700">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-black text-orange-500 mb-6 uppercase">Experience</h2>
                        <div className="space-y-6">
                            {experience.map((exp, i) => (
                                <div key={i} className="bg-gray-800 p-5 rounded-lg border-l-4 border-orange-500">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                                            <p className="text-orange-400 font-semibold">{exp.company}</p>
                                        </div>
                                        <span className="text-gray-400 text-sm bg-gray-900 px-3 py-1 rounded">{exp.date}</span>
                                    </div>
                                    <ul className="mt-3 space-y-2">
                                        {exp.bullets?.map((bullet, j) => (
                                            <li key={j} className="text-gray-300 text-sm flex items-start gap-2">
                                                <span className="text-orange-500 font-bold">→</span>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects & Education Grid */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black text-orange-500 mb-4 uppercase">Projects</h2>
                            <div className="space-y-3">
                                {projects.map((proj, i) => (
                                    <div key={i} className="bg-gray-800 p-4 rounded">
                                        <h3 className="font-bold text-white">{proj.name}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black text-orange-500 mb-4 uppercase">Education</h2>
                            <div className="space-y-3">
                                {education.map((edu, i) => (
                                    <div key={i} className="bg-gray-800 p-4 rounded">
                                        <h3 className="font-bold text-white">{edu.degree}</h3>
                                        <p className="text-gray-400 text-sm">{edu.school}</p>
                                        <p className="text-orange-400 text-sm">{edu.year}</p>
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
