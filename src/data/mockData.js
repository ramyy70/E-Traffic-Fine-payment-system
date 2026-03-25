export const users = [
    { id: 'driver-901234567V', name: 'Kamal Perera', role: 'driver', license: 'B1234567', nic: '901234567V' },
    { id: 'admin-ADM999', name: 'System Admin', role: 'admin', badge: 'ADM-001', nic: 'ADM999' },
    { id: 'police-POL999', name: 'Officer Silva', role: 'police', badge: 'COP-101', nic: 'POL999' }
];

export const violations = [
    // Source: Gazette Extraordinary 2054/09 (2018-01-15) - Motor Traffic Spot Fine Regulations
    { id: 'v1', name: 'Driving without a valid driving licence or permit', amount: 25000 },
    { id: 'v2', name: 'Driving without insurance cover note/certificate', amount: 25000 },
    { id: 'v3', name: 'Driving under the influence of liquor or drugs', amount: 25000 },
    { id: 'v4', name: 'Driving without vehicle revenue licence', amount: 25000 },
    { id: 'v5', name: 'Driving an unregistered vehicle or without registration book', amount: 25000 },
    { id: 'v6', name: 'Speeding (exceeding limit by up to 20%)', amount: 3000 },
    { id: 'v7', name: 'Speeding (exceeding limit by more than 20% and up to 30%)', amount: 5000 },
    { id: 'v8', name: 'Speeding (exceeding limit by more than 30% and up to 50%)', amount: 10000 },
    { id: 'v9', name: 'Speeding (exceeding limit by more than 50%)', amount: 15000 },
    { id: 'v10', name: 'Overtaking from the wrong side', amount: 2000 },
    { id: 'v11', name: 'Exceeding maximum passenger load in a private coach', amount: 2000 },
    { id: 'v12', name: 'Exceeding maximum passenger load in a motor coach', amount: 5000 },
    { id: 'v13', name: 'Causing obstruction/hindrance by stopping or parking', amount: 3000 },
    { id: 'v14', name: 'Leaving a disabled vehicle without warning signals', amount: 3000 },
    { id: 'v15', name: 'Driving with unlawful/unauthorized/excessive noise', amount: 3000 },
    { id: 'v16', name: 'Carrying passengers in a dangerous manner with body protruding', amount: 3000 },
    { id: 'v17', name: 'Failure to comply with lane-driving rules', amount: 2000 },
    { id: 'v18', name: 'Reckless/negligent/dangerous driving', amount: 10000 },
    { id: 'v19', name: 'Failure to stop at yellow/red traffic signal', amount: 5000 },
    { id: 'v20', name: 'Motorcycle rider carrying passenger not wearing proper helmet', amount: 2000 },
    { id: 'v21', name: 'Motorcycle rider/passenger not wearing helmets', amount: 2000 },
    { id: 'v22', name: 'Obstructing free movement of another vehicle', amount: 2000 },
    { id: 'v23', name: 'Driver failing to wear seat belt', amount: 2000 },
    { id: 'v24', name: 'Driving without correct licence endorsement for vehicle type', amount: 2500 },
    { id: 'v25', name: 'Failure to comply with police officer signals/commands', amount: 2000 },
    { id: 'v26', name: 'Using a handheld mobile phone while driving', amount: 5000 },
    { id: 'v27', name: 'Driving without registration number plates', amount: 5000 },
    { id: 'v28', name: 'Parking near white/yellow line marked area', amount: 2000 },
    { id: 'v29', name: 'Driving without valid emission test certificate', amount: 2000 },
    { id: 'v30', name: 'Improper crossing at railway crossing by certain vehicle classes', amount: 3000 },
    { id: 'v31', name: 'Driving against one-way direction', amount: 2000 },
    { id: 'v32', name: 'Omnibus driver not stopping correctly at bus halt/stand', amount: 2000 },
    { id: 'v33', name: 'Parking private coach on pavement causing obstruction', amount: 2000 }
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
    }
];

export const initialComplaints = [];

export const initialNotifications = [
    {
        id: 'n1',
        userId: 'driver-901234567V',
        message: 'Welcome to E-Traffic Fine System',
        messageKey: 'notifWelcome',
        messageParams: {},
        read: false,
        date: '2023-10-01'
    }
];
