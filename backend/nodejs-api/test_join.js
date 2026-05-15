require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testJoin() {
    const {data, error} = await supabase.from('fines').select('*, driver:drivers(nic)').limit(1);
    console.log(JSON.stringify({data, error}, null, 2));
}
testJoin();
