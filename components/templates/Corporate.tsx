import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function CorporateTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-sans" id="resume-preview">
            {/* Corporate Header - Navy Blue */}
            <header className="bg-slate-800 text-white px-8 py-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-wide">
                            {contact?.fullName || "Your Name"}
                        </h1>
                        {summary && (
                            <p className="mt-2 text-slate-300 text-sm max-w-xl">{summary}</p>
                        )}
                    </div>
                    <div className="text-right text-sm text-slate-300 space-y-1">
                        {contact?.email && <p>{contact.email}</p>}
                        {contact?.phone && <p>{contact.phone}</p>}
                        {contact?.location && <p>{contact.location}</p>}
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-1/3 bg-slate-100 p-6">
                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 border-b-2 border-slate-800 pb-1">
                                Core Competencies
                            </h2>
                            <ul className="space-y-2">
                                {skills.map((skill, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                        <span className="w-2 h-2 bg-slate-800 rounded-full"></span>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 border-b-2 border-slate-800 pb-1">
                                Education
                            </h2>
                            <div className="space-y-3">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <p className="font-semibold text-slate-800 text-sm">{edu.degree}</p>
                                        <p className="text-slate-600 text-xs">{edu.school}</p>
                                        <p className="text-slate-500 text-xs">{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Links */}
                    {(contact?.linkedin || contact?.github || contact?.portfolio) && (
                        <section>
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 border-b-2 border-slate-800 pb-1">
                                Links
                            </h2>
                            <div className="space-y-1 text-sm">
                                {contact?.linkedin && <p className="text-blue-600">LinkedIn</p>}
                                {contact?.github && <p className="text-blue-600">GitHub</p>}
                                {contact?.portfolio && <p className="text-blue-600">Portfolio</p>}
                            </div>
                        </section>
                    )}
                </aside>

                {/* Main Content */}
                <main className="w-2/3 p-6">
                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-slate-800 pb-1">
                                Professional Experience
                            </h2>
                            <div className="space-y-5">
                                {experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-slate-900">{exp.role}</h3>
                                            <span className="text-sm text-slate-600">{exp.date}</span>
                                        </div>
                                        <p className="text-slate-600 font-medium text-sm mb-2">{exp.company}</p>
                                        <ul className="space-y-1">
                                            {exp.bullets?.map((bullet, j) => (
                                                <li key={j} className="text-slate-600 text-sm flex items-start gap-2">
                                                    <span className="text-slate-400 mt-1">▸</span>
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
                        <section>
                            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-slate-800 pb-1">
                                Key Projects
                            </h2>
                            <div className="space-y-3">
                                {projects.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="font-semibold text-slate-900">{proj.name}</h3>
                                        <p className="text-slate-600 text-sm">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
