import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("⚠️ Missing Supabase credentials!");
    console.error("URL:", supabaseUrl ? "✓" : "✗ MISSING");
    console.error("Key:", supabaseKey ? "✓" : "✗ MISSING");
}

// Validate that the key looks like a valid JWT (should have 3 parts)
if (supabaseKey && supabaseKey.split('.').length !== 3) {
    console.error("⚠️ Supabase API key appears to be invalid or truncated!");
    console.error("Key length:", supabaseKey.length);
}

// Check if key signature part is too short (should be ~43 chars for HMAC-SHA256)
const keyParts = supabaseKey.split('.');
if (keyParts.length === 3 && keyParts[2].length < 40) {
    console.error("⚠️ Supabase API key signature appears truncated!");
    console.error("Expected ~43 chars, got:", keyParts[2].length);
    console.error("Please get the full API key from your Supabase dashboard.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
