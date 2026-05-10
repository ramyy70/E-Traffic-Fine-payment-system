import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role, full_name, ...otherData } = req.body;
    let tableName = '';
    
    // Determine target table
    if (role === 'driver') tableName = 'drivers';
    else if (role === 'policeman') tableName = 'police_officers';
    else if (role === 'admin') tableName = 'admin_users';
    else return res.status(400).json({ error: 'Invalid role provided' });

    const insertData: any = {
      email,
      password_hash: 'hashed_password_mock', // Mocked hash for demo
      full_name,
      phone_number: otherData.phone_number
    };

    // Add role-specific data
    if (role === 'driver') {
      // Check if a placeholder driver profile was created during fine issuance
      const { data: existingDriver } = await supabase
        .from('drivers')
        .select('id, email, license_number')
        .eq('nic', otherData.nic)
        .maybeSingle();

      // Check if license number is already in use by ANOTHER user
      const { data: licenseCheck } = await supabase
        .from('drivers')
        .select('id')
        .eq('license_number', otherData.license_number)
        .maybeSingle();
        
      if (licenseCheck && (!existingDriver || licenseCheck.id !== existingDriver.id)) {
        return res.status(400).json({ error: 'License number is already registered to another account.' });
      }

      if (existingDriver) {
        if (!existingDriver.email.startsWith('unregistered_')) {
          return res.status(400).json({ error: 'User with this NIC is already registered.' });
        }

        // Update the placeholder driver with real registration data
        const { data: userData, error: userError } = await supabase
          .from('drivers')
          .update({
            ...insertData,
            nic: otherData.nic,
            dob: otherData.dob,
            license_number: otherData.license_number,
            expiry_date: otherData.expiry_date,
            address_line_1: otherData.address_line_1,
            city: otherData.city,
            postal_code: otherData.postal_code
          })
          .eq('id', existingDriver.id)
          .select()
          .single();

        if (userError) {
          return res.status(400).json({ error: userError.message });
        }

        return res.status(201).json({ 
          message: 'User registered successfully', 
          user: { ...userData, role } 
        });
      }

      insertData.nic = otherData.nic;
      insertData.dob = otherData.dob;
      insertData.license_number = otherData.license_number;
      insertData.expiry_date = otherData.expiry_date;
      insertData.address_line_1 = otherData.address_line_1;
      insertData.city = otherData.city;
      insertData.postal_code = otherData.postal_code;
    } else if (role === 'policeman') {
      insertData.badge_number = otherData.badge_number;
      insertData.rank = otherData.rank;
      insertData.assigned_station = otherData.assigned_station;
    } else if (role === 'admin') {
      insertData.admin_code = otherData.admin_code;
      insertData.station_name = otherData.station_name;
      insertData.station_verification_code = otherData.station_verification_code;
    }

    const { data: userData, error: userError } = await supabase
      .from(tableName)
      .insert([insertData])
      .select()
      .single();

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    return res.status(201).json({ 
      message: 'User registered successfully', 
      user: { ...userData, role } // Explicitly return role for frontend reference
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Check drivers table
    let { data: user, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('email', email)
      .single();

    if (user && !error) {
      return res.status(200).json({ message: 'Login successful', user: { ...user, role: 'driver' } });
    }

    // Check police_officers table
    ({ data: user, error } = await supabase
      .from('police_officers')
      .select('*')
      .eq('email', email)
      .single());

    if (user && !error) {
      return res.status(200).json({ message: 'Login successful', user: { ...user, role: 'policeman' } });
    }

    // Check admin_users table
    ({ data: user, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single());

    if (user && !error) {
      return res.status(200).json({ message: 'Login successful', user: { ...user, role: 'admin' } });
    }

    return res.status(401).json({ error: 'Invalid credentials or user not found' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
