-- Fix for 'new row violates row-level security policy for table "users"'
-- Run this in your Supabase SQL Editor to allow signups and profiling.

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to insert their respective profiles
CREATE POLICY "Drivers can insert their own record" ON drivers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Police can insert their own record" ON police_officers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can insert their own record" ON admin_users
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow users to create infrastructure objects
CREATE POLICY "Users can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- session_logs is invoked from a function, so the caller needs permissions 
CREATE POLICY "Users can insert session logs" ON session_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());
