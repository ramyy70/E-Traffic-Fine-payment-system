const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testFines() {
  const { data: drivers } = await supabase.from('drivers').select('id').limit(1);
  const driver_id = drivers[0]?.id;

  const { error } = await supabase
    .from('fines')
    .insert([{
      driver_id,
      driver_name: 'test',
      driver_address: 'karawitagara,chilaw',
      vehicle_number: 'test',
      date_of_offence: new Date().toISOString(),
      nature_of_offence: 'test',
      fine_amount: 1000,
      dl_tp_no: 'test',
      police_station: 'test',
      place_of_offence: 'karawitagara,chilaw',
      time_of_offence: '10:30 PM',
      policeman_id: '36f70425-fdbc-4c4b-840e-826560d30fe6'
    }]);

  if (error) {
    console.log('Insert into fines failed:', error.message);
    if (error.message.includes('malformed array literal')) {
        console.log('FOUND IT: driver_address is likely an ARRAY type in the fines table.');
    }
  } else {
    console.log('Insert into fines succeeded.');
  }
}

testFines();
