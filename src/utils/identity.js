export const normalizeNic = (value = '') =>
    String(value)
        .trim()
        .toUpperCase()
        .replace(/[^0-9VX]/g, '');

export const isValidSriLankanNic = (value = '') => {
    const nic = normalizeNic(value);
    return /^\d{9}[VX]$/.test(nic) || /^\d{12}$/.test(nic);
};

export const driverUserIdFromNic = (value = '') => {
    const nic = normalizeNic(value);
    return nic ? `driver-${nic}` : null;
};

export const maskNic = (value = '') => {
    const nic = normalizeNic(value);
    if (!nic) return 'N/A';
    if (nic.length <= 4) return '****';
    return `${nic.slice(0, 4)}****${nic.slice(-2)}`;
};

export const fineBelongsToDriver = (fine, user) => {
    if (!fine || !user || user.role !== 'driver') return false;

    const driverId = String(user.id || '').trim();
    if (fine.userId === driverId) return true;

    const driverNic = normalizeNic(user.nic || '');
    if (!driverNic) return false;

    const offenderNic = normalizeNic(
        fine.offenderNic || fine.nic || fine.driverNic || ''
    );
    if (offenderNic && offenderNic === driverNic) return true;

    return fine.userId === driverUserIdFromNic(driverNic);
};
