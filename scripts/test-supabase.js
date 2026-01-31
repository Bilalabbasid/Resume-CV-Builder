// Test Supabase Connection
// Run: node scripts/test-supabase.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 Checking Supabase Configuration...\n');

// Check URL
if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing!');
    process.exit(1);
} else {
    console.log('✅ Supabase URL:', supabaseUrl);
}

// Check Key
if (!supabaseKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!');
    process.exit(1);
} else {
    console.log('✅ Supabase Key length:', supabaseKey.length, 'characters');
    
    // Validate JWT structure
    const parts = supabaseKey.split('.');
    if (parts.length !== 3) {
        console.error('❌ API key is not a valid JWT (should have 3 parts separated by dots)');
        process.exit(1);
    }
    
    // Check signature length
    if (parts[2].length < 40) {
        console.error('⚠️  API key signature appears truncated!');
        console.error('   Expected ~43 characters, got:', parts[2].length);
        console.error('   Please get the full key from Supabase Dashboard > Settings > API');
    } else {
        console.log('✅ API key structure looks valid');
    }
}

// Test connection
async function testConnection() {
    console.log('\n🔌 Testing database connection...\n');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
        // Try to query the resumes table
        const { data, error } = await supabase
            .from('resumes')
            .select('id')
            .limit(1);
        
        if (error) {
            console.error('❌ Database query failed:', error.message);
            
            if (error.message.includes('Invalid API key')) {
                console.error('\n💡 Your API key is invalid or incomplete.');
                console.error('   Please get the full key from your Supabase dashboard.');
            }
            
            if (error.message.includes('does not exist')) {
                console.error('\n💡 The "resumes" table does not exist.');
                console.error('   Run the schema.sql file in your Supabase SQL editor.');
            }
            
            process.exit(1);
        }
        
        console.log('✅ Database connection successful!');
        console.log('   Found', data?.length || 0, 'resume(s) in database');
        
        // Try to create a test resume
        console.log('\n📝 Testing resume creation...\n');
        
        const { data: newResume, error: createError } = await supabase
            .from('resumes')
            .insert([{
                title: 'Test Resume',
                user_id: 'test-user-' + Date.now(),
                template_id: 'modern-2024',
                sections: []
            }])
            .select()
            .single();
        
        if (createError) {
            console.error('❌ Failed to create test resume:', createError.message);
            process.exit(1);
        }
        
        console.log('✅ Successfully created test resume with ID:', newResume.id);
        
        // Clean up - delete the test resume
        await supabase.from('resumes').delete().eq('id', newResume.id);
        console.log('✅ Cleaned up test resume');
        
        console.log('\n🎉 All tests passed! Your Supabase configuration is working correctly.\n');
        
    } catch (err) {
        console.error('❌ Connection test failed:', err.message);
        process.exit(1);
    }
}

testConnection();
