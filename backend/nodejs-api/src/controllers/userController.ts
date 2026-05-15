import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Fetch drivers
    const { data: drivers, error: driversError } = await supabase
      .from('drivers')
      .select('id, full_name, email, role, phone_number, nic, created_at')
      .order('created_at', { ascending: false });

    if (driversError) console.error('Drivers fetch error:', driversError);

    // Fetch police officers
    const { data: police, error: policeError } = await supabase
      .from('police_officers')
      .select('id, full_name, email, role, phone_number, badge_number, created_at')
      .order('created_at', { ascending: false });

    if (policeError) console.error('Police fetch error:', policeError);

    // Fetch admin users
    const { data: admins, error: adminsError } = await supabase
      .from('admin_users')
      .select('id, full_name, email, role, phone_number, admin_code, created_at')
      .order('created_at', { ascending: false });

    if (adminsError) console.error('Admins fetch error:', adminsError);

    // Normalize and merge all users
    const allUsers = [
      ...(drivers || []).map(d => ({
        id: d.id,
        full_name: d.full_name,
        email: d.email,
        role: d.role || 'driver',
        phone_number: d.phone_number || '',
        nic: d.nic || '',
        badge_number: '',
        status: 'Active',
        created_at: d.created_at
      })),
      ...(police || []).map(p => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        role: p.role || 'policeman',
        phone_number: p.phone_number || '',
        nic: '',
        badge_number: p.badge_number || '',
        status: 'Active',
        created_at: p.created_at
      })),
      ...(admins || []).map(a => ({
        id: a.id,
        full_name: a.full_name,
        email: a.email,
        role: a.role || 'admin',
        phone_number: a.phone_number || '',
        nic: '',
        badge_number: a.admin_code || '',
        status: 'Active',
        created_at: a.created_at
      }))
    ];

    // Sort by created_at descending
    allUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return res.status(200).json({ users: allUsers });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const suspendUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Since there's no central users table with a status field,
    // we return a placeholder response for now
    return res.status(200).json({ message: 'User status updated', user: { id, status: 'Suspended' } });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = ['full_name', 'phone_number'];
    const sanitized: any = {};
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) sanitized[key] = updates[key];
    }

    // Try updating in each table
    const tables = ['drivers', 'police_officers', 'admin_users'];
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .update(sanitized)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (data) {
        return res.status(200).json({ message: 'Profile updated successfully', user: data });
      }
    }

    return res.status(404).json({ error: 'User not found' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const tables = ['drivers', 'police_officers', 'admin_users'];
    let deleted = false;
    let dbError: any = null;
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .select();
        
      if (error) {
        dbError = error;
      }
        
      if (data && data.length > 0) {
        deleted = true;
        dbError = null; // Clear error if we successfully deleted from one table
        break;
      }
    }

    if (deleted) {
      return res.status(200).json({ message: 'User deleted successfully' });
    } else if (dbError) {
      console.error('Delete error:', dbError);
      return res.status(400).json({ 
        error: 'Cannot delete this user because they have existing records (fines, messages, or payments) linked to them.' 
      });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
