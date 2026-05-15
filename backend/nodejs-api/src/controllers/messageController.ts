import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sender_id, receiver_id, content, sender_role } = req.body;

    const { data: message, error } = await supabase
      .from('messages')
      .insert([{ 
        sender_id, 
        receiver_id: receiver_id || null, 
        content, 
        status: 'sent',
        sender_role: sender_role || 'system'
      }])
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

    // Check if user is an admin by checking admin_users table
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    let query = supabase.from('messages').select('*').order('created_at', { ascending: false });

    if (!adminUser) {
      // Regular user sees only their inbound or outbound messages
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    } 

    const { data: messages, error } = await query;
    if (error) return res.status(400).json({ error: error.message });

    if (!messages || messages.length === 0) {
      return res.status(200).json({ messages: [] });
    }

    // Extract unique sender IDs per role to batch fetch
    const sendersByRole: Record<string, string[]> = {
      driver: [],
      policeman: [],
      admin: []
    };

    messages.forEach(msg => {
      if (msg.sender_role && sendersByRole[msg.sender_role]) {
        if (!sendersByRole[msg.sender_role].includes(msg.sender_id)) {
          sendersByRole[msg.sender_role].push(msg.sender_id);
        }
      }
    });

    // Fetch user info for each role
    const userInfo: Record<string, any> = {};

    await Promise.all(Object.entries(sendersByRole).map(async ([role, ids]) => {
      if (ids.length === 0) return;
      
      let tableName = '';
      if (role === 'driver') tableName = 'drivers';
      else if (role === 'policeman') tableName = 'police_officers';
      else if (role === 'admin') tableName = 'admin_users';

      if (tableName) {
        const { data: users } = await supabase
          .from(tableName)
          .select('id, full_name, role')
          .in('id', ids);
        
        (users || []).forEach(u => {
          userInfo[u.id] = u;
        });
      }
    }));

    const enrichedMessages = messages.map(msg => ({
      ...msg,
      sender: userInfo[msg.sender_id] || { full_name: 'System', role: msg.sender_role }
    }));

    return res.status(200).json({ messages: enrichedMessages });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
