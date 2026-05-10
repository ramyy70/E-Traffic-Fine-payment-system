import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DriverDashboard from './pages/driver/DriverDashboard';
import PaymentGateway from './pages/driver/PaymentGateway';
import AdminDashboard from './pages/admin/AdminDashboard';
import PolicemanDashboard from './pages/policeman/PolicemanDashboard';

import ProfilePage from './pages/common/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/pay/:id" element={<PaymentGateway />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/policeman" element={<PolicemanDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
