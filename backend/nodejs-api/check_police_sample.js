const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
    }
});

const supabaseUrl = envVars.SUPABASE_URL;
const supabaseAnonKey = envVars.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPolice() {
    console.log('Fetching police_officers...');
    const { data, error } = await supabase
        .from('police_officers')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching police_officers:', error);
    } else {
        console.log('Police Officer Sample:', JSON.stringify(data, null, 2));
    }
}

checkPolice();
