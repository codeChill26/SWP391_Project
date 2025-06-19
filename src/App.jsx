import React from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import Service from "./pages/Service";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './context/UserContext';
import { MockProvider } from './context/MockContext';
import ServiceUser from "./pages/ServiceUser";

function App() {
  return (
    <MockProvider>
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
    </MockProvider>
  );
}

export default App;
