import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, phone_number, nic, badge_number')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ users });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const suspendUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data: userCheck, error: checkError } = await supabase
      .from('users')
      .select('status')
      .eq('id', id)
      .single();

    if (checkError || !userCheck) return res.status(404).json({ error: 'User not found' });

    const newStatus = userCheck.status === 'Suspended' ? 'Active' : 'Suspended';

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('id', id)
      .select('id, full_name, status')
      .single();

    if (updateError) return res.status(400).json({ error: updateError.message });
    return res.status(200).json({ message: `User successfully ${newStatus.toLowerCase()}`, user: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = ['full_name', 'phone_number', 'address', 'station_name'];
    const sanitized: any = {};
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) sanitized[key] = updates[key];
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(sanitized)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
