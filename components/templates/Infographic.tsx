import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function InfographicTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-sans flex" id="resume-preview">
            {/* Left Sidebar */}
            <aside className="w-1/3 bg-emerald-600 text-white p-6 flex flex-col">
                {/* Profile Circle */}
                <div className="mb-6 text-center">
                    <div className="w-28 h-28 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
                        <span className="text-4xl font-bold text-emerald-600">
                            {(contact?.fullName || "YN").split(" ").map(n => n[0]).join("")}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold">{contact?.fullName || "Your Name"}</h1>
                </div>

                {/* Contact */}
                <section className="mb-6">
                    <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-emerald-200">Contact</h3>
                    <div className="space-y-2 text-sm">
                        {contact?.email && (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs">✉</div>
                                <span className="text-emerald-100">{contact.email}</span>
                            </div>
                        )}
                        {contact?.phone && (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs">📞</div>
                                <span className="text-emerald-100">{contact.phone}</span>
                            </div>
                        )}
                        {contact?.location && (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs">📍</div>
                                <span className="text-emerald-100">{contact.location}</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* Skills with bars */}
                {skills && skills.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-emerald-200">Skills</h3>
                        <div className="space-y-3">
                            {skills.slice(0, 8).map((skill, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{skill}</span>
                                    </div>
                                    <div className="h-2 bg-emerald-700 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-white rounded-full" 
                                            style={{ width: `${85 - (i * 5)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section className="mt-auto">
                        <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-emerald-200">Education</h3>
                        <div className="space-y-3">
                            {education.map((edu, i) => (
                                <div key={i} className="text-sm">
                                    <p className="font-bold">{edu.degree}</p>
                                    <p className="text-emerald-200">{edu.school}</p>
                                    <p className="text-emerald-300 text-xs">{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </aside>

            {/* Main Content */}
            <main className="w-2/3 p-8">
                {/* Summary */}
                {summary && (
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-emerald-600 mb-3 flex items-center gap-2">
                            <span className="w-8 h-1 bg-emerald-500"></span>
                            About Me
                        </h2>
                        <p className="text-gray-600 leading-relaxed">{summary}</p>
                    </section>
                )}

                {/* Experience Timeline */}
                {experience && experience.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-emerald-600 mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-emerald-500"></span>
                            Experience
                        </h2>
                        <div className="relative">
                            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-emerald-200"></div>
                            <div className="space-y-6">
                                {experience.map((exp, i) => (
                                    <div key={i} className="relative pl-8">
                                        <div className="absolute left-0 w-5 h-5 bg-emerald-600 rounded-full border-4 border-white shadow"></div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{exp.date}</span>
                                            </div>
                                            <p className="text-emerald-600 font-medium text-sm mb-2">{exp.company}</p>
                                            <ul className="space-y-1">
                                                {exp.bullets?.slice(0, 3).map((bullet, j) => (
                                                    <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                                                        <span className="text-emerald-500 mt-1">•</span>
                                                        {bullet}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-emerald-500"></span>
                            Projects
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {projects.map((proj, i) => (
                                <div key={i} className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                                    <h3 className="font-bold text-gray-900 text-sm">{proj.name}</h3>
                                    <p className="text-gray-600 text-xs mt-1">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
