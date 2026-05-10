import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sender_id, receiver_id, content } = req.body;

    const { data: message, error } = await supabase
      .from('messages')
      .insert([{ sender_id, receiver_id: receiver_id || null, content, status: 'sent' }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMessagesForUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Fetch messages where user is receiver, OR where user is a global receiver (receiver_id null) if they are an admin
    // Or just fetch all if admin. Let's provide all linked messages + sent messages if needed.
    // Assuming a simple bi-directional fetch here for the specific user/admin.

    const { data: userRole, error: roleError } = await supabase.from('users').select('role').eq('id', userId).single();
    if (roleError) return res.status(400).json({ error: roleError.message });

    let query = supabase.from('messages').select(`
      *,
      sender:users!messages_sender_id_fkey(full_name, role, nic, badge_number, phone_number),
      receiver:users!messages_receiver_id_fkey(full_name, role, nic, badge_number, phone_number)
    `).order('created_at', { ascending: false });

    if (userRole.role !== 'admin') {
      // Regular user sees only their inbound or outbound messages
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    } 
    // Admin sees all messages (acting as the system central)

    const { data: messages, error } = await query;

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ messages });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
