import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material"; // Import Tooltip for enhanced hover effect
import HomeIcon from "@mui/icons-material/Home"; // Material UI Icon for cursor

const HeroSection = () => {
  const images = [
    "https://images.unsplash.com/photo-1645241910531-d32735b412a2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNpdHRpbmclMjBSb29tfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1505843694770-3461f546bd8f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNpdHRpbmclMjBSb29tfGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1673014200221-524696a1edd9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHNpdHRpbmclMjBSb29tfGVufDB8fDB8fHww",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cursorStyle, setCursorStyle] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorStyle({ top: e.clientY - 15, left: e.clientX - 15 });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="h-screen bg-gradient-to-r from-black via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center md:justify-between md:flex-row px-8 relative">
      {/* Custom Cursor */}
      <div
        className="fixed pointer-events-none w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        style={{
          top: `${cursorStyle.top}px`,
          left: `${cursorStyle.left}px`,
          transform: "translate(-50%, -50%)",
          // z-index:"10000000",
        }}
      >
        <Tooltip title="Explore Properties" arrow>
          <HomeIcon style={{ color: "white" }} />
        </Tooltip>
      </div>

      {/* Left Section */}
      <div className="w-full md:w-1/2 z-10 text-center md:text-left mb-6 md:mb-0 md:mt-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-snug">
          Luxury Apartment for Buy and Sell in Prime Location
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6">
          Don’t miss out on this opportunity to live in the lap of luxury.
          Contact us today to schedule a viewing and make this apartment your
          new home!
        </p>
        <Link
          to="/land"
          className="block bg-pink-400 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-pink-500 transition w-auto max-w-[150px] mx-auto md:mx-0"
        >
          Explore More
        </Link>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-6 md:mb-0">
        <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] overflow-hidden rounded-lg shadow-lg group">
          <img
            src={images[currentImageIndex]}
            alt="Luxury Room"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-center text-xs sm:text-sm md:text-base lg:text-lg py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            Limited Time Offer - Explore Now!
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
