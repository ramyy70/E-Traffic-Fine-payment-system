-- Refactored Schema with Split User Tables

-- Clean up existing tables securely
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS fines CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS police_officers CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS users CASCADE; -- Old table

-- Clean up existing enums
DROP TYPE IF EXISTS fine_status CASCADE;
DROP TYPE IF EXISTS message_status CASCADE;

-- Create enums
CREATE TYPE fine_status AS ENUM ('unpaid', 'paid', 'overdue', 'cancelled');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

-- 1. Drivers Table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role VARCHAR(20) DEFAULT 'driver',
    
    -- Driver Specific Fields
    nic VARCHAR(20) UNIQUE NOT NULL,
    dob DATE,
    license_number VARCHAR(50) UNIQUE,
    expiry_date DATE,
    address_line_1 TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Police Officers Table
CREATE TABLE police_officers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role VARCHAR(20) DEFAULT 'policeman',
    
    -- Police Specific Fields
    badge_number VARCHAR(100) UNIQUE NOT NULL,
    rank VARCHAR(100),
    assigned_station VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Admin Users Table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role VARCHAR(20) DEFAULT 'admin',
    
    -- Admin Specific Fields
    admin_code VARCHAR(100) UNIQUE NOT NULL,
    station_name VARCHAR(255),
    station_verification_code VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Fines Table (updated to reference specific tables)
CREATE TABLE fines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE, -- Nullable for unregistered drivers
    policeman_id UUID NOT NULL REFERENCES police_officers(id),
    
    driver_nic VARCHAR(20) NOT NULL, -- Track by NIC even if not registered
    driver_name VARCHAR(255) NOT NULL,
    driver_address TEXT NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL,
    date_of_offence TIMESTAMP WITH TIME ZONE NOT NULL,
    nature_of_offence VARCHAR(255) NOT NULL,
    fine_amount DECIMAL(10, 2) NOT NULL,
    valid_time_from TIMESTAMP WITH TIME ZONE,
    valid_time_to TIMESTAMP WITH TIME ZONE,
    dl_tp_no VARCHAR(100) NOT NULL,
    competent_to_drive_new_dl BOOLEAN DEFAULT false,
    competent_to_drive_old_dl BOOLEAN DEFAULT false,
    
    police_station VARCHAR(255) NOT NULL,
    place_of_offence TEXT,
    time_of_offence TEXT,
    court VARCHAR(255),
    court_date DATE,
    issuing_officer VARCHAR(255),
    
    status fine_status DEFAULT 'unpaid',
    qr_code_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fine_id UUID NOT NULL REFERENCES fines(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES drivers(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_reference VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'successful',
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Messages Table (Using UUIDs without strict FK since sender can be from 3 different tables)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    receiver_id UUID, 
    sender_role VARCHAR(20) NOT NULL, -- To help identify which table the sender is in
    content TEXT NOT NULL,
    status message_status DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fines_driver_id ON fines(driver_id);
CREATE INDEX idx_fines_policeman_id ON fines(policeman_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
