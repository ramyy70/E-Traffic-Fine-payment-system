import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
    }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseServiceKey = envVars.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing supabase URL or service key in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  const email = 'admin.demo@etraffic.lk'; // Or another demo email
  const password = 'Admin@123';
  const adminCode = 'ADM999'; 

  console.log('Creating auth user...');
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId;
  if (authError) {
      if (authError.message.includes('already exists')) {
          console.log('User already exists in auth. Fetching user ID...');
          const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = usersData.users.find(u => u.email === email);
          if (existingUser) {
              userId = existingUser.id;
          }
      } else {
          console.error('Error creating auth user:', authError);
          return;
      }
  } else {
      userId = authData.user.id;
  }

  if (userId) {
      await createUserProfile(userId, email, adminCode);
  }
}

async function createUserProfile(userId, email, adminCode) {
  console.log('Creating user profile...');
  const { error: profileError } = await supabaseAdmin.from('users').upsert({
    id: userId,
    email: email,
    user_type: 'admin',
    full_name: 'System Admin',
    phone_number: '+94712300000',
    is_active: true,
    is_verified: true
  });

  if (profileError) {
    console.error('Error creating user profile:', profileError);
    return;
  }

  console.log('Creating admin profile...');
  const { error: adminError } = await supabaseAdmin.from('admin_users').upsert({
    user_id: userId,
    admin_code: adminCode,
    department: 'Digital Governance',
    role_level: 'super_admin'
  });

  if (adminError) {
    console.error('Error creating admin profile:', adminError);
    return;
  }

  console.log('Admin account created successfully!');
  console.log(`Email: ${email}`);
  console.log(`Password: Admin@123`);
}

createAdmin();
