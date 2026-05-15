import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // 1. Total Fines
    const { count: totalFines, error: finesError } = await supabase
      .from('fines')
      .select('*', { count: 'exact', head: true });

    if (finesError) throw finesError;

    // 2. Total Revenue (Sum of paid fines)
    const { data: revenueData, error: revenueError } = await supabase
      .from('fines')
      .select('fine_amount')
      .eq('status', 'paid');

    if (revenueError) throw revenueError;
    const totalRevenue = revenueData.reduce((sum, fine) => sum + Number(fine.fine_amount), 0);

    // 3. Registered Drivers
    const { count: totalDrivers, error: driversError } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true });

    if (driversError) throw driversError;

    // 4. Active Policemen
    // Note: Assuming all in police_officers are active for now, or check for a status if exists
    const { count: totalPolice, error: policeError } = await supabase
      .from('police_officers')
      .select('*', { count: 'exact', head: true });

    if (policeError) throw policeError;

    return res.status(200).json({
      totalFines: totalFines || 0,
      totalRevenue: totalRevenue || 0,
      registeredDrivers: totalDrivers || 0,
      activePolicemen: totalPolice || 0
    });
  } catch (error: any) {
    console.error('Stats Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
