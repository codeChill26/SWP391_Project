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
          <Route path="/service" element={<Service />}/>
          <Route path="/services" element={<ServiceUser />} />
          <Route path="/blog" element={<Blog/>}/>
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <ToastContainer />
      </Router>
    </UserProvider>
  );
}

export default App;
