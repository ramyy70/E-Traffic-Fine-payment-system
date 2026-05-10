const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDuplicates() {
  const { data: allDrivers, error: allErr } = await supabase
    .from('drivers')
    .select('nic, license_number');
    
  if (allErr) {
      console.error(allErr);
      return;
  }
  
  const counts = {};
  allDrivers.forEach(d => {
      if (d.license_number) {
          counts[d.license_number] = (counts[d.license_number] || 0) + 1;
      }
  });
  
  const duplicates = Object.keys(counts).filter(k => counts[k] > 1);
  console.log('Duplicate license numbers found:', duplicates);
  if (duplicates.length > 0) {
      duplicates.forEach(k => {
          const driversWithLic = allDrivers.filter(d => d.license_number === k);
          console.log(`License ${k} is used by NICs:`, driversWithLic.map(d => d.nic));
      });
  } else {
      console.log('No duplicate license numbers found in the current data.');
  }
}

checkDuplicates();
