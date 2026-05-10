const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testDrivers() {
  const { error } = await supabase
    .from('drivers')
    .insert([{
      email: 'test@example.com',
      password_hash: 'hash',
      full_name: 'test',
      nic: 'NIC' + Math.floor(Math.random() * 1000000),
      address_line_1: 'karawitagara,chilaw'
    }]);

  if (error) {
    console.log('Insert into drivers failed:', error.message);
  } else {
    console.log('Insert into drivers succeeded.');
  }
}

testDrivers();
