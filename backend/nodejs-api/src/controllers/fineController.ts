import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import QRCode from 'qrcode';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com';

const getPayPalAccessToken = async () => {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const data = await response.json();
  return data.access_token;
};


export const issueFine = async (req: Request, res: Response) => {
  try {
    const { driver_nic, policeman_number, rank, ...defaultData } = req.body;
    
    // 1. Find Driver by NIC (Optional - driver might not be registered yet)
    let { data: driver } = await supabase
      .from('drivers')
      .select('id')
      .eq('nic', driver_nic)
      .maybeSingle();

    if (!driver) {
      // Create a placeholder driver record to satisfy the driver_id constraint
      const { data: newDriver, error: newDriverError } = await supabase
        .from('drivers')
        .insert([{
          nic: driver_nic,
          full_name: defaultData.driver_name,
          email: `unregistered_${driver_nic}@system.local`,
          password_hash: 'unregistered_mock_hash',
          address_line_1: defaultData.driver_address
        }])
        .select('id')
        .single();
        
      if (newDriverError) {
        return res.status(400).json({ error: 'Failed to create placeholder driver profile: ' + newDriverError.message });
      }
      driver = newDriver;
    }

    const OFFICIAL_OFFENCES: Record<string, number> = {
      "Identification plates": 1000,
      "Not carrying Revenue License (R.L.)": 1000,
      "Contravening R.L. provisions": 1000,
      "Driving emergency/service vehicles without D.L.": 1000,
      "Driving special purpose vehicles without license": 1000,
      "Driving hazardous loaded vehicle without license": 1000,
      "Not having license for specific class": 1000,
      "Not carrying driving license": 1000,
      "Not having instructor’s license": 2000,
      "Contravening speed limits": 3000,
      "Disobeying road rules": 2000,
      "Obstructing control of vehicle": 1000,
      "Failure to give signals": 1000,
      "Reversing for long distance": 1000,
      "Improper sound/light signals": 1000,
      "Excessive smoke emission": 1000,
      "Riding on running boards": 500,
      "Excess persons in front seat": 1000,
      "Not using seat belts": 1000,
      "Not wearing helmet": 1000,
      "Improper advertisements": 1000,
      "Excessive noise": 1000,
      "Disobeying police/traffic signals": 2000,
      "Not following traffic signals": 1000,
      "No precautions when fueling": 1000,
      "Improper halting/parking": 1000,
      "No precautions when parking": 2000,
      "Excess passengers (car/private coach)": 500,
      "Excess passengers (omnibus)": 500,
      "Excess goods (lorry/motor tricycle)": 500,
      "Excess persons in lorry": 500,
      "Violation of motor vehicle regulations": 1000,
      "No emission/fitness certificate": 500
    };

    // 2. Map standard offence penalties automatically
    let amount = defaultData.fine_amount ? Number(defaultData.fine_amount) : 1000;
    const offence = defaultData.nature_of_offence;
    if (OFFICIAL_OFFENCES[offence]) {
       amount = OFFICIAL_OFFENCES[offence];
    }

    // Sanitize dates/times to prevent 'invalid input syntax' errors
    const sanitizedData = { ...defaultData };
    if (!sanitizedData.valid_time_from) {
      delete sanitizedData.valid_time_from;
    } else if (sanitizedData.valid_time_from.includes('-') && sanitizedData.valid_time_from.length === 10) {
      sanitizedData.valid_time_from = `${sanitizedData.valid_time_from}T00:00:00`;
    } else if (sanitizedData.date_of_offence) {
      sanitizedData.valid_time_from = `${sanitizedData.date_of_offence}T${sanitizedData.valid_time_from}:00`;
    }

    if (!sanitizedData.valid_time_to) {
      delete sanitizedData.valid_time_to;
    } else if (sanitizedData.valid_time_to.includes('-') && sanitizedData.valid_time_to.length === 10) {
      sanitizedData.valid_time_to = `${sanitizedData.valid_time_to}T00:00:00`;
    } else if (sanitizedData.date_of_offence) {
      sanitizedData.valid_time_to = `${sanitizedData.date_of_offence}T${sanitizedData.valid_time_to}:00`;
    }

    if (!sanitizedData.court_date) delete sanitizedData.court_date;

    const fineData = {
      ...sanitizedData,
      driver_id: driver.id,
      fine_amount: amount,
      status: 'unpaid'
    };

    // 3. Insert Fine Database
    const { data: fine, error } = await supabase
      .from('fines')
      .insert([fineData])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 4. Generate Live QR Code URL encompassing the fine id
    const paymentUrl = `http://localhost:5173/pay/${fine.id}`; // local dev url
    const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl);

    // Update the fine with its newly generated QR graphic
    await supabase
      .from('fines')
      .update({ qr_code_url: qrCodeDataUrl })
      .eq('id', fine.id);

    fine.qr_code_url = qrCodeDataUrl;

    return res.status(201).json({ message: 'Fine issued successfully', fine });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getFinesForDriver = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const { data: fines, error } = await supabase
      .from('fines')
      .select('*')
      .eq('driver_id', driverId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ fines });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getFineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data: fine, error } = await supabase
      .from('fines')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !fine) {
      return res.status(404).json({ error: 'Fine not found' });
    }

    return res.status(200).json({ fine });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const payFine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { payment_method } = req.body;

    // 1. Fetch fine to check status and driver_id
    const { data: fine, error: fetchError } = await supabase
      .from('fines')
      .select('status, fine_amount, driver_id, policeman_id')
      .eq('id', id)
      .single();

    if (fetchError || !fine) {
      return res.status(404).json({ error: 'Fine not found' });
    }

    if (fine.status === 'paid') {
      return res.status(400).json({ error: 'Fine is already paid' });
    }

    // 2. Update fine status
    const { error: updateError } = await supabase
      .from('fines')
      .update({ status: 'paid' })
      .eq('id', id);

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    // 3. Insert mock payment record
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        fine_id: id,
        driver_id: fine.driver_id,
        amount: fine.fine_amount,
        payment_method: payment_method || 'gateway',
        transaction_reference: `TXN-${Math.floor(Math.random() * 1000000)}`
      });

    if (insertError) {
      // Non-fatal, payment might be successful but receipt record failed
      console.error('Failed to log payment:', insertError.message);
    }

    // 4. Send Message Notification to Policeman
    if (fine.policeman_id && fine.driver_id) {
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          sender_id: fine.driver_id,
          receiver_id: fine.policeman_id,
          content: `Payment cleared natively: Fine ID ${id.split('-')[0].toUpperCase()} for Rs. ${fine.fine_amount} has been successfully paid by the driver.`
        });
      if (msgError) console.error('Failed to send message notification:', msgError.message);
    }

    return res.status(200).json({ message: 'Payment successful', fineId: id });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPaymentsForDriver = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*, fines(id, nature_of_offence)')
      .eq('driver_id', driverId)
      .order('paid_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ payments });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllFines = async (req: Request, res: Response) => {
  try {
    const { data: fines, error } = await supabase
      .from('fines')
      .select('*, driver:drivers(nic)')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ fines });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const { data: fines, error: finesError } = await supabase
      .from('fines')
      .select('id, fine_amount, status');
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, role');
      
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('transaction_reference, amount, paid_at')
      .order('paid_at', { ascending: false })
      .limit(3);

    if (finesError || usersError || paymentsError) {
      throw new Error('Failed fetching aggregated admin stats');
    }

    const totalFines = fines?.length || 0;
    const totalRevenue = fines?.reduce((sum, fine) => sum + Number(fine.fine_amount), 0) || 0;
    const registeredDrivers = users?.filter(u => u.role === 'driver').length || 0;
    const activePolicemen = users?.filter(u => u.role === 'policeman').length || 0;

    return res.status(200).json({ 
      stats: {
        totalFines,
        totalRevenue,
        registeredDrivers,
        activePolicemen,
        recentPayments: payments || []
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createPayPalOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Fetch fine to check status and amount
    const { data: fine, error: fetchError } = await supabase
      .from('fines')
      .select('status, fine_amount')
      .eq('id', id)
      .single();

    if (fetchError || !fine) {
      return res.status(404).json({ error: 'Fine not found' });
    }

    if (fine.status === 'paid') {
      return res.status(400).json({ error: 'Fine is already paid' });
    }

    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: fine.fine_amount.toString(),
            },
            description: `Payment for fine ${id}`
          },
        ],
      }),
    });
    
    const data = await response.json();
    if (data.id) {
      return res.status(200).json({ id: data.id });
    } else {
      return res.status(400).json({ error: 'Failed to create PayPal order', details: data });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const capturePayPalOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { orderID } = req.body;

    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const data = await response.json();
    
    if (data.status === 'COMPLETED') {
      const { data: fine, error: fetchError } = await supabase
        .from('fines')
        .select('status, fine_amount, driver_id, policeman_id')
        .eq('id', id)
        .single();

      if (!fetchError && fine && fine.status !== 'paid') {
        await supabase
          .from('fines')
          .update({ status: 'paid' })
          .eq('id', id);

        await supabase
          .from('payments')
          .insert({
            fine_id: id,
            driver_id: fine.driver_id,
            amount: fine.fine_amount,
            payment_method: 'paypal',
            transaction_reference: data.id
          });
          
        if (fine.policeman_id && fine.driver_id) {
          await supabase
            .from('messages')
            .insert({
              sender_id: fine.driver_id,
              receiver_id: fine.policeman_id,
              content: `Payment cleared via PayPal: Fine ID ${id.split('-')[0].toUpperCase()} for Rs. ${fine.fine_amount} has been successfully paid by the driver.`
            });
        }
      }

      return res.status(200).json({ message: 'Payment successful', data });
    } else {
      return res.status(400).json({ error: 'Payment capture failed', details: data });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
