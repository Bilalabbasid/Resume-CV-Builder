export interface TemplateMeta {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    category: "Professional" | "Creative" | "Simple" | "Modern" | "ATS-Friendly" | "Photo";
    popular?: boolean;
    new?: boolean;
    color?: string;
    hasPhoto?: boolean; // Supports profile photo
}

export const TEMPLATES: TemplateMeta[] = [
    // Photo Templates (NEW!)
    {
        id: "photo-modern",
        name: "Photo Modern",
        description: "Modern resume with profile photo. Great for roles where personal branding matters.",
        thumbnail: "preview-photo",
        category: "Photo",
        new: true,
        popular: true,
        color: "bg-gradient-to-r from-blue-500 to-indigo-600",
        hasPhoto: true
    },
    {
        id: "photo-creative",
        name: "Photo Creative",
        description: "Creative sidebar layout with profile photo. Perfect for design roles.",
        thumbnail: "preview-photo",
        category: "Photo",
        new: true,
        color: "bg-gradient-to-b from-purple-700 to-indigo-800",
        hasPhoto: true
    },
    {
        id: "photo-professional",
        name: "Photo Professional",
        description: "Classic professional resume with photo. Traditional yet modern.",
        thumbnail: "preview-photo",
        category: "Photo",
        new: true,
        color: "bg-gray-800",
        hasPhoto: true
    },

    // ATS-Friendly Templates
    {
        id: "single-column",
        name: "Classic",
        description: "Clean, ATS-friendly single column layout. Best for corporate roles.",
        thumbnail: "preview-single",
        category: "ATS-Friendly",
        popular: true,
        color: "bg-blue-500"
    },
    {
        id: "professional",
        name: "Professional",
        description: "Traditional serif font resume. Perfect for law, finance, consulting.",
        thumbnail: "preview-single",
        category: "ATS-Friendly",
        color: "bg-gray-700"
    },
    {
        id: "clean",
        name: "Clean",
        description: "Minimal design with clear sections. ATS-optimized and reader-friendly.",
        thumbnail: "preview-minimal",
        category: "ATS-Friendly",
        popular: true,
        color: "bg-slate-500"
    },

    // Modern Templates
    {
        id: "two-column",
        name: "Modern Sidebar",
        description: "Contemporary two-column design with a dark sidebar. Great for tech.",
        thumbnail: "preview-sidebar",
        category: "Modern",
        color: "bg-purple-600"
    },
    {
        id: "modern-pro",
        name: "Teal Modern",
        description: "Modern design with teal accents. Professional yet contemporary.",
        thumbnail: "preview-sidebar",
        category: "Modern",
        new: true,
        color: "bg-teal-500"
    },
    {
        id: "modern-2024",
        name: "2024 Style",
        description: "Latest design trends with dark header and skill pills.",
        thumbnail: "preview-sidebar",
        category: "Modern",
        new: true,
        popular: true,
        color: "bg-zinc-800"
    },
    {
        id: "gradient",
        name: "Gradient",
        description: "Vibrant purple-pink gradient header. Stand out from the crowd.",
        thumbnail: "preview-creative",
        category: "Modern",
        new: true,
        color: "bg-gradient-to-r from-violet-500 to-pink-500"
    },

    // Creative Templates
    {
        id: "creative",
        name: "Bold Creative",
        description: "Stand out with vibrant indigo headers and timeline layout.",
        thumbnail: "preview-creative",
        category: "Creative",
        popular: true,
        color: "bg-indigo-600"
    },
    {
        id: "creative-2",
        name: "Warm Creative",
        description: "Friendly amber tones with rounded elements. Great for marketing.",
        thumbnail: "preview-creative",
        category: "Creative",
        new: true,
        color: "bg-amber-500"
    },
    {
        id: "bold",
        name: "Dark Bold",
        description: "Dark theme with orange accents. Perfect for developers and designers.",
        thumbnail: "preview-creative",
        category: "Creative",
        new: true,
        color: "bg-gray-900"
    },
    {
        id: "infographic",
        name: "Infographic",
        description: "Visual resume with skill bars and timeline. Eye-catching design.",
        thumbnail: "preview-creative",
        category: "Creative",
        new: true,
        color: "bg-emerald-600"
    },

    // Professional Templates  
    {
        id: "corporate",
        name: "Corporate",
        description: "Navy blue professional template. Ideal for executives.",
        thumbnail: "preview-single",
        category: "Professional",
        color: "bg-slate-800"
    },
    {
        id: "elegant",
        name: "Elegant",
        description: "Serif typography with centered header. Sophisticated and refined.",
        thumbnail: "preview-minimal",
        category: "Professional",
        new: true,
        color: "bg-gray-600"
    },
    {
        id: "sidebar",
        name: "Blue Sidebar",
        description: "Blue sidebar with main content area. Great for all industries.",
        thumbnail: "preview-sidebar",
        category: "Professional",
        color: "bg-blue-700"
    },
    {
        id: "exec-1",
        name: "Executive",
        description: "High-impact layout for C-level and senior roles.",
        thumbnail: "preview-single",
        category: "Professional",
        color: "bg-indigo-700"
    },

    // Simple Templates
    {
        id: "minimalist",
        name: "Minimalist",
        description: "Whitespace-heavy design that puts focus purely on your content.",
        thumbnail: "preview-minimal",
        category: "Simple",
        color: "bg-gray-400"
    },

    // Industry-Specific
    {
        id: "tech-1",
        name: "Tech Modern",
        description: "Technical skill focused layout for developers and engineers.",
        thumbnail: "preview-sidebar",
        category: "Modern",
        color: "bg-cyan-600"
    },
    {
        id: "art-1",
        name: "Portfolio",
        description: "Creative portfolio style for designers and artists.",
        thumbnail: "preview-creative",
        category: "Creative",
        color: "bg-rose-500"
    },
    {
        id: "acad-1",
        name: "Academic",
        description: "Detailed CV format for researchers and academics.",
        thumbnail: "preview-minimal",
        category: "Professional",
        color: "bg-green-600"
    },
    {
        id: "start-1",
        name: "Startup",
        description: "Modern and energetic with gradients for startup roles.",
        thumbnail: "preview-creative",
        category: "Creative",
        color: "bg-orange-500"
    },
    {
        id: "fin-1",
        name: "Finance",
        description: "Traditional and conservative for banking and finance.",
        thumbnail: "preview-single",
        category: "Professional",
        color: "bg-emerald-700"
    },
];

export function getTemplate(id: string) {
    return TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
}
