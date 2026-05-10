import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/nodejs-api/.env' });

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
  }
}

checkColumns();
