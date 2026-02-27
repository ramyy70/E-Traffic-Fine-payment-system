export const users = [
    { id: 'driver-901234567V', name: 'Kamal Perera', role: 'driver', license: 'B1234567', nic: '901234567V' },
    { id: 'admin-ADM999', name: 'System Admin', role: 'admin', badge: 'ADM-001', nic: 'ADM999' },
    { id: 'police-POL999', name: 'Officer Silva', role: 'police', badge: 'COP-101', nic: 'POL999' }
];

export const violations = [
    { id: 'v1', name: 'Exceeding speed limit (up to 20%)', amount: 3000 },
    { id: 'v2', name: 'Exceeding speed limit (20%–30%)', amount: 5000 },
    { id: 'v3', name: 'Exceeding speed limit (30%–50%)', amount: 10000 },
    { id: 'v4', name: 'Exceeding speed limit (over 50%)', amount: 15000 },
    { id: 'v5', name: 'Driving without valid license', amount: 25000 },
    { id: 'v6', name: 'Driving under influence of liquor / drugs', amount: 25000 },
    { id: 'v7', name: 'Driving without valid insurance', amount: 25000 },
    { id: 'v8', name: 'Careless or reckless driving', amount: 10000 },
    { id: 'v9', name: 'Overtaking from the left', amount: 2000 },
    { id: 'v10', name: 'Disobeying traffic signals / red light', amount: 5000 },
    { id: 'v11', name: 'Using mobile phone while driving', amount: 5000 },
    { id: 'v12', name: 'Not wearing seat belt / helmet', amount: 2000 },
    { id: 'v13', name: 'Obstruction / illegal parking', amount: 3000 },
    { id: 'v14', name: 'Overloading passengers', amount: 5000 },
    { id: 'v15', name: 'Driving without displaying number plates', amount: 5000 },
];

export const initialFines = [
    {
        id: 'f101',
        userId: 'driver-901234567V',
        violation: 'Speeding (80km/h in 60km/h zone)',
        amount: 3000,
        date: '2023-10-05',
        location: 'Galle Road, Colombo 3',
        status: 'Unpaid',
        offenderNic: '901234567V',
        vehicleNo: 'WP CAA-1234'
    },
    {
        id: 'f102',
        userId: 'driver-901234567V',
        violation: 'Illegal Parking',
        amount: 1000,
        date: '2023-09-20',
        location: 'Kandy Town',
        status: 'Paid',
        paidDate: '2023-09-22',
        offenderNic: '901234567V',
        vehicleNo: 'WP CAB-5588'
    },
];

export const initialComplaints = [];

export const initialNotifications = [
    { id: 'n1', userId: 'driver-901234567V', message: 'Welcome to E-Traffic Fine System', read: false, date: '2023-10-01' }
];
