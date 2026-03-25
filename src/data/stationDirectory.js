export const stationDirectory = [
  {
    id: '5c50d2fd-295b-4d44-876f-8e1ab352af01',
    station_name: 'Central Traffic Police Station',
    station_code: 'CTPS001',
    district: 'Colombo',
    province: 'Western',
    contact_email: 'central@traffic.lk',
    admin_verification_code: 'CTPS001-ADM-67Q2',
  },
  {
    id: '6d6f1457-1574-445a-8f88-faf7bb326125',
    station_name: 'Mount Lavinia Police Station',
    station_code: 'MLPS002',
    district: 'Colombo',
    province: 'Western',
    contact_email: 'mountlavinia@traffic.lk',
    admin_verification_code: 'MLPS002-ADM-41B8',
  },
  {
    id: '140e9e0c-180c-490b-bca5-6d13795fdf44',
    station_name: 'Kandy Traffic Police Station',
    station_code: 'KTPS003',
    district: 'Kandy',
    province: 'Central',
    contact_email: 'kandy@traffic.lk',
    admin_verification_code: 'KTPS003-ADM-90KC',
  },
  {
    id: '93bfa9c4-340a-4f28-9f85-acfbb25969c8',
    station_name: 'Galle Police Station',
    station_code: 'GPS004',
    district: 'Galle',
    province: 'Southern',
    contact_email: 'galle@traffic.lk',
    admin_verification_code: 'GPS004-ADM-12GE',
  },
  {
    id: '157af63d-9eef-47b4-b7ed-455f4fd4e5e8',
    station_name: 'Jaffna Police Station',
    station_code: 'JPS005',
    district: 'Jaffna',
    province: 'Northern',
    contact_email: 'jaffna@traffic.lk',
    admin_verification_code: 'JPS005-ADM-73JF',
  },
];

export const stationById = (stationId) =>
  stationDirectory.find((station) => station.id === stationId) || null;
