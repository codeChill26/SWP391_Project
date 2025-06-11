import React from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import ServiceSection from "../components/ServiceSection";
import BlogSection from "../components/BlogSection";
import Footer from "../components/Footer";

const Home = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <div className="pt-24 px-4 sm:px-6 lg:px-8">
      <Banner />
      <ServiceSection />
      <BlogSection />
    </div>
    <Footer />
  </div>
);

export default Home;