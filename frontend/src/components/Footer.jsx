import React from 'react';
import { Link } from 'react-router-dom';
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
  const linkClass = "flex items-center gap-2 hover:text-white transition-all group";
  return (
    <footer className="bg-black text-gray-300">
      {/* Main Footer Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Company Info */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white">55acre</h3>
              </Link>
              <p className="text-gray-400 text-sm mb-4">
                Asset First! Your trusted partner in finding the perfect property or land.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-white rounded-full flex items-center justify-center transition-all text-gray-300 hover:text-black">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-white rounded-full flex items-center justify-center transition-all text-gray-300 hover:text-black">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-white rounded-full flex items-center justify-center transition-all text-gray-300 hover:text-black">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-white rounded-full flex items-center justify-center transition-all text-gray-300 hover:text-black">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Properties */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Properties</h4>
              <ul className="space-y-3">
                <li><Link to="/property" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Buy Properties</Link></li>
                <li><Link to="/add-property" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Sell Property</Link></li>
                <li><Link to="/property" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Rent Property</Link></li>
                <li><Link to="/property" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Featured List</Link></li>
                <li><Link to="/property" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Price Guide</Link></li>
              </ul>
            </div>

            {/* Lands */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Lands</h4>
              <ul className="space-y-3">
                <li><Link to="/land" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Buy Land</Link></li>
                <li><Link to="/add-land" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Sell Land</Link></li>
                <li><Link to="/land" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Land Types</Link></li>
                <li><Link to="/land" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Plot Size Guide</Link></li>
                <li><Link to="/land" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Location Map</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Support</h4>
              <ul className="space-y-3">
                <li><Link to="/" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />About Us</Link></li>
                <li><Link to="/" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Contact Us</Link></li>
                <li><Link to="/" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />FAQ</Link></li>
                <li><Link to="/" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Blog</Link></li>
                <li><Link to="/" className={linkClass}><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />Terms & Privacy</Link></li>
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
              <div className="flex gap-0">
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL"
                  className="flex-1 px-4 py-3 rounded-none bg-black text-white placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-white border-4 border-white font-black"
                />
                <button className="px-8 py-3 bg-white text-black font-black uppercase tracking-tighter rounded-none hover:bg-gray-200 transition-all">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                © 2026 55acre. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-all">Privacy Policy</Link>
                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-all">Terms of Service</Link>
                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-all">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
