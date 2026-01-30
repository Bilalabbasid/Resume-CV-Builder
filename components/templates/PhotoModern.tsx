import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function PhotoModernTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contact = resume.sections.find(s => s.type === "contact")?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    // Get photo from contact or use placeholder
    const photoUrl = (contact as ContactInfo & { photo?: string })?.photo;
    const initials = (contact?.fullName || "YN").split(" ").map(n => n[0]).join("");

    return (
        <div className="bg-white text-gray-800 h-full min-h-[11in] font-sans" id="resume-preview">
            {/* Header with Photo */}
            <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6">
                <div className="flex items-center gap-6">
                    {/* Photo Circle */}
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white/20 flex-shrink-0">
                        {photoUrl ? (
                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/80">
                                {initials}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-wide">
                            {contact?.fullName || "Your Name"}
                        </h1>
                        <div className="mt-2 flex flex-wrap gap-3 text-blue-100 text-sm">
                            {contact?.email && <span>📧 {contact.email}</span>}
                            {contact?.phone && <span>📱 {contact.phone}</span>}
                            {contact?.location && <span>📍 {contact.location}</span>}
                        </div>
                        <div className="mt-1 flex gap-3 text-sm text-blue-200">
                            {contact?.linkedin && <span>LinkedIn</span>}
                            {contact?.github && <span>GitHub</span>}
                            {contact?.portfolio && <span>Portfolio</span>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-8 py-6">
                {/* Summary */}
                {summary && (
                    <section className="mb-6">
                        <p className="text-gray-600 leading-relaxed border-l-4 border-blue-500 pl-4">
                            {summary}
                        </p>
                    </section>
                )}

                {/* Skills */}
                {skills && skills.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-blue-500"></span>
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-blue-500"></span>
                            Experience
                        </h2>
                        <div className="space-y-4">
                            {experience.map((exp, i) => (
                                <div key={i} className="pl-4 border-l-2 border-gray-200">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{exp.role}</h3>
                                            <p className="text-blue-600 text-sm">{exp.company}</p>
                                        </div>
                                        <span className="text-gray-500 text-sm bg-gray-100 px-2 py-0.5 rounded">{exp.date}</span>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        {exp.bullets?.map((bullet, j) => (
                                            <li key={j} className="text-gray-600 text-sm flex items-start gap-2">
                                                <span className="text-blue-500">•</span>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education & Projects Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {education && education.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
                                <span className="w-6 h-0.5 bg-blue-500"></span>
                                Education
                            </h2>
                            <div className="space-y-2">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <p className="font-semibold text-gray-800">{edu.degree}</p>
                                        <p className="text-gray-600 text-sm">{edu.school} • {edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
                                <span className="w-6 h-0.5 bg-blue-500"></span>
                                Projects
                            </h2>
                            <div className="space-y-2">
                                {projects.map((proj, i) => (
                                    <div key={i}>
                                        <p className="font-semibold text-gray-800">{proj.name}</p>
                                        <p className="text-gray-600 text-sm">{proj.description}</p>
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
