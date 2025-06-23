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
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import BlogDetail from "./components/BlogDetail";


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
        <Route path="/service" element={<Service />} />
        <Route path="/services" element={<Services />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/blog" element={<Blog/>}/>
        <Route path="/booking" element={<Booking/>}/>
        <Route path="/help" element={<Contact/>}/>
                <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
