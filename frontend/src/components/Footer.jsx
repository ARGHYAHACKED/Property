import React from 'react';
import { 
  Home, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ChevronRight 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300">
      {/* Main Footer Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white">55acre</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Your trusted partner in finding the perfect property or land.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-white rounded-full flex items-center justify-center transition-all text-gray-300 hover:text-black">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-white rounded-full flex items-center justify-center transition-all text-gray-300 hover:text-black">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-white rounded-full flex items-center justify-center transition-all text-gray-300 hover:text-black">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-white rounded-full flex items-center justify-center transition-all text-gray-300 hover:text-black">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Properties */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Properties</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Buy Properties
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Sell Property
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Rent Property
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Featured List
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Price Guide
                  </a>
                </li>
              </ul>
            </div>

            {/* Lands */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Lands</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Buy Land
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Sell Land
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Land Types
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Plot Size Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Location Map
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-all group">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Terms & Privacy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Contact</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-semibold text-white">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold text-white">support@55acre.com</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="font-semibold text-white">123 Real Estate Ave, City</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            {/* Newsletter Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Subscribe to Our Newsletter</h4>
                <p className="text-gray-400 text-sm mb-4">Get the latest property updates delivered to your inbox</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white border border-gray-700"
                />
                <button className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:shadow-lg transition-all transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 55acre. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-all">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-all">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-all">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
