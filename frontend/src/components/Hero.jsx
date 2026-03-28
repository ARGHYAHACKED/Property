import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material"; 
import HomeIcon from "@mui/icons-material/Home"; 
import axios from "axios";
import API_BASE_URL from "../config/api";

const HeroSection = () => {
  const [bannerItems, setBannerItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cursorStyle, setCursorStyle] = useState({ top: 0, left: 0 });

  const defaultImages = [
    "https://images.unsplash.com/photo-1645241910531-d32735b412a2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNpdHRpbmclMjBSb29tfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1505843694770-3461f546bd8f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNpdHRpbmclMjBSb29tfGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1673014200221-524696a1edd9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHNpdHRpbmclMjBSb29tfGVufDB8fDB8fHww",
  ];

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/properties/banner`);
        if (res.data && Array.isArray(res.data)) {
          setBannerItems(res.data);
        } else if (res.data) {
          // Fallback if backend returns single object
          setBannerItems([res.data]);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  // Rotate between items every 8 seconds
  useEffect(() => {
    if (bannerItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
      setCurrentImageIndex(0); // Reset image index for new item
    }, 8000);
    return () => clearInterval(interval);
  }, [bannerItems.length]);

  // Rotate between images of the current item every 3 seconds
  useEffect(() => {
    const activeItem = bannerItems[currentIndex];
    const itemImages = activeItem?.imageUrls?.length > 0 ? activeItem.imageUrls : defaultImages;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % itemImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, bannerItems]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorStyle({ top: e.clientY - 15, left: e.clientX - 15 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const activeItem = bannerItems[currentIndex];
  const activeImages = activeItem?.imageUrls?.length > 0 ? activeItem.imageUrls : defaultImages;

  const getDetailsLink = () => {
    if (!activeItem) return "/land";
    return activeItem.type === 'property' 
      ? `/property-details/${activeItem._id || activeItem.id}` 
      : `/land/${activeItem._id || activeItem.id}`;
  };

  return (
    <section className="h-screen bg-gradient-to-r from-black via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center md:justify-between md:flex-row px-8 relative overflow-hidden">
      {/* Custom Cursor */}
      <div
        className="fixed pointer-events-none w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-[9999]"
        style={{
          top: `${cursorStyle.top}px`,
          left: `${cursorStyle.left}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Tooltip title="Explore Properties" arrow>
          <HomeIcon style={{ color: "white" }} />
        </Tooltip>
      </div>

      {/* Left Section */}
      <div className="w-full md:w-1/2 z-10 text-center md:text-left mb-6 md:mb-0 md:mt-12 transition-all duration-500 animate-fadeIn">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-4 leading-none uppercase tracking-tighter">
          {activeItem ? activeItem.title : "Luxury Apartment for Buy and Sell in Prime Location"}
        </h1>
        <div className="w-24 h-2 bg-green-500 mb-6 hidden md:block"></div>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-8 line-clamp-3 max-w-xl">
          {activeItem ? activeItem.description : "Don’t miss out on this opportunity to live in the lap of luxury. Contact us today to schedule a viewing and make this apartment your new home!"}
        </p>
        <Link
          to={getDetailsLink()}
          className="inline-block bg-white text-black px-10 py-5 rounded-none font-black uppercase tracking-widest text-xs hover:bg-green-600 hover:text-white transition-all transform active:scale-95 shadow-[8px_8px_0_0_rgba(255,255,255,0.2)]"
        >
          {activeItem ? "View Project" : "Explore More"}
        </Link>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-6 md:mb-0 relative">
        {/* Decorative background number */}
        <div className="absolute -top-20 -right-20 text-[20rem] font-black text-white/5 pointer-events-none hidden lg:block">
          0{currentIndex + 1}
        </div>
        
        <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] overflow-hidden rounded-none shadow-2xl group border-[16px] border-white/5">
          <img
            key={`${currentIndex}-${currentImageIndex}`}
            src={activeImages[currentImageIndex]}
            alt="Hero Banner"
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 animate-pulse-subtle"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          
          {/* Metadata Card */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 border-t-4 border-green-500">
             <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-500 mb-1">{activeItem?.location || "Premium Location"}</p>
                    <p className="text-xl font-black uppercase tracking-tighter">₹{activeItem?.price || 'Contact for Price'}</p>
                </div>
                {bannerItems.length > 1 && (
                    <div className="flex gap-2">
                        {bannerItems.map((_, i) => (
                            <div 
                                key={i} 
                                className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-green-500' : 'bg-gray-600'}`}
                            />
                        ))}
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
