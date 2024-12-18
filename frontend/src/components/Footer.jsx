import React from 'react';
import { Instagram, Facebook } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-6">
      <div className="mb-4">
        <p>© 2024 Property Post. All rights reserved.</p>
      </div>
      <div className="flex justify-center space-x-6">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-green-500 transition duration-300"
        >
          <Instagram fontSize="large" />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-green-500 transition duration-300"
        >
          <Facebook fontSize="large" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
