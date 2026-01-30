/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');

// Connection string with URL-encoded username (dot as %2E)
const connectionString = 'postgresql://postgres%2Efthipuzfmuuxrxaynyun:F4zar6gVB4XX5odB@aws-1-ap-south-1.pooler.supabase.com:5432/postgres';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log('🔌 Connecting to Supabase PostgreSQL...');
        await client.connect();
        console.log('✅ Connected successfully!');

        console.log('📝 Running schema migration...');

        // Run each table creation separately
        const statements = [
            // UUID extension
            `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
            
            // Resumes table
            `CREATE TABLE IF NOT EXISTS resumes (
                id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
                user_id text NOT NULL,
                title text NOT NULL,
                template_id text NOT NULL,
                sections jsonb NOT NULL DEFAULT '[]'::jsonb,
                job_description text,
                ats_score integer,
                jd_match_score integer,
                is_ai_generated boolean DEFAULT false,
                version integer DEFAULT 1,
                created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
                updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
            )`,
            
            // Indexes for resumes
            `CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON resumes(user_id)`,
            `CREATE INDEX IF NOT EXISTS resumes_created_at_idx ON resumes(created_at DESC)`,
            `CREATE INDEX IF NOT EXISTS resumes_template_id_idx ON resumes(template_id)`,
            
            // Cover letters table
            `CREATE TABLE IF NOT EXISTS cover_letters (
                id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
                resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
                user_id text NOT NULL,
                content text NOT NULL,
                job_description text,
                company_name text,
                role_name text,
                created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
            )`,
            
            // Indexes for cover letters
            `CREATE INDEX IF NOT EXISTS cover_letters_resume_id_idx ON cover_letters(resume_id)`,
            `CREATE INDEX IF NOT EXISTS cover_letters_user_id_idx ON cover_letters(user_id)`,
            
            // Templates table
            `CREATE TABLE IF NOT EXISTS templates (
                id text PRIMARY KEY,
                name text NOT NULL,
                description text,
                category text NOT NULL,
                layout text NOT NULL DEFAULT 'single-column',
                has_photo boolean DEFAULT false,
                is_premium boolean DEFAULT false,
                colors jsonb NOT NULL DEFAULT '{}'::jsonb,
                created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
            )`,
            
            // User profiles table
            `CREATE TABLE IF NOT EXISTS user_profiles (
                id text PRIMARY KEY,
                email text,
                full_name text,
                phone text,
                location text,
                linkedin text,
                github text,
                portfolio text,
                photo_url text,
                default_template_id text,
                created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
                updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
            )`,
            
            // JD analysis cache table
            `CREATE TABLE IF NOT EXISTS jd_analysis_cache (
                id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
                jd_hash text UNIQUE NOT NULL,
                analysis jsonb NOT NULL,
                created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
            )`,
            
            // Index for JD cache
            `CREATE INDEX IF NOT EXISTS jd_analysis_hash_idx ON jd_analysis_cache(jd_hash)`
        ];

        let successCount = 0;
        let skipCount = 0;

        for (const sql of statements) {
            try {
                await client.query(sql);
                successCount++;
                process.stdout.write('✓');
            } catch (err) {
                if (err.code === '42P07' || err.code === '42710' || err.message.includes('already exists')) {
                    skipCount++;
                    process.stdout.write('s');
                } else {
                    console.log('\n  ⚠️', err.message);
                }
            }
        }

        console.log('\n');
        console.log(`✅ Executed: ${successCount} statements`);
        console.log(`⏭ Skipped: ${skipCount} statements`);
        console.log('');
        console.log('🎉 Schema migration completed!');
        
        // Verify tables exist
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        
        console.log('');
        console.log('📊 Tables in database:');
        result.rows.forEach(row => {
            console.log(`   ✓ ${row.table_name}`);
        });

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await client.end();
        console.log('');
        console.log('🔌 Connection closed.');
    }
}

migrate();
