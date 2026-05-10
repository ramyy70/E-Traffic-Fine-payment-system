const http = require('http');

async function makeRequest(path, data) {
  const payload = JSON.stringify(data);
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  const timestamp = Date.now();
  
  console.log('--- Testing Driver Registration ---');
  const driverEmail = `driver_${timestamp}@test.com`;
  const driverRes = await makeRequest('/api/auth/register', {
    email: driverEmail,
    password: 'password123',
    role: 'driver',
    full_name: 'Test Driver',
    nic: `NIC${timestamp}`,
    license_number: `LIC${timestamp}`
  });
  console.log('Driver Signup Status:', driverRes.status, driverRes.body.message || driverRes.body.error);

  console.log('\n--- Testing Police Registration ---');
  const policeEmail = `police_${timestamp}@test.com`;
  const policeRes = await makeRequest('/api/auth/register', {
    email: policeEmail,
    password: 'password123',
    role: 'policeman',
    full_name: 'Test Officer',
    badge_number: `BADGE${timestamp}`,
    rank: 'Sergeant'
  });
  console.log('Police Signup Status:', policeRes.status, policeRes.body.message || policeRes.body.error);

  console.log('\n--- Testing Admin Registration ---');
  const adminEmail = `admin_${timestamp}@test.com`;
  const adminRes = await makeRequest('/api/auth/register', {
    email: adminEmail,
    password: 'password123',
    role: 'admin',
    full_name: 'Test Admin',
    admin_code: `ADM${timestamp}`,
    station_name: 'Central'
  });
  console.log('Admin Signup Status:', adminRes.status, adminRes.body.message || adminRes.body.error);

  console.log('\n--- Testing Login (Police User) ---');
  const loginRes = await makeRequest('/api/auth/login', {
    email: policeEmail,
    password: 'password123'
  });
  console.log('Login Status:', loginRes.status);
  console.log('Role identified as:', loginRes.body.user?.role);
}

runTests().catch(console.error);
