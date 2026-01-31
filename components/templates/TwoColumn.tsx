import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function TwoColumnTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contactSection = resume.sections.find(s => s.type === "contact");
    const contact = contactSection?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-white text-black h-full min-h-[11in] shadow-lg font-sans text-sm flex overflow-hidden" id="resume-preview">

            {/* Sidebar */}
            <aside className="w-1/3 bg-gray-900 text-white p-6 overflow-hidden break-words">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold uppercase tracking-wider mb-2 text-white">
                        {contact?.fullName || "Your Name"}
                    </h1>
                    <div className="text-gray-400 text-xs flex flex-col gap-1">
                        {contact?.email && <span>{contact.email}</span>}
                        {contact?.phone && <span>{contact.phone}</span>}
                        {contact?.location && <span>{contact.location}</span>}
                        {contact?.linkedin && <a href={contact.linkedin} className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                        {contact?.github && <a href={contact.github} className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>}
                        {!contact && (
                            <>
                                <span>email@example.com</span>
                                <span>(555) 123-4567</span>
                                <span>City, State</span>
                            </>
                        )}
                    </div>
                </div>

                {skills && skills.length > 0 && (
                    <section className="mb-8">
                        <h3 className="font-bold text-sm uppercase text-purple-400 mb-3">Skills</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {skills.map((skill, i) => (
                                <li key={i} className="text-xs text-gray-200">{skill}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {summary && (
                    <section className="mb-8">
                        <h3 className="font-bold text-sm uppercase text-purple-400 mb-3">Summary</h3>
                        <p className="text-gray-300 text-xs leading-relaxed">{summary}</p>
                    </section>
                )}

                {education && education.length > 0 && (
                    <section>
                        <h3 className="font-bold text-sm uppercase text-purple-400 mb-3">Education</h3>
                        <div className="space-y-3">
                            {education.map((edu, i) => (
                                <div key={i} className="text-xs">
                                    <div className="font-semibold text-white">{edu.degree}</div>
                                    <div className="text-gray-400">{edu.school}</div>
                                    <div className="text-gray-500">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </aside>

            {/* Main Content */}
            <main className="w-2/3 p-8">
                {experience && experience.length > 0 && (
                    <section className="mb-8">
                        <h2 className="font-bold text-base uppercase text-gray-800 mb-4">Experience</h2>
                        <div className="space-y-6">
                            {experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-bold text-lg">{exp.role}</span>
                                        <span className="text-sm text-gray-500">{exp.date}</span>
                                    </div>
                                    <div className="text-purple-600 font-medium mb-2">{exp.company}</div>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700">
                                        {exp.bullets?.slice(0, 4).map((b, j) => (
                                            <li key={j}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {projects && projects.length > 0 && (
                    <section>
                        <h2 className="font-bold text-base uppercase text-gray-800 mb-4">Projects</h2>
                        <div className="space-y-4">
                            {projects.map((proj, i) => (
                                <div key={i}>
                                    <div className="font-bold text-base">{proj.name}</div>
                                    {proj.description && <p className="text-gray-600 mt-1 text-xs italic">{proj.description}</p>}
                                    {proj.bullets && proj.bullets.length > 0 && (
                                        <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700 mt-1">
                                            {proj.bullets.slice(0, 3).map((b, j) => (
                                                <li key={j}>{b}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

        </div>
    );
}
