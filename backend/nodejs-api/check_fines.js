const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkColumns() {
  const { data, error } = await supabase
    .from('fines')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching fines:', error);
  } else {
    console.log('Columns in fines table:', data.length > 0 ? Object.keys(data[0]) : 'No data to check columns');
    
    // Also try to list columns using PostgREST if possible
    const { data: colData, error: colError } = await supabase
      .from('fines')
      .select()
      .limit(0);
    
    if (colError) {
      console.error('Error checking columns via empty select:', colError);
    } else {
       // Note: headers or metadata might have it, but standard select doesn't return schema
    }
  }
}

checkColumns();
