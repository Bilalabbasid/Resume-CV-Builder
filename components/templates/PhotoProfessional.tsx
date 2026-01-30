import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function PhotoProfessionalTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    const photoUrl = (contact as ContactInfo & { photo?: string })?.photo;
    const initials = (contact?.fullName || "YN").split(" ").map(n => n[0]).join("");

    return (
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-serif p-8" id="resume-preview">
            {/* Header with Photo */}
            <header className="flex items-start gap-6 pb-6 border-b-2 border-gray-800 mb-6">
                {/* Photo */}
                <div className="w-28 h-28 rounded border-2 border-gray-300 overflow-hidden bg-gray-100 flex-shrink-0">
                    {photoUrl ? (
                        <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                            {initials}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-wide uppercase">
                        {contact?.fullName || "Your Name"}
                    </h1>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {contact?.email && <span>Email: {contact.email}</span>}
                        {contact?.phone && <span>Phone: {contact.phone}</span>}
                        {contact?.location && <span>Location: {contact.location}</span>}
                        {contact?.linkedin && <span>LinkedIn: Available</span>}
                    </div>
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2">Professional Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-3 pb-1 border-b border-gray-300">
                        Professional Experience
                    </h2>
                    <div className="space-y-4">
                        {experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                    <span className="text-sm text-gray-600">{exp.date}</span>
                                </div>
                                <p className="text-gray-700 italic">{exp.company}</p>
                                <ul className="mt-2 space-y-1">
                                    {exp.bullets?.map((bullet, j) => (
                                        <li key={j} className="text-gray-700 text-sm pl-4 relative before:content-['•'] before:absolute before:left-0">
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Two Column: Education & Skills */}
            <div className="grid grid-cols-2 gap-8">
                {/* Education */}
                {education && education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2 pb-1 border-b border-gray-300">
                            Education
                        </h2>
                        <div className="space-y-2">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <p className="font-bold text-gray-900">{edu.degree}</p>
                                    <p className="text-gray-700 text-sm">{edu.school} — {edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2 pb-1 border-b border-gray-300">
                            Skills
                        </h2>
                        <p className="text-gray-700 text-sm">{skills.join(" • ")}</p>
                    </section>
                )}
            </div>

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section className="mt-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-2 pb-1 border-b border-gray-300">
                        Key Projects
                    </h2>
                    <div className="space-y-2">
                        {projects.map((proj, i) => (
                            <div key={i}>
                                <p className="font-bold text-gray-900">{proj.name}</p>
                                <p className="text-gray-700 text-sm">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
