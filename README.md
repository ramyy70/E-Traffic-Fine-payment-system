# E-Traffic Fine Payment System (Frontend Demo)

A React-based frontend demo for a Traffic Fine Management System. This project simulates key features including role-based login (Driver/Admin), fine payment, complaint submission, and multilingual support (English, Sinhala, Tamil).

## Features

- **Role-Based Access**:
  - **Driver**: View fines, pay fines (simulated), view history, submit complaints.
  - **Admin**: Review complaints (Approve/Reject), view audit logs.
- **Multilingual**: Toggle between English, Sinhala, and Tamil.
- **Mock Payment**: Simulates card payment process.
- **Notifications**: Real-time updates for payments and status changes.
- **Persistence**: Usage data is saved to `localStorage` (clearing browser cache resets data).

## Tech Stack

- React (Vite)
- Tailwind CSS
- Lucide React (Icons)
- Context API (State Management)

## Setup & Run

1.  **Install Dependencies** (if not already done):
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Click the URL shown in the terminal (usually `http://localhost:5173`).

## Login Credentials (Demo)

- **Driver**: Click "Login as Driver" (Auto-logs in as `Kamal Perera`)
- **Admin**: Click "Login as Admin" (Auto-logs in as `Officer Silva`)

## Project Structure

- `src/components`: UI components (including Layout, Driver modules, Admin modules).
- `src/context`: Global state (Auth, Data, Language).
- `src/data`: Mock data and translations.
- `src/pages`: Main page views.
