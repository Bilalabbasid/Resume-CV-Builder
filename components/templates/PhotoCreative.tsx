import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function PhotoCreativeTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    const photoUrl = (contact as ContactInfo & { photo?: string })?.photo;
    const initials = (contact?.fullName || "YN").split(" ").map(n => n[0]).join("");

    return (
        <div className="bg-gray-50 text-gray-800 h-full min-h-[11in] font-sans flex" id="resume-preview">
            {/* Left Sidebar with Photo */}
            <aside className="w-1/3 bg-gradient-to-b from-purple-700 to-indigo-800 text-white p-6 flex flex-col">
                {/* Photo */}
                <div className="mb-6">
                    <div className="w-32 h-32 rounded-full border-4 border-white/30 shadow-xl overflow-hidden mx-auto bg-white/10">
                        {photoUrl ? (
                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/60">
                                {initials}
                            </div>
                        )}
                    </div>
                    <h1 className="text-xl font-bold text-center mt-4">{contact?.fullName || "Your Name"}</h1>
                </div>

                {/* Contact */}
                <section className="mb-6">
                    <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-purple-300 border-b border-purple-500/50 pb-1">Contact</h3>
                    <div className="space-y-2 text-sm text-purple-100">
                        {contact?.email && <p className="flex items-center gap-2"><span>✉</span> {contact.email}</p>}
                        {contact?.phone && <p className="flex items-center gap-2"><span>☎</span> {contact.phone}</p>}
                        {contact?.location && <p className="flex items-center gap-2"><span>📍</span> {contact.location}</p>}
                        {contact?.linkedin && <p className="flex items-center gap-2"><span>🔗</span> LinkedIn</p>}
                        {contact?.github && <p className="flex items-center gap-2"><span>💻</span> GitHub</p>}
                    </div>
                </section>

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-purple-300 border-b border-purple-500/50 pb-1">Skills</h3>
                        <div className="flex flex-wrap gap-1">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-white/10 px-2 py-1 rounded text-xs mb-1">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section className="mt-auto">
                        <h3 className="text-xs uppercase tracking-widest font-bold mb-3 text-purple-300 border-b border-purple-500/50 pb-1">Education</h3>
                        <div className="space-y-3">
                            {education.map((edu, i) => (
                                <div key={i} className="text-sm">
                                    <p className="font-semibold">{edu.degree}</p>
                                    <p className="text-purple-200 text-xs">{edu.school}</p>
                                    <p className="text-purple-300 text-xs">{edu.year}</p>
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
                        <h2 className="text-xl font-bold text-purple-700 mb-3">About Me</h2>
                        <p className="text-gray-600 leading-relaxed">{summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-purple-700 mb-4">Work Experience</h2>
                        <div className="space-y-5">
                            {experience.map((exp, i) => (
                                <div key={i} className="relative pl-6 border-l-2 border-purple-200">
                                    <div className="absolute -left-[5px] top-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{exp.role}</h3>
                                            <p className="text-purple-600 text-sm font-medium">{exp.company}</p>
                                        </div>
                                        <span className="text-gray-500 text-xs bg-purple-50 px-2 py-1 rounded">{exp.date}</span>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        {exp.bullets?.map((bullet, j) => (
                                            <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                                                <span className="text-purple-400 mt-0.5">▸</span>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
