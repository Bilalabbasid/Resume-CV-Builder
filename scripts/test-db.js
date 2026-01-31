// Test database connection
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim();
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
console.log('Key:', supabaseKey ? '✓ Set' : '✗ Missing');

if (!supabaseUrl || !supabaseKey) {
    console.error('\n❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection by checking resumes table
async function testConnection() {
    try {
        console.log('\nTesting database connection...');
        const { data, error } = await supabase
            .from('resumes')
            .select('id')
            .limit(1);

        if (error) {
            console.error('❌ Database Error:', error.message);
            console.log('\n💡 Make sure you have run the schema.sql file in your Supabase dashboard');
            console.log('   Go to: Supabase Dashboard > SQL Editor > New Query > Paste schema.sql content > Run');
            process.exit(1);
        }

        console.log('✅ Database connection successful!');
        console.log('✅ Resumes table is accessible');
        
        // Count resumes
        const { count } = await supabase
            .from('resumes')
            .select('*', { count: 'exact', head: true });
            
        console.log(`📊 Total resumes in database: ${count || 0}`);
        console.log('\n✅ Everything is working! You can now create resumes.');
    } catch (err) {
        console.error('❌ Connection test failed:', err.message);
        process.exit(1);
    }
}

testConnection();
