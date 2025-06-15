import React from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from "./pages/Register";
import User from "./pages/User";
import About from "./pages/About"
import Blog from "./pages/Blog"
function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/about" element={<About />}/>
        <Route path="/blog" element={<Blog/>}/>
      </Routes>
    </Router>

  );
}

export default App;
