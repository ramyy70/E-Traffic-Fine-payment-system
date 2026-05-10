const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function getOfficer() {
  const { data, error } = await supabase
    .from('police_officers')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Error fetching officers:', error);
  } else {
    console.log('Officer ID:', data[0]?.id);
  }
}

getOfficer();
