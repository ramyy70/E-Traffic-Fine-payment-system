const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testFines() {
  const { error } = await supabase
    .from('fines')
    .insert([{
      driver_name: 'test',
      driver_address: 'karawitagara,chilaw',
      vehicle_number: 'test',
      date_of_offence: new Date().toISOString(),
      nature_of_offence: 'test',
      fine_amount: 1000,
      dl_tp_no: 'test',
      police_station: 'test',
      policeman_id: '36f70425-fdbc-4c4b-840e-826560d30fe6'
    }]);

  if (error) {
    console.log('Insert into fines failed:', error.message);
  } else {
    console.log('Insert into fines succeeded.');
  }
}

testFines();
