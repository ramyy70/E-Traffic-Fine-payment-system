-- ============================================================
-- SUPABASE DATABASE SCHEMA - TRAFFIC MANAGEMENT SYSTEM
-- Complete setup with JWT Authentication, RLS, and Triggers
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. CORE USER MANAGEMENT TABLES
-- ============================================================

-- Main users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('driver', 'police', 'admin')),
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================================
-- 2. DRIVER-SPECIFIC TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nic_number VARCHAR(20) UNIQUE NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  license_expiry_date DATE,
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  total_fines_amount DECIMAL(12, 2) DEFAULT 0,
  total_paid_amount DECIMAL(12, 2) DEFAULT 0,
  pending_fines_count INTEGER DEFAULT 0,
  penalty_points INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'inactive')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_drivers_nic_number ON drivers(nic_number);
CREATE INDEX idx_drivers_status ON drivers(status);

-- Driver vehicles
CREATE TABLE IF NOT EXISTS driver_vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  vehicle_type VARCHAR(100) NOT NULL,
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  color VARCHAR(50),
  engine_number VARCHAR(100),
  chassis_number VARCHAR(100),
  insurance_expiry DATE,
  vehicle_tax_expiry DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_driver_vehicles_driver_id ON driver_vehicles(driver_id);
CREATE INDEX idx_driver_vehicles_registration ON driver_vehicles(registration_number);

-- ============================================================
-- 3. POLICE OFFICER TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS police_stations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_name VARCHAR(255) NOT NULL,
  station_code VARCHAR(50) UNIQUE NOT NULL,
  location VARCHAR(255),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  district VARCHAR(100),
  province VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_police_stations_district ON police_stations(district);
CREATE INDEX idx_police_stations_station_code ON police_stations(station_code);

-- Police officers
CREATE TABLE IF NOT EXISTS police_officers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_number VARCHAR(50) UNIQUE NOT NULL,
  rank VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  station_id UUID REFERENCES police_stations(id) ON DELETE SET NULL,
  date_of_joining DATE,
  identification_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'retired', 'suspended')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_police_officers_user_id ON police_officers(user_id);
CREATE INDEX idx_police_officers_badge_number ON police_officers(badge_number);
CREATE INDEX idx_police_officers_station_id ON police_officers(station_id);
CREATE INDEX idx_police_officers_status ON police_officers(status);

-- ============================================================
-- 4. ADMIN TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_code VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(100),
  station_id UUID REFERENCES police_stations(id) ON DELETE SET NULL,
  role_level VARCHAR(50) DEFAULT 'manager' CHECK (role_level IN ('super_admin', 'admin', 'manager', 'operator')),
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backfill support if table already existed before station linkage
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS station_id UUID REFERENCES police_stations(id) ON DELETE SET NULL;

CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_admin_code ON admin_users(admin_code);
CREATE INDEX idx_admin_users_station_id ON admin_users(station_id);
CREATE INDEX idx_admin_users_role_level ON admin_users(role_level);

-- Station verification tokens used for Admin onboarding
CREATE TABLE IF NOT EXISTS admin_station_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_id UUID NOT NULL REFERENCES police_stations(id) ON DELETE CASCADE,
  issued_by_admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  token_hash TEXT NOT NULL,
  token_last4 VARCHAR(4) NOT NULL,
  issued_to_email VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'revoked')),
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  used_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_admin_station_tokens_hash ON admin_station_verification_tokens(token_hash);
CREATE INDEX idx_admin_station_tokens_station_id ON admin_station_verification_tokens(station_id);
CREATE INDEX idx_admin_station_tokens_status ON admin_station_verification_tokens(status);
CREATE INDEX idx_admin_station_tokens_expires_at ON admin_station_verification_tokens(expires_at);

-- ============================================================
-- 5. TRAFFIC COMPLAINT/FINE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS traffic_violations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  violation_code VARCHAR(50) UNIQUE NOT NULL,
  violation_name VARCHAR(255) NOT NULL,
  description TEXT,
  default_fine_amount DECIMAL(12, 2) NOT NULL,
  default_penalty_points INTEGER DEFAULT 0,
  severity_level VARCHAR(50) CHECK (severity_level IN ('minor', 'major', 'critical')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_traffic_violations_code ON traffic_violations(violation_code);

-- Traffic complaints/violations
CREATE TABLE IF NOT EXISTS traffic_complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_number VARCHAR(50) UNIQUE NOT NULL,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES driver_vehicles(id) ON DELETE SET NULL,
  officer_id UUID REFERENCES police_officers(id) ON DELETE SET NULL,
  violation_id UUID REFERENCES traffic_violations(id) ON DELETE SET NULL,
  station_id UUID REFERENCES police_stations(id) ON DELETE SET NULL,
  location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  incident_description TEXT,
  evidence_photos TEXT[],
  complaint_date TIMESTAMP NOT NULL,
  complaint_time TIME,
  status VARCHAR(50) DEFAULT 'reported' CHECK (status IN ('reported', 'under_review', 'resolved', 'dismissed', 'appealed')),
  priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

CREATE INDEX idx_traffic_complaints_driver_id ON traffic_complaints(driver_id);
CREATE INDEX idx_traffic_complaints_officer_id ON traffic_complaints(officer_id);
CREATE INDEX idx_traffic_complaints_status ON traffic_complaints(status);
CREATE INDEX idx_traffic_complaints_complaint_date ON traffic_complaints(complaint_date);
CREATE INDEX idx_traffic_complaints_complaint_number ON traffic_complaints(complaint_number);

-- ============================================================
-- 6. FINES TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS traffic_fines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fine_number VARCHAR(50) UNIQUE NOT NULL,
  complaint_id UUID NOT NULL REFERENCES traffic_complaints(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES driver_vehicles(id) ON DELETE SET NULL,
  officer_id UUID REFERENCES police_officers(id) ON DELETE SET NULL,
  violation_id UUID REFERENCES traffic_violations(id) ON DELETE SET NULL,
  fine_amount DECIMAL(12, 2) NOT NULL,
  penalty_points INTEGER DEFAULT 0,
  issued_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date DATE,
  payment_deadline DATE,
  status VARCHAR(50) DEFAULT 'issued' CHECK (status IN ('issued', 'paid', 'overdue', 'disputed', 'waived')),
  fine_description TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_date TIMESTAMP
);

CREATE INDEX idx_traffic_fines_driver_id ON traffic_fines(driver_id);
CREATE INDEX idx_traffic_fines_complaint_id ON traffic_fines(complaint_id);
CREATE INDEX idx_traffic_fines_status ON traffic_fines(status);
CREATE INDEX idx_traffic_fines_fine_number ON traffic_fines(fine_number);
CREATE INDEX idx_traffic_fines_issued_date ON traffic_fines(issued_date);

-- ============================================================
-- 7. PAYMENT TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS fine_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_reference VARCHAR(50) UNIQUE NOT NULL,
  fine_id UUID NOT NULL REFERENCES traffic_fines(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  amount_paid DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('card', 'bank_transfer', 'cash', 'online', 'cheque', 'eservice')),
  transaction_id VARCHAR(255) UNIQUE,
  payment_gateway VARCHAR(100),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  receipt_url TEXT,
  receipt_number VARCHAR(50),
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fine_payments_driver_id ON fine_payments(driver_id);
CREATE INDEX idx_fine_payments_fine_id ON fine_payments(fine_id);
CREATE INDEX idx_fine_payments_status ON fine_payments(status);
CREATE INDEX idx_fine_payments_payment_reference ON fine_payments(payment_reference);
CREATE INDEX idx_fine_payments_payment_date ON fine_payments(payment_date);

-- ============================================================
-- 8. APPEAL/DISPUTE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS fine_appeals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appeal_number VARCHAR(50) UNIQUE NOT NULL,
  fine_id UUID NOT NULL REFERENCES traffic_fines(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  complaint_id UUID REFERENCES traffic_complaints(id) ON DELETE SET NULL,
  appeal_reason TEXT NOT NULL,
  supporting_documents TEXT[],
  appeal_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected', 'withdrawn')),
  reviewed_by_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  review_comments TEXT,
  appeal_decision VARCHAR(50),
  reviewed_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fine_appeals_driver_id ON fine_appeals(driver_id);
CREATE INDEX idx_fine_appeals_fine_id ON fine_appeals(fine_id);
CREATE INDEX idx_fine_appeals_status ON fine_appeals(status);
CREATE INDEX idx_fine_appeals_appeal_number ON fine_appeals(appeal_number);

-- ============================================================
-- 9. NOTIFICATION TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  notification_type VARCHAR(100) CHECK (notification_type IN ('fine', 'payment', 'complaint', 'appeal', 'license', 'general')),
  related_resource_type VARCHAR(100),
  related_resource_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================================
-- 10. AUDIT LOG TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ============================================================
-- 11. SESSION LOG TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS session_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_time TIMESTAMP,
  ip_address VARCHAR(50),
  device_info TEXT,
  session_duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_session_logs_user_id ON session_logs(user_id);
CREATE INDEX idx_session_logs_login_time ON session_logs(login_time);

-- ============================================================
-- 12. STATISTICS/REPORTING TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS dashboard_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stat_date DATE DEFAULT CURRENT_DATE,
  stat_type VARCHAR(50) NOT NULL,
  total_drivers INTEGER DEFAULT 0,
  total_police_officers INTEGER DEFAULT 0,
  total_complaints INTEGER DEFAULT 0,
  total_fines INTEGER DEFAULT 0,
  total_fines_amount DECIMAL(15, 2) DEFAULT 0,
  total_payments DECIMAL(15, 2) DEFAULT 0,
  pending_complaints INTEGER DEFAULT 0,
  overdue_fines INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dashboard_statistics_stat_date ON dashboard_statistics(stat_date);

-- ============================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for all tables to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_police_officers_updated_at BEFORE UPDATE ON police_officers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_traffic_complaints_updated_at BEFORE UPDATE ON traffic_complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_traffic_fines_updated_at BEFORE UPDATE ON traffic_fines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fine_payments_updated_at BEFORE UPDATE ON fine_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fine_appeals_updated_at BEFORE UPDATE ON fine_appeals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_station_tokens_updated_at BEFORE UPDATE ON admin_station_verification_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log user login
CREATE OR REPLACE FUNCTION log_user_login(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = user_id;
  INSERT INTO session_logs (user_id, ip_address) VALUES (user_id, inet_client_addr()::text);
END;
$$ LANGUAGE plpgsql;

-- Function to update driver statistics
CREATE OR REPLACE FUNCTION update_driver_statistics(driver_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE drivers 
  SET 
    total_fines_amount = COALESCE((SELECT SUM(fine_amount) FROM traffic_fines WHERE driver_id = $1), 0),
    total_paid_amount = COALESCE((SELECT SUM(amount_paid) FROM fine_payments WHERE driver_id = $1), 0),
    pending_fines_count = COALESCE((SELECT COUNT(*) FROM traffic_fines WHERE driver_id = $1 AND status IN ('issued', 'overdue')), 0),
    penalty_points = COALESCE((SELECT SUM(penalty_points) FROM traffic_fines WHERE driver_id = $1 AND status != 'waived'), 0)
  WHERE id = $1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE police_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_station_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE fine_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fine_appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE police_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- RLS Policies for drivers table
CREATE POLICY "Drivers can view their own record" ON drivers
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Drivers can update their own record" ON drivers
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Police and Admins can view drivers" ON drivers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM police_officers WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- RLS Policies for driver_vehicles table
CREATE POLICY "Drivers can view their vehicles" ON driver_vehicles
  FOR SELECT USING (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
  );
CREATE POLICY "Drivers can manage their vehicles" ON driver_vehicles
  FOR ALL USING (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
  );

-- RLS Policies for traffic_fines
CREATE POLICY "Drivers can view their fines" ON traffic_fines
  FOR SELECT USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));
CREATE POLICY "Officers can view and manage fines" ON traffic_fines
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM police_officers WHERE user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- RLS Policies for fine_payments
CREATE POLICY "Drivers can view their payments" ON fine_payments
  FOR SELECT USING (driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid()));

-- RLS Policies for admin_station_verification_tokens
CREATE POLICY "Admins can view station verification tokens" ON admin_station_verification_tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND (au.role_level = 'super_admin' OR au.station_id = admin_station_verification_tokens.station_id)
    )
  );

CREATE POLICY "Admins can create station verification tokens" ON admin_station_verification_tokens
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND (au.role_level = 'super_admin' OR au.station_id = admin_station_verification_tokens.station_id)
    )
  );

CREATE POLICY "Admins can update station verification tokens" ON admin_station_verification_tokens
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND (au.role_level = 'super_admin' OR au.station_id = admin_station_verification_tokens.station_id)
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1
      FROM admin_users au
      WHERE au.user_id = auth.uid()
        AND (au.role_level = 'super_admin' OR au.station_id = admin_station_verification_tokens.station_id)
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can mark their notifications as read" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- SAMPLE DATA
-- ============================================================

-- Insert sample traffic violations
INSERT INTO traffic_violations (violation_code, violation_name, description, default_fine_amount, default_penalty_points, severity_level) VALUES
  ('SPEED_30', 'Exceeding Speed Limit (30 km/h+)', 'Driving 30 km/h or more above speed limit', 15000, 24, 'critical'),
  ('SPEED_20', 'Exceeding Speed Limit (20-29 km/h)', 'Driving 20-29 km/h above speed limit', 10000, 18, 'major'),
  ('SPEED_10', 'Exceeding Speed Limit (10-19 km/h)', 'Driving 10-19 km/h above speed limit', 5000, 12, 'minor'),
  ('RED_LIGHT', 'Traffic Signal Violation', 'Crossing red traffic light', 12000, 18, 'major'),
  ('NO_SEATBELT', 'Not Wearing Seatbelt', 'Occupants not wearing seatbelts', 3000, 6, 'minor'),
  ('NO_HELMET', 'Not Wearing Motorcycle Helmet', 'Rider not wearing approved helmet', 4000, 8, 'minor'),
  ('RASH_DRIVING', 'Rash or Negligent Driving', 'Dangerous or reckless driving', 25000, 36, 'critical'),
  ('NO_LICENSE', 'Driving Without License', 'Operating vehicle without valid license', 20000, 24, 'critical'),
  ('EXPIRED_LICENSE', 'Expired License', 'Driving with expired driving license', 8000, 12, 'major'),
  ('NO_REGISTRATION', 'Invalid Registration', 'Vehicle not properly registered', 10000, 12, 'major'),
  ('NO_INSURANCE', 'No Valid Insurance', 'Vehicle without valid insurance', 10000, 12, 'major'),
  ('TINTED_WINDOWS', 'Tinted Windows Violation', 'Window tinting exceeds allowed limit', 3000, 3, 'minor'),
  ('NO_POLLUTION_CERT', 'No Pollution Control Certificate', 'Vehicle lacking PUC certificate', 5000, 6, 'minor'),
  ('HORN_VIOLATION', 'Excessive Horn Usage', 'Using horn in prohibited areas', 2000, 3, 'minor'),
  ('WRONG_SIDE', 'Driving on Wrong Side', 'Driving on opposite side of road', 15000, 24, 'critical');

-- Insert sample police stations
INSERT INTO police_stations (station_name, station_code, location, address, phone, email, district, province) VALUES
  ('Central Traffic Police Station', 'CTPS001', 'Colombo', 'High-level Road, Colombo 07', '+94112345678', 'central@traffic.lk', 'Colombo', 'Western'),
  ('Mount Lavinia Police Station', 'MLPS002', 'Mount Lavinia', 'Galle Road, Mount Lavinia', '+94112234567', 'mountlavinia@traffic.lk', 'Colombo', 'Western'),
  ('Kandy Traffic Police Station', 'KTPS003', 'Kandy', 'Station Road, Kandy', '+94812345678', 'kandy@traffic.lk', 'Kandy', 'Central'),
  ('Galle Police Station', 'GPS004', 'Galle', 'Main Street, Galle', '+94912345678', 'galle@traffic.lk', 'Galle', 'Southern'),
  ('Jaffna Police Station', 'JPS005', 'Jaffna', 'Fort Road, Jaffna', '+94212345678', 'jaffna@traffic.lk', 'Jaffna', 'Northern');

-- ============================================================
