const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('--- Database Verification ---');
  console.log('Project URL:', supabaseUrl);

  try {
    // 1. Test basic connection
    const { data: health, error: healthError } = await supabase.from('users').select('id').limit(1);
    
    if (healthError) {
      if (healthError.message.includes('relation "users" does not exist')) {
        console.error('❌ Error: Combined "users" table does not exist in the database.');
        console.log('Solution: Please run the SQL in database/schema.sql in your Supabase SQL Editor.');
      } else {
        console.error('❌ Database Connection Error:', healthError.message);
      }
    } else {
      console.log('✅ Connection to "users" table successful.');
    }

    // 2. Check for other required tables
    const requiredTables = ['fines', 'payments', 'messages'];
    for (const table of requiredTables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        console.warn(`⚠️ Warning: Table "${table}" check failed: ${error.message}`);
      } else {
        console.log(`✅ Table "${table}" exists.`);
      }
    }

  } catch (err) {
    console.error('❌ Unexpected Error during verification:', err.message);
  }
}

verify();
