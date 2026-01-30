import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function PhotoMinimalTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    const photoUrl = (contact as ContactInfo & { photo?: string })?.photo;

    return (
        <div className="bg-white text-gray-900 h-full min-h-[11in] font-sans p-10" id="resume-preview">
            {/* Clean Header with Small Photo */}
            <header className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                {/* Small circular photo */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {photoUrl ? (
                        <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-2xl font-bold text-gray-400">
                            {(contact?.fullName || "YN").split(" ").map(n => n[0]).join("")}
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{contact?.fullName || "Your Name"}</h1>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                        {contact?.email && <span>{contact.email}</span>}
                        {contact?.phone && <span>|</span>}
                        {contact?.phone && <span>{contact.phone}</span>}
                        {contact?.location && <span>|</span>}
                        {contact?.location && <span>{contact.location}</span>}
                    </div>
                    <div className="flex gap-3 mt-1 text-sm text-gray-500">
                        {contact?.linkedin && <a className="hover:text-blue-600">LinkedIn</a>}
                        {contact?.github && <a className="hover:text-blue-600">GitHub</a>}
                        {contact?.portfolio && <a className="hover:text-blue-600">Portfolio</a>}
                    </div>
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-6">
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                        Experience
                    </h2>
                    <div className="space-y-5">
                        {experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                                    <span className="text-sm text-gray-500">{exp.date}</span>
                                </div>
                                <p className="text-gray-600 text-sm">{exp.company}</p>
                                <ul className="mt-2 space-y-1">
                                    {exp.bullets?.map((bullet, j) => (
                                        <li key={j} className="text-gray-600 text-sm pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
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
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                        Projects
                    </h2>
                    <div className="space-y-3">
                        {projects.map((proj, i) => (
                            <div key={i}>
                                <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                                <p className="text-gray-600 text-sm">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills & Education Grid */}
            <div className="grid grid-cols-2 gap-8">
                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
                            Skills
                        </h2>
                        <p className="text-gray-700 text-sm">{skills.join(" • ")}</p>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
                            Education
                        </h2>
                        <div className="space-y-2">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <p className="font-semibold text-gray-900 text-sm">{edu.degree}</p>
                                    <p className="text-gray-600 text-sm">{edu.school} • {edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
