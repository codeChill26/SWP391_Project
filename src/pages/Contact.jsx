import React, { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";

const Contact = () => {
  const [displayName, setDisplayName] = useState("Guest");

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setDisplayName(storedUsername);
    }
  }, []);

  return (
    <MainLayout activeMenu="contact" displayName={displayName}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-700 mb-4">If you have any questions or inquiries, feel free to reach out to us using the information below:</p>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Email:</h2>
              <p className="text-gray-600">support@genhealth.com</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Phone:</h2>
              <p className="text-gray-600">+1 (123) 456-7890</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Address:</h2>
              <p className="text-gray-600">123 Healthcare Lane, Medical City, MC 98765</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact; 