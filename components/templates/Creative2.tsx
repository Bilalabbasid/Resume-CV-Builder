import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function Creative2Template({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-amber-50 text-gray-800 h-full min-h-[11in] font-sans relative" id="resume-preview">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-200 rounded-full -translate-y-24 translate-x-24 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-200 rounded-full translate-y-16 -translate-x-16 opacity-50"></div>
            
            <div className="relative p-10">
                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-end gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-rose-400 rounded-2xl flex items-center justify-center text-white text-3xl font-black">
                            {(contact?.fullName || "YN").split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900">
                                {contact?.fullName || "Your Name"}
                            </h1>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                                {contact?.email && <span>{contact.email}</span>}
                                {contact?.phone && <span>•</span>}
                                {contact?.phone && <span>{contact.phone}</span>}
                                {contact?.location && <span>•</span>}
                                {contact?.location && <span>{contact.location}</span>}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Summary */}
                {summary && (
                    <section className="mb-8 p-6 bg-white rounded-2xl shadow-sm">
                        <p className="text-gray-600 leading-relaxed text-lg">{summary}</p>
                    </section>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section className="mb-8">
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    i % 3 === 0 ? 'bg-amber-100 text-amber-800' :
                                    i % 3 === 1 ? 'bg-rose-100 text-rose-800' :
                                    'bg-orange-100 text-orange-800'
                                }`}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                            Work Experience
                        </h2>
                        <div className="space-y-4">
                            {experience.map((exp, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                                            <p className="text-amber-600 font-semibold">{exp.company}</p>
                                        </div>
                                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">{exp.date}</span>
                                    </div>
                                    <ul className="mt-3 space-y-2">
                                        {exp.bullets?.map((bullet, j) => (
                                            <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                                                <span className="text-amber-500 mt-1">→</span>
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
                <div className="grid grid-cols-2 gap-6">
                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-rose-400 rounded-full"></span>
                                Projects
                            </h2>
                            <div className="space-y-3">
                                {projects.map((proj, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl">
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
                            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                Education
                            </h2>
                            <div className="space-y-3">
                                {education.map((edu, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl">
                                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="text-amber-600 text-sm">{edu.school}</p>
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
