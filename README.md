# AI Resume Builder

A modern, AI-powered resume builder that generates professional, ATS-optimized resumes in seconds.

## Features

### Zero-Friction Resume Generation
- **Paste Job Description → Get Resume**: Just paste a JD and provide minimal info - AI does the rest
- **60-Second Flow**: 3 screens from JD to downloadable resume
- **Smart AI Expansion**: AI generates bullet points from just company name and role

### AI Capabilities
- **JD Analysis**: Extracts role, skills, keywords, and seniority from job descriptions
- **ATS Optimization**: Real-time ATS scoring with actionable suggestions
- **One-Click Enhancements**: Make it more senior, optimize for ATS, shorten, or change tone
- **Cover Letter Generator**: AI-generated cover letters tailored to each job

### Templates
- **20+ Professional Templates**: ATS-Friendly, Modern, Creative, Professional categories
- **Photo Templates**: Templates with profile photo support
- **Live Preview**: Real-time template preview as you edit

### Export Options
- **PDF Export**: Print-ready PDFs with proper formatting
- **DOCX Export**: Editable Word documents

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.5 Flash
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: Puppeteer
- **DOCX Generation**: docx library

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Bilalabbasid/Resume-CV-Builder.git
cd Resume-CV-Builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

5. Set up the database:
   - Go to your Supabase Dashboard → SQL Editor
   - Copy and paste contents of `db/schema.sql`
   - Run the query

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── generate/     # Resume generation
│   │   ├── analyze-jd/   # JD analysis
│   │   ├── ats-score/    # ATS scoring
│   │   ├── enhance/      # Content enhancement
│   │   ├── cover-letter/ # Cover letter generation
│   │   ├── export/       # PDF export
│   │   └── export-docx/  # DOCX export
│   ├── create/           # Resume creation wizard
│   ├── quick/            # Zero-friction JD→Resume flow
│   ├── editor/           # Resume editor
│   ├── templates/        # Template gallery
│   └── dashboard/        # User dashboard
├── components/
│   ├── templates/        # Resume template components
│   ├── features/         # Feature components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── gemini.ts         # Gemini AI configuration
│   ├── supabase.ts       # Supabase client
│   └── templates.ts      # Template registry
├── types/
│   └── resume.ts         # TypeScript types
└── db/
    └── schema.sql        # Database schema
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/generate` | POST | Generate resume from prompt |
| `/api/analyze-jd` | POST | Analyze job description |
| `/api/ats-score` | POST | Calculate ATS score |
| `/api/enhance` | POST | Enhance text with AI |
| `/api/cover-letter` | POST | Generate cover letter |
| `/api/export/[id]` | GET | Export resume as PDF |
| `/api/export-docx/[id]` | GET | Export resume as DOCX |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `GEMINI_API_KEY` | Google Gemini API key |

## Database Schema

The app uses the following tables:
- `resumes` - User resumes with sections stored as JSONB
- `cover_letters` - Generated cover letters
- `user_profiles` - User preferences and saved info
- `templates` - Custom templates (optional)

See `db/schema.sql` for full schema.

## License

MIT

## Author

Bilal Abbasi
