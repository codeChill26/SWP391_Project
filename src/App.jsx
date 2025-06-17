import React from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from "./pages/Register";
import About from "./pages/About";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Blog from "./pages/Blog"
import Calendar from "./pages/Calendar"
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Service from "./pages/Service";
import Booking from "./pages/Booking";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Service />} />
        <Route path="/about" element={<About />}/>
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/booking" element={<Booking/>}/>
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
