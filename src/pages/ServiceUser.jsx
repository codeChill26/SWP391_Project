import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { useUser } from '../context/UserContext';

const allServices = [
  {
    id: 1,
    title: "Gender-Affirming Hormone Therapy",
    description: "Comprehensive hormone therapy services including consultation, monitoring, and ongoing support for transgender and non-binary individuals.",
    icon: "💊",
    price: "From $150/month",
    duration: "Ongoing treatment"
  },
  {
    id: 2,
    title: "Mental Health Support",
    description: "Professional counseling and therapy services specifically designed for gender-diverse individuals and their families.",
    icon: "🧠",
    price: "$120/session",
    duration: "50 minutes"
  },
  {
    id: 3,
    title: "Voice Therapy",
    description: "Specialized voice training and therapy to help align voice characteristics with gender identity.",
    icon: "🎤",
    price: "$100/session",
    duration: "45 minutes"
  },
  {
    id: 4,
    title: "Facial Feminization Surgery",
    description: "Comprehensive facial feminization procedures to enhance feminine features.",
    icon: "✨",
    price: "From $15,000",
    duration: "4-6 hours"
  },
  {
    id: 5,
    title: "Top Surgery",
    description: "Chest masculinization or feminization surgery with pre and post-operative care.",
    icon: "🔬",
    price: "From $8,000",
    duration: "2-3 hours"
  },
  {
    id: 6,
    title: "Legal Support",
    description: "Assistance with legal documentation changes, name changes, and other legal aspects of gender transition.",
    icon: "⚖️",
    price: "$200/hour",
    duration: "Varies"
  },
  {
    id: 7,
    title: "Hair Removal",
    description: "Laser hair removal and electrolysis services for gender-affirming care.",
    icon: "💇",
    price: "From $75/session",
    duration: "30-60 minutes"
  },
  {
    id: 8,
    title: "Fertility Preservation",
    description: "Egg or sperm freezing services before starting hormone therapy.",
    icon: "🥚",
    price: "From $5,000",
    duration: "2-3 weeks"
  },
  {
    id: 9,
    title: "Support Groups",
    description: "Regular support group meetings for transgender and non-binary individuals.",
    icon: "👥",
    price: "Free",
    duration: "90 minutes"
  },
  {
    id: 10,
    title: "Nutritional Counseling",
    description: "Specialized nutritional guidance for individuals undergoing hormone therapy.",
    icon: "🥗",
    price: "$80/session",
    duration: "60 minutes"
  }
];

const ServiceUser = () => {
  const navigate = useNavigate();
  const { userData } = useUser();

  const handleBooking = (serviceId) => {
    navigate(`/calendar?service=${serviceId}`);
  };

  return (
    <MainLayout activeMenu="services" displayName={userData.name || 'User'}>
      {/* Hero Section */}
      <div className="bg-[#3B9AB8] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Comprehensive gender healthcare services designed to support your journey with expert care and understanding.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-[#3B9AB8]">{service.price}</p>
                      <p className="text-sm text-gray-500">{service.duration}</p>
                    </div>
                    <Button
                      type="primary"
                      onClick={() => handleBooking(service.id)}
                      style={{
                        backgroundColor: '#3B9AB8',
                        borderColor: '#3B9AB8',
                      }}
                    >
                      Booking
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ServiceUser; 