const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDrivers() {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching drivers:', error);
  } else {
    console.log('Columns in drivers table:', data.length > 0 ? Object.keys(data[0]) : 'No data to check columns');
  }
}

checkDrivers();
