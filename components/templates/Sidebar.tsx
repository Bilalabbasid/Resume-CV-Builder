import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function SidebarTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-sans flex" id="resume-preview">
            {/* Blue Sidebar */}
            <aside className="w-1/3 bg-blue-700 text-white p-6">
                {/* Avatar/Initials */}
                <div className="mb-8">
                    <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold border-4 border-blue-500">
                        {(contact?.fullName || "YN").split(" ").map(n => n[0]).join("")}
                    </div>
                    <h1 className="text-xl font-bold text-center mt-4">{contact?.fullName || "Your Name"}</h1>
                </div>

                {/* Contact */}
                <section className="mb-6">
                    <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-blue-300 border-b border-blue-500 pb-1">Contact</h3>
                    <div className="space-y-2 text-sm text-blue-100">
                        {contact?.email && <p>📧 {contact.email}</p>}
                        {contact?.phone && <p>📱 {contact.phone}</p>}
                        {contact?.location && <p>📍 {contact.location}</p>}
                        {contact?.linkedin && <p>🔗 LinkedIn</p>}
                        {contact?.github && <p>💻 GitHub</p>}
                    </div>
                </section>

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-blue-300 border-b border-blue-500 pb-1">Skills</h3>
                        <div className="flex flex-wrap gap-1">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-blue-600 px-2 py-1 rounded text-xs mb-1">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-blue-300 border-b border-blue-500 pb-1">Education</h3>
                        <div className="space-y-3">
                            {education.map((edu, i) => (
                                <div key={i} className="text-sm">
                                    <p className="font-semibold">{edu.degree}</p>
                                    <p className="text-blue-200">{edu.school}</p>
                                    <p className="text-blue-300 text-xs">{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages or certifications could go here */}
            </aside>

            {/* Main Content */}
            <main className="w-2/3 p-8">
                {/* Summary */}
                {summary && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-blue-700 uppercase tracking-wide mb-2 border-b-2 border-blue-700 pb-1">
                            About Me
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm">{summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-blue-700 uppercase tracking-wide mb-4 border-b-2 border-blue-700 pb-1">
                            Work Experience
                        </h2>
                        <div className="space-y-5">
                            {experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                        <span className="text-sm text-gray-500">{exp.date}</span>
                                    </div>
                                    <p className="text-blue-600 font-medium text-sm mb-2">{exp.company}</p>
                                    <ul className="space-y-1">
                                        {exp.bullets?.map((bullet, j) => (
                                            <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                                                <span className="text-blue-500 mt-1">▸</span>
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
                        <h2 className="text-lg font-bold text-blue-700 uppercase tracking-wide mb-4 border-b-2 border-blue-700 pb-1">
                            Projects
                        </h2>
                        <div className="space-y-3">
                            {projects.map((proj, i) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
