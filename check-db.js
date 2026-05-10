const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/nodejs-api/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  console.log('Checking Supabase connection to:', process.env.SUPABASE_URL);
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking users table:', error.message);
      if (error.message.includes('relation "users" does not exist')) {
        console.log('Users table does not exist.');
      }
    } else {
      console.log('Users table exists. Row count:', data);
    }

    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_info'); // This might not exist, let's try a direct query
    
    // Alternative check for tables
    const { data: queryData, error: queryError } = await supabase
      .from('pg_tables') // Usually not accessible via high-level API unless role is set
      .select('*')
      .eq('schemaname', 'public');
    
    if (queryError) {
      console.log('Could not list all tables via simple select.');
    } else {
      console.log('Tables in public schema:', queryData.map(t => t.tablename));
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkTables();
