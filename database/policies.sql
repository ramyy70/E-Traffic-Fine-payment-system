-- RLS Policies for Supabase
-- This requires you to enable RLS on these tables in Supabase:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE fines ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Note: We assume use of Supabase Auth, mapping `auth.uid()` to `users.id`

-- Users Table Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (id = auth.uid() OR role = 'admin');

-- Fines Table Policies
-- Drivers can read their own fines
CREATE POLICY "Drivers can view own fines"
ON fines FOR SELECT
USING (driver_id = auth.uid());

-- Policemen can view fines they issued
CREATE POLICY "Policemen can view issued fines"
ON fines FOR SELECT
USING (policeman_id = auth.uid());

-- Admin can view all fines
CREATE POLICY "Admin can view all fines"
ON fines FOR SELECT
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND role = 'admin'));

-- Policemen can insert fines
CREATE POLICY "Policemen can insert fines"
ON fines FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND role = 'policeman'));

-- Payments Table Policies
-- Drivers can view their own payments
CREATE POLICY "Drivers can view own payments"
ON payments FOR SELECT
USING (driver_id = auth.uid());

CREATE POLICY "Drivers can insert payments"
ON payments FOR INSERT
WITH CHECK (driver_id = auth.uid());

-- Admin can view all payments
CREATE POLICY "Admin can view all payments"
ON payments FOR SELECT
USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND role = 'admin'));

-- Messages Policies
-- Users can view messages where they are sender or receiver
CREATE POLICY "Users can view their messages"
ON messages FOR SELECT
USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR receiver_id IS NULL);

-- Users can insert messages
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (sender_id = auth.uid());
