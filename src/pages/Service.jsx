import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaDollarSign, FaChevronRight } from "react-icons/fa";
import MainLayout from "../layout/MainLayout";

const allServices = [
  {
    id: 1,
    name: "Online Medicine Purchase",
    specialty: "E-commerce",
    yearsExperience: "8 years",
    price: 80,
    time: "08:00 AM-11:00 AM",
    image: "/src/assets/images/service-purchases.png",
  },
  {
    id: 2,
    name: "Online Consultation",
    specialty: "Counseling",
    yearsExperience: "10 years",
    price: 120,
    time: "09:00 AM-12:00 PM",
    image: "/src/assets/images/service-doctor.png",
  },
  {
    id: 3,
    name: "Indoor medical test",
    specialty: "Endocrinology",
    yearsExperience: "15 years",
    price: 150,
    time: "01:00 PM-04:00 PM",
    image: "/src/assets/images/service-lab.png",
  },
  {
    id: 4,
    name: "Health Insurance Consultation",
    specialty: "Insurance",
    yearsExperience: "10 years",
    price: 100,
    time: "10:00 AM-01:00 PM",
    image: "/src/assets/images/service-insurance.png",
  },
  {
    id: 5,
    name: "Voice Therapy ",
    specialty: "Therapy",
    yearsExperience: "7 years",
    price: 70,
    time: "09:00 AM-12:00 PM",
    image: "/src/assets/images/service-Voices.png",
  },
  {
    id: 6,
    name: "PrEP & PEP Consultation",
    specialty: "STI Prevention",
    yearsExperience: "9 years",
    price: 80,
    time: "02:00 PM-05:00 PM",
    image: "/src/assets/images/service-PEP.png",
  },
  {
    id: 7,
    name: "Hormone Level Test (Estrogen, Testosterone)",
    specialty: "Endocrinology",
    yearsExperience: "8 years",
    price: 80,
    time: "08:00 AM-11:00 AM",
    image: "/src/assets/images/service-Test.png",
  },
  {
    id: 8,
    name: "Expanded Programme on Immunization (EPI)",
    specialty: "Vaccination & Immunization",
    yearsExperience: "10 years",
    price: 110,
    time: "09:00 AM-12:00 PM",
    image: "/src/assets/images/service-Vaccination.png",
  },
  {
    id: 9,
    name: "Mental Health consultation for LGBTQ+ individuals",
    specialty: "Mental Health aid",
    yearsExperience: "6 years",
    price: 70,
    time: "10:00 AM-01:00 PM",
    image: "/src/assets/images/service-MentalHealth.png",
  },
  {
    id: 10,
    name: "Menstrual cycle tracking and management",
    specialty: "Period Health",
    yearsExperience: "5 years",
    price: 40,
    time: "06:00 PM-08:00 PM",
    image: "/src/assets/images/service-Menstrual.jpg",
  },
];

const Service = () => {
  const [displayName, setDisplayName] = useState("Guest");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setDisplayName(storedUsername);
    }
  }, []);

  return (
    <MainLayout activeMenu="service" displayName={displayName}>
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
                Book an appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Service;


