import { Resume, ContactInfo, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/resume";

export function SingleColumnTemplate({ resume }: { resume: Resume }) {
    if (!resume) return null;

    const contactSection = resume.sections.find(s => s.type === "contact");
    const contact = contactSection?.content as ContactInfo | undefined;
    const summary = resume.sections.find(s => s.type === "summary")?.content as string | undefined;
    const skills = resume.sections.find(s => s.type === "skills")?.content as string[] | undefined;
    const experience = resume.sections.find(s => s.type === "experience")?.content as ExperienceEntry[] | undefined;
    const projects = resume.sections.find(s => s.type === "projects")?.content as ProjectEntry[] | undefined;
    const education = resume.sections.find(s => s.type === "education")?.content as EducationEntry[] | undefined;

    return (
        <div className="bg-white text-black p-8 h-full min-h-[11in] shadow-lg font-sans text-sm leading-relaxed" id="resume-preview">
            {/* Header */}
            <header className="border-b-2 border-black pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wider mb-1">
                    {contact?.fullName || "YOUR NAME"}
                </h1>
                <div className="text-gray-600 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {contact?.email && <span>{contact.email}</span>}
                    {contact?.phone && <><span>•</span><span>{contact.phone}</span></>}
                    {contact?.location && <><span>•</span><span>{contact.location}</span></>}
                    {contact?.linkedin && <><span>•</span><a href={contact.linkedin} className="text-blue-600 hover:underline">LinkedIn</a></>}
                    {contact?.github && <><span>•</span><a href={contact.github} className="text-blue-600 hover:underline">GitHub</a></>}
                    {contact?.portfolio && <><span>•</span><a href={contact.portfolio} className="text-blue-600 hover:underline">Portfolio</a></>}
                    {!contact && (
                        <>
                            <span>email@example.com</span>
                            <span>•</span>
                            <span>(555) 123-4567</span>
                            <span>•</span>
                            <span>City, State</span>
                        </>
                    )}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-6">
                    <h2 className="font-bold text-lg uppercase border-b border-gray-300 mb-2">Summary</h2>
                    <p>{summary}</p>
                </section>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold text-lg uppercase border-b border-gray-300 mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, i) => (
                            <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">{skill}</span>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold text-lg uppercase border-b border-gray-300 mb-2">Experience</h2>
                    <div className="space-y-4">
                        {experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between font-bold">
                                    <span>{exp.role}</span>
                                    <span>{exp.date || "Date"}</span>
                                </div>
                                <div className="text-gray-700 italic mb-1">{exp.company}</div>
                                <ul className="list-disc list-outside ml-4 space-y-1">
                                    {exp.bullets?.map((b, j) => (
                                        <li key={j}>{b}</li>
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
                    <h2 className="font-bold text-lg uppercase border-b border-gray-300 mb-2">Projects</h2>
                    <div className="space-y-3">
                        {projects.map((proj, i) => (
                            <div key={i}>
                                <div className="font-bold">{proj.name}</div>
                                <p className="text-gray-700">{proj.description}</p>
                                {proj.bullets && proj.bullets.length > 0 && (
                                    <ul className="list-disc list-outside ml-4 space-y-1 mt-1">
                                        {proj.bullets.map((b, j) => (
                                            <li key={j}>{b}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold text-lg uppercase border-b border-gray-300 mb-2">Education</h2>
                    <div className="space-y-3">
                        {education.map((edu, i) => (
                            <div key={i}>
                                <div className="font-bold">{edu.school}</div>
                                <div className="flex justify-between">
                                    <span>{edu.degree}</span>
                                    <span>{edu.year}</span>
                                </div>
                                {edu.gpa && <div className="text-gray-600 text-xs">GPA: {edu.gpa}</div>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
