export type SectionType = "contact" | "summary" | "skills" | "experience" | "projects" | "education" | "certifications";

// Contact info for header
export interface ContactInfo {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    photo?: string; // Base64 or URL for profile photo
}

// Experience entry
export interface ExperienceEntry {
    role: string;
    company: string;
    date: string;
    bullets: string[];
}

// Project entry
export interface ProjectEntry {
    name: string;
    description: string;
    bullets?: string[];
    technologies?: string[];
    url?: string;
}

// Education entry
export interface EducationEntry {
    school: string;
    degree: string;
    year: string;
    gpa?: string;
    achievements?: string[];
}

// Certification entry
export interface CertificationEntry {
    name: string;
    issuer: string;
    date?: string;
    url?: string;
}

// Type-safe section content types
export type SectionContent = 
    | string // summary
    | string[] // skills
    | ContactInfo // contact
    | ExperienceEntry[] // experience
    | ProjectEntry[] // projects
    | EducationEntry[] // education
    | CertificationEntry[]; // certifications

export interface ResumeSection {
    id: string;
    type: SectionType;
    content: SectionContent;
    order: number;
}

export interface Resume {
    id: string;
    userId: string;
    title: string;
    templateId: string;
    sections: ResumeSection[];
    jobDescription?: string; // Store target JD for tailoring
    atsScore?: number; // ATS compatibility score
    createdAt: Date;
    updatedAt: Date;
}

// JD Analysis result
export interface JDAnalysis {
    role: string;
    seniority: string;
    requiredSkills: string[];
    preferredSkills: string[];
    keywords: string[];
    industry: string;
}

// ATS Score result
export interface ATSScore {
    overall: number; // 0-100
    keywordMatch: number;
    formatting: number;
    sectionCompleteness: number;
    missingKeywords: string[];
    suggestions: string[];
    redFlags: string[];
}

export interface Template {
    id: string;
    name: string;
    layout: "single-column" | "two-column";
    font: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
    };
}
