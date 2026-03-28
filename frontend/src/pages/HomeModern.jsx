import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import axios from 'axios';
import {
  Home as HomeIcon,
  Landmark,
  Users,
  TrendingUp,
  MapPin,
  DollarSign,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, landsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/properties`),
          axios.get(`${API_BASE_URL}/api/lands`)
        ]);
        setProperties(propertiesRes.data || []);
        setLands(landsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Properties Section */}
      <FeaturedSection
        title="Featured Properties"
        items={properties.slice(0, 6)}
        type="property"
        navigate={navigate}
      />

      {/* Featured Lands Section */}
      <FeaturedSection
        title="Featured Lands"
        items={lands.slice(0, 6)}
        type="land"
        navigate={navigate}
      />

      {/* Why Choose Us Section */}
      <WhyChooseSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection navigate={navigate} />
    </div>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = [
    {
      id: 1,
      name: "Arindam Das",
      title: "Land Investor",
      location: "South Kolkata",
      image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100&h=100&fit=crop",
      feedback: "Best land deals in South Kolkata! The verification process for the 55-acre project was incredibly meticulous and transparent.",
      rating: 5,
      color: "border-blue-500 bg-blue-50"
    },
    {
      id: 2,
      name: "Sumit Mukherjee",
      title: "Business Owner",
      location: "Siliguri",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      feedback: "I was looking for a warehouse spot near Siliguri. 55acre provided the perfect plot within my budget. Truly impressed!",
      rating: 5,
      color: "border-green-500 bg-green-50"
    },
    {
      id: 3,
      name: "Anjali Bose",
      title: "New Homeowner",
      location: "New Town-Rajarhat",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      feedback: "Found my dream apartment in Rajarhat easily. The team helped me with all the documentation. Highly recommended!",
      rating: 5,
      color: "border-purple-500 bg-purple-50"
    },
    {
      id: 4,
      name: "Vikram Chatterjee",
      title: "Retired Officer",
      location: "Howrah",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      feedback: "Reliable service. They understand the value of honest communication. Getting a plot in Howrah was a seamless experience.",
      rating: 4,
      color: "border-orange-500 bg-orange-50"
    },
    {
      id: 5,
      name: "Sneha Roy",
      title: "IT Professional",
      location: "Durgapur",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      feedback: "As someone staying away from Durgapur, I needed a trustworthy partner to handle the local property visit. 55acre was perfect.",
      rating: 5,
      color: "border-pink-500 bg-pink-50"
    },
    {
      id: 6,
      name: "Debjyoti Saha",
      title: "Real Estate Agent",
      location: "Salt Lake",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      feedback: "I often refer my clients to 55acre for genuine land listings in the Salt Lake area. Their data accuracy is their strength.",
      rating: 5,
      color: "border-indigo-500 bg-indigo-50"
    },
    {
      id: 7,
      name: "Piyush Ghosh",
      title: "Teacher",
      location: "Asansol",
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
      feedback: "Never thought buying land in Asansol could be this digital and easy. Handheld support throughout the registration.",
      rating: 5,
      color: "border-teal-500 bg-teal-50"
    },
    {
      id: 8,
      name: "Rina Banerjee",
      title: "Homemaker",
      location: "Barasat",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop",
      feedback: "Happy with the plot we purchased in Barasat. The community aspect and future development plans for the area are great.",
      rating: 5,
      color: "border-red-500 bg-red-50"
    }
  ];

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Logic to show up to 3 cards at a time (rotating)
  const getVisibleTestimonials = () => {
    const visible = [];
    const count = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    for (let i = 0; i < count; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-l-8 border-black pl-6">
          <div>
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter leading-none">Local Trust</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Verified voices from West Bengal, India</p>
          </div>
          <div className="flex gap-4 mt-6 md:mt-0">
            <button onClick={handlePrev} className="p-4 bg-white border-2 border-black hover:bg-black hover:text-white transition-all shadow-md active:scale-95">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={handleNext} className="p-4 bg-white border-2 border-black hover:bg-black hover:text-white transition-all shadow-md active:scale-95">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[350px]">
          {getVisibleTestimonials().map((t, index) => (
            <div 
              key={`${t.id}-${currentIndex}-${index}`} 
              className={`p-6 border-t-8 ${t.color} shadow-lg transition-all transform hover:-translate-y-2 flex flex-col justify-between min-h-[320px] bg-opacity-40 backdrop-blur-sm animate-fadeIn`}
            >
               <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full border-2 border-black object-cover" />
                    <div>
                        <h4 className="font-black uppercase text-sm text-black">{t.name}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t.title}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'fill-black text-black' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 italic text-sm leading-relaxed">"{t.feedback}"</p>
               </div>
               <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase">
                    <MapPin className="w-3 h-3" /> {t.location}
                  </div>
                  <span className="text-[10px] bg-black text-white px-2 py-0.5 font-black uppercase">Verified Listing</span>
               </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-10 bg-black' : 'w-3 bg-gray-200'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/properties/banner`);
        if (res.data && Array.isArray(res.data)) {
          setProperties(res.data);
        } else if (res.data) {
          setProperties([res.data]);
        }
      } catch (error) {
        console.error('Error fetching banner data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBannerData();
  }, []);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (properties.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % properties.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [properties.length]);

  const currentProperty = properties[carouselIndex];

  const handlePrevious = () => {
    setCarouselIndex((prev) => (prev - 1 + properties.length) % properties.length);
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % properties.length);
  };

  const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden">
      {/* Background Image from Carousel */}
      {properties.length > 0 && currentProperty && (
        <div className="absolute inset-0 z-0">
          <img
            src={currentProperty.imageUrl || currentProperty.imageUrls?.[0] || 'https://via.placeholder.com/1920x1080'}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}

      {/* Animated background elements (fallback) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-left">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fadeInDown">
                Discover Premium Land & Properties
              </h1>
              <p className="text-xl sm:text-2xl text-gray-200 mb-8 animate-fadeInUp">
                Explore 55 acres of premium properties and land listings from verified sellers
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp">
                <button onClick={() => navigate('/property')} className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105">
                  Explore Properties
                </button>
                <button onClick={() => navigate('/land')} className="px-8 py-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105 border-2 border-white">
                  View Lands
                </button>
              </div>
            </div>

            {/* Right Content - Carousel & Property Card */}
            {properties.length > 0 && currentProperty && (
              <div className="flex flex-col gap-4 items-end">
                {/* Carousel Container - smaller */}
                <div className="relative rounded-xl overflow-hidden shadow-xl h-52 w-80 group">
                  {/* Carousel Images */}
                  <div className="relative w-full h-full">
                    {currentProperty.imageUrls && currentProperty.imageUrls.length > 0 ? (
                      <>
                        <img
                          src={currentProperty.imageUrls[0]}
                          alt={currentProperty.title}
                          className="w-full h-full object-cover"
                        />
                        {currentProperty.imageUrls.length > 1 && (
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                            {currentProperty.imageUrls.slice(0, 5).map((_, idx) => (
                              <div
                                key={idx}
                                className={`h-2 rounded-full transition-all ${idx === 0 ? 'w-6 bg-white' : 'w-2 bg-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <img
                        src="https://via.placeholder.com/600x400"
                        alt="Placeholder"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all z-20 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all z-20 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Carousel Counter */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {carouselIndex + 1} / {properties.length}
                  </div>
                </div>

                {/* Property Details Card - compact */}
                <div className="bg-white/95 backdrop-blur rounded-lg p-4 shadow-xl max-w-sm">
                  <h3 className="text-lg font-bold text-black mb-1 line-clamp-1">{currentProperty.title}</h3>
                  <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{currentProperty.location}</span>
                  </div>
                  <p className="text-xl font-bold text-black mb-2">
                    {currentProperty.avgPrice || formatPrice(currentProperty.price)}
                  </p>
                  <p className="text-gray-600 text-xs line-clamp-2 mb-3">{currentProperty.description}</p>
                  <button
                    onClick={() => navigate(`/property-details/${currentProperty.id || currentProperty._id}`)}
                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-1"
                  >
                    View Full Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center text-white">
                <p className="text-lg">Loading featured properties...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

// Stats Section Component
const StatsSection = () => {
  const stats = [
    { icon: HomeIcon, label: 'Properties', value: '2,400+' },
    { icon: Landmark, label: 'Lands', value: '1,200+' },
    { icon: Users, label: 'Happy Clients', value: '5,000+' },
    { icon: TrendingUp, label: 'Growth', value: '+45%' }
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-y-2 border-gray-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-black mb-12">By The Numbers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-black">
                <Icon className="w-12 h-12 text-black mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-black mb-2">{stat.value}</h3>
                <p className="text-gray-700">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Featured Section Component
const FeaturedSection = ({ title, items, type, navigate }) => {
  const viewAllPath = type === 'land' ? '/land' : '/property';
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 border-b-2 border-black pb-4">
          <div>
            <h2 className="text-4xl font-bold text-black mb-2">{title}</h2>
            <p className="text-gray-700">Handpicked listings for you</p>
          </div>
          <button onClick={() => navigate(viewAllPath)} className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-lg transition-all transform hover:scale-105">
            View All
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <PropertyCard key={item.id || item._id} item={item} type={type} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ item, type, navigate }) => {
  const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const id = item.id || item._id;
  const detailsPath = type === 'land' ? `/land/${id}` : `/property-details/${id}`;
  return (
    <div
      onClick={() => navigate(detailsPath)}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 border-gray-200 hover:border-black"
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gray-200 overflow-hidden group">
        <img
          src={item.imageUrl || item.imageUrls?.[0] || 'https://via.placeholder.com/400x300'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
          {type === 'property' ? 'Property' : 'Land'}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end p-4">
          <button className="w-full bg-white text-black py-2 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
            View Details
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-700 mb-4">
          <MapPin className="w-4 h-4" />
          <p className="text-sm">{item.location}</p>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-black" />
            <p className="text-lg font-bold text-black">
              {item.avgPrice || formatPrice(item.price)}
            </p>
          </div>
          {type === 'land' && (
            <span className="text-sm text-gray-700 font-semibold">{item.area} acres</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Why Choose Us Section
const WhyChooseSection = () => {
  const features = [
    {
      icon: Star,
      title: 'Verified Listings',
      description: 'All properties and lands are verified by our team'
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Competitive pricing with transparent deals'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 customer support for your queries'
    },
    {
      icon: MapPin,
      title: 'Wide Coverage',
      description: 'Properties across multiple locations'
    }
  ];

  return (
    <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-black mb-12">Why Choose 55acre?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border-t-4 border-black">
                <Icon className="w-12 h-12 text-black mx-auto mb-4" />
                <h3 className="text-lg font-bold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-700 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// CTA Section
const CTASection = ({ navigate }) => {
  return (
    <div className="bg-gradient-to-r from-black to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-gray-300 mb-8 text-lg">
          Browse our extensive collection of properties and lands today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/property')}
            className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Browse Properties
          </button>
          <button
            onClick={() => navigate('/land')}
            className="px-8 py-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 border-2 border-white"
          >
            Browse Lands
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
