-- Supabase Database Schema for E-Traffic Fine System

-- Clean up existing tables safely
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS fines CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Clean up existing enums securely
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS fine_status CASCADE;
DROP TYPE IF EXISTS message_status CASCADE;

-- Create enums for the system
CREATE TYPE user_role AS ENUM ('driver', 'policeman', 'admin');
CREATE TYPE fine_status AS ENUM ('unpaid', 'paid', 'overdue', 'cancelled');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

-- Users Table (handling all roles dynamically)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role user_role NOT NULL,
    
    -- Driver specific
    nic VARCHAR(20) UNIQUE,
    address TEXT,
    
    -- Policeman specific
    badge_number VARCHAR(100) UNIQUE,
    rank VARCHAR(100),
    assigned_station VARCHAR(255),
    
    -- Admin specific
    station_name VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fines Table
CREATE TABLE fines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    policeman_id UUID NOT NULL REFERENCES users(id),
    
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
    court VARCHAR(255),
    court_date DATE,
    issuing_officer VARCHAR(255),
    
    status fine_status DEFAULT 'unpaid',
    qr_code_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index to optimize querying fines by driver
CREATE INDEX idx_fines_driver_id ON fines(driver_id);
CREATE INDEX idx_fines_policeman_id ON fines(policeman_id);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fine_id UUID NOT NULL REFERENCES fines(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- e.g., 'gateway', 'qr_manual'
    transaction_reference VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'successful',
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID REFERENCES users(id), -- Nullable for broadcasting or system messages
    content TEXT NOT NULL,
    status message_status DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
