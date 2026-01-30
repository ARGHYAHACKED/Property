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

      {/* CTA Section */}
      <CTASection navigate={navigate} />
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);
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
        const allItems = [...(propertiesRes.data || []), ...(landsRes.data || [])];
        setProperties(allItems);
        setLands(landsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
                                className={`h-2 rounded-full transition-all ${
                                  idx === 0 ? 'w-6 bg-white' : 'w-2 bg-gray-300'
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
                  <p className="text-xl font-bold text-black mb-2">₹{(currentProperty.price || 0).toLocaleString()}</p>
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
            <p className="text-lg font-bold text-black">₹{(item.price || 0).toLocaleString()}</p>
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
