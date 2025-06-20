import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaDollarSign, FaChevronRight } from "react-icons/fa";
import { UserLayout } from '../layout/userLayout'

const allServices = [
  {
    id: 1,
    name: "Mua thuốc trực tuyến",
    specialty: "Đặt thuốc ngay",
    yearsExperience: "8 years",
    price: 80,
    time: "08:00 AM-11:00 AM",
    image: "/src/assets/images/service1.png",
  },
  {
    id: 2,
    name: "Genetic Counseling for Gender Identity",
    specialty: "Genetics & Counseling",
    yearsExperience: "10 years",
    price: 120,
    time: "09:00 AM-12:00 PM",
    image: "/src/assets/images/service2.png",
  },
  {
    id: 3,
    name: "Gender-Affirming Hormone Therapy Consultation",
    specialty: "Endocrinology",
    yearsExperience: "15 years",
    price: 150,
    time: "01:00 PM-04:00 PM",
    image: "/src/assets/images/service3.png",
  },
  {
    id: 4,
    name: "Fertility Preservation Consultation",
    specialty: "Reproductive Health",
    yearsExperience: "10 years",
    price: 100,
    time: "10:00 AM-01:00 PM",
    image: "/src/assets/images/service1.png",
  },
  {
    id: 5,
    name: "Sexual Health Screening (STIs)",
    specialty: "Infectious Diseases",
    yearsExperience: "7 years",
    price: 70,
    time: "09:00 AM-12:00 PM",
    image: "/src/assets/images/service2.png",
  },
  {
    id: 6,
    name: "Vocal Feminization/Masculinization Therapy",
    specialty: "Speech Pathology",
    yearsExperience: "9 years",
    price: 90,
    time: "02:00 PM-05:00 PM",
    image: "/src/assets/images/service3.png",
  },
  {
    id: 7,
    name: "Mental Health Support for Transitioning Individuals",
    specialty: "Psychiatry & Counseling",
    yearsExperience: "12 years",
    price: 130,
    time: "03:00 PM-06:00 PM",
    image: "/src/assets/images/service1.png",
  },
  {
    id: 8,
    name: "Post-Surgical Care and Recovery Planning",
    specialty: "Post-Op Care",
    yearsExperience: "10 years",
    price: 110,
    time: "09:00 AM-12:00 PM",
    image: "/src/assets/images/service2.png",
  },
  {
    id: 9,
    name: "Legal Name and Gender Marker Change Assistance",
    specialty: "Legal Aid & Advocacy",
    yearsExperience: "6 years",
    price: 75,
    time: "10:00 AM-01:00 PM",
    image: "/src/assets/images/service3.png",
  },
  {
    id: 10,
    name: "Support Groups for LGBTQ+ Individuals",
    specialty: "Community Support",
    yearsExperience: "5 years",
    price: 40,
    time: "06:00 PM-08:00 PM",
    image: "/src/assets/images/service1.png",
  },
];

const Services = () => {
  const [displayName, setDisplayName] = useState("Guest");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setDisplayName(storedUsername);
    }
  }, []);

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h1>
      
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allServices.map(service => (
                  <div key={service.id} className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col items-center text-center">
                    <img src={service.image} alt={service.name} className="w-24 h-24 rounded-full object-cover mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.name}</h3>
                    <p className="text-gray-600 text-sm">{service.specialty} | {service.yearsExperience} experience</p>
                    <div className="flex justify-center my-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{service.specialty}</span>
                    </div>
                    <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-200">
                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-1 text-sm" /> {service.time}
                      </div>
                      <div className="flex items-center text-gray-800 font-semibold">
                        <FaDollarSign className="mr-1 text-sm" /> {service.price}
                      </div>
                    </div>
                    <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors w-full">
                      See more details
                    </button>
                  </div>
                ))}
              </div>
            </div>
    </UserLayout>
  )
}

export default Services