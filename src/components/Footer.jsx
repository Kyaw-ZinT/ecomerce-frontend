// frontend/src/components/Footer.jsx

import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center">
        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-4 md:space-y-0 mb-6">
          <a href="#" className="hover:text-blue-400 transition duration-300">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-400 transition duration-300">
            Terms of Service
          </a>
          <a href="#" className="hover:text-blue-400 transition duration-300">
            Refund Policy
          </a>
        </div>
        <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} My E-Shop. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          {/* Social Media Icons (Example) */}
          <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">
            <img
              src="https://img.icons8.com/ios-filled/24/ffffff/facebook-new.png"
              alt="Facebook"
              className="h-6 w-6"
            />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">
            <img src="https://img.icons8.com/ios-filled/24/ffffff/twitter.png" alt="Twitter" className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-300">
            <img
              src="https://img.icons8.com/ios-filled/24/ffffff/instagram-new.png"
              alt="Instagram"
              className="h-6 w-6"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
