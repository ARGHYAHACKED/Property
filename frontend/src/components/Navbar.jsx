import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import Cookies from "js-cookie";
import axios from "axios";
import API_BASE_URL from '../config/api';

const Navbar = ({ isLoggedIn: propIsLoggedIn, isAdmin }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn || false);

  useEffect(() => {
    setIsLoggedIn(propIsLoggedIn);
  }, [propIsLoggedIn]);
  
  // Also check for admin status if not passed explicitly (fallback)
  const [internalIsAdmin, setInternalIsAdmin] = useState(isAdmin || !!localStorage.getItem("adminToken"));

  useEffect(() => {
    setInternalIsAdmin(isAdmin || !!localStorage.getItem("adminToken"));
  }, [isAdmin, location.pathname]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = Cookies.get("token") || localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          setIsLoggedIn(false);
          Cookies.remove("token");
        }
      } else {
        // Only set false if it wasn't already set true by props
        if (!propIsLoggedIn) setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, [location.pathname, propIsLoggedIn]);

  const getActiveLink = (link) => {
    if (link === "Home" && location.pathname === "/") return true;
    if (location.pathname === `/${link.toLowerCase()}`) return true;
    return false;
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center z-50 shadow-lg border-b-2 border-white/20">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="55acre Home">
        <img
          src="/logo.png"
          alt="55acre - Asset First!"
          className="h-20 w-auto object-contain"
        />
      </Link>

      {/* Hamburger Menu Button for Mobile */}
      <button
        className="md:hidden text-white text-2xl focus:outline-none hover:text-gray-300"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      {/* Navigation Links for Medium and Larger Screens */}
      <div className="hidden md:flex gap-8 items-center">
        <ul className="flex gap-8">
          {["Home", "Property", "Land"].map((link) => (
            <li
              key={link}
              className={`relative ${getActiveLink(link) ? "text-white font-bold border-b-2 border-white" : "text-gray-400"
                }`}
            >
              <Link
                to={`/${link === "Home" ? "" : link.toLowerCase()}`}
                className="hover:text-white transition font-semibold"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-4">
          {internalIsAdmin ? (
            <Link
              to="/admin"
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition font-bold uppercase tracking-wider text-sm flex items-center"
            >
              Admin Dashboard
            </Link>
          ) : isLoggedIn ? (
            <Link
              to="/profile"
              className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition flex items-center font-semibold"
            >
              <PersonIcon className="mr-2" />
              Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white px-4 py-1 rounded hover:bg-white hover:text-black transition font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200 transition font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Sliding Menu for Mobile */}
      <div
        className={`fixed top-0 right-0 h-full bg-black text-white w-3/4 max-w-sm transform transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          } z-50 border-l-2 border-white/20`}
      >
        <button
          className="absolute top-4 right-4 text-white text-2xl focus:outline-none hover:text-gray-300"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>
        <ul className="flex flex-col items-start mt-16 space-y-6 pl-6">
          {["Home", "Property", "Land"].map((link) => (
            <li key={link}>
              <Link
                to={`/${link === "Home" ? "" : link.toLowerCase()}`}
                className={`text-lg font-semibold transition ${getActiveLink(link) ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-white"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col mt-8 space-y-4 pl-6">
          {internalIsAdmin ? (
            <Link
              to="/admin"
              className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition flex items-center font-bold uppercase tracking-wider text-sm w-fit"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Dashboard
            </Link>
          ) : isLoggedIn ? (
            <Link
              to="/profile"
              className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition flex items-center font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              <PersonIcon className="mr-2" />
              Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white px-4 py-1 rounded hover:bg-white hover:text-black transition font-semibold w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200 transition font-semibold w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay for Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
