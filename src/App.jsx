import React from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Guest/Login'
import Register from "./pages/Guest/Register";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './context/UserContext';
import Dashboard from "./pages/Patient/Dashboard";
import Profile from "./pages/Patient/Profile";
import Calendar from "./pages/Patient/Calendar";
import Service from "./pages/Guest/Service";
import Blog from "./pages/Guest/Blog";
import Admin from "./pages/Admin/Admin";
import About from "./pages/Guest/About";
import ServiceUser from "./pages/Patient/ServiceUser";
import { DoctorDashboard } from "./pages/doctor/DoctorDashboard";
import { DoctorAppointment } from "./pages/doctor/DoctorAppointment";
import { AppointmentDetail } from "./pages/Patient/AppointmentDetail";
import AppointmentList from "./pages/Patient/AppointmentList";
import StaffDashboard from "./pages/staff/StaffDashboard";
import { StaffAppointment } from "./pages/staff/StaffAppointment";
import { StaffAppointmentDetail } from "./pages/staff/StaffApointmentDetail";
import { DoctorAppointmentDetail } from "./pages/doctor/DoctorAppointmentDetail";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/appointment" element={<AppointmentList />} />
          <Route path="/appointment/:id" element={<AppointmentDetail />} />
          <Route path="/service" element={<Service />}/>
          <Route path="/services" element={<ServiceUser />} />
          <Route path="/blog" element={<Blog/>}/>
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/appointment" element={<DoctorAppointment />} />
          <Route path="/doctor/appointment/:id" element={<DoctorAppointmentDetail />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/appointment" element={<StaffAppointment />} />
          <Route path="/staff/appointment/:id" element={<StaffAppointmentDetail />} />
        </Routes>
        <ToastContainer />
      </Router>
    </UserProvider>
  );
}

export default App;
