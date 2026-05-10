const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testInsert() {
  const testVal = "test,location";
  
  // Try inserting as a string
  const { error: strError } = await supabase
    .from('fines')
    .insert([{
      driver_nic: 'test-nic',
      driver_name: 'test-name',
      driver_address: 'test-addr',
      vehicle_number: 'test-veh',
      date_of_offence: new Date().toISOString(),
      nature_of_offence: 'test-offence',
      fine_amount: 1000,
      dl_tp_no: 'test-dl',
      police_station: 'test-station',
      place_of_offence: testVal,
      policeman_id: '36f70425-fdbc-4c4b-840e-826560d30fe6' 
    }]);

  if (strError) {
    console.log('Insert as string failed:', strError.message);
    if (strError.message.includes('malformed array literal')) {
        console.log('CONFIRMED: place_of_offence is an ARRAY type.');
    }
  } else {
    console.log('Insert as string succeeded. It is NOT an array.');
  }
}

testInsert();
