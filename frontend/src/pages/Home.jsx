import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import HeroSection from "../components/Hero";
import { useNavigate } from 'react-router-dom';

const dummyProperties = [
  { id: 1, title: 'Luxury Villa', description: 'A beautiful villa in the city.', price: 1200, image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D' },
  { id: 2, title: 'Modern Apartment', description: 'An apartment with all amenities.', price: 800, image: 'https://images.unsplash.com/photo-1483097365279-e8acd3bf9f18?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D' },
  { id: 3, title: 'Cozy Cottage', description: 'A charming cottage in the countryside.', price: 950, image: 'https://images.unsplash.com/photo-1483097365279-e8acd3bf9f18?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhbmR8ZW58MHx8MHx8fDA%3D' }
];

const leftImages = [
  "https://images.unsplash.com/photo-1542006643796-2456545f3b5c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxhbmR8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1697644693174-216346d85792?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxhbmR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1527195375283-e28c0cfbe6f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxhbmR8ZW58MHx8MHx8fDA%3D",
];

const rightImages = [
  "https://images.unsplash.com/photo-1437143618958-b630ca68622f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxhbmR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1435036709252-8bfb7fba3e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhbmR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1625213069085-61cec99afd04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxhbmR8ZW58MHx8MHx8fDA%3D",
];

const Home = () => {
  const navigate = useNavigate();
  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);

  useEffect(() => {
    const leftInterval = setInterval(() => {
      setLeftImageIndex((prevIndex) => (prevIndex + 1) % leftImages.length);
    }, 3000); // Change image every 3 seconds for left carousel
    return () => clearInterval(leftInterval);
  }, []);

  useEffect(() => {
    const rightInterval = setInterval(() => {
      setRightImageIndex((prevIndex) => (prevIndex + 1) % rightImages.length);
    }, 3000); // Change image every 3 seconds for right carousel
    return () => clearInterval(rightInterval);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <HeroSection />
      {/* Properties and Land Section */}
      <div className="p-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6">Buy the Right Property</h2>
        <div className="flex flex-wrap justify-center space-x-8 gap-8 md:gap-12">
          {/* Properties Carousel (Left) */}
          <div
            className="relative group cursor-pointer w-full sm:w-80 md:w-96 h-60"
            onClick={() => handleNavigate('/property')}
          >
            <img
              src={leftImages[leftImageIndex]}
              alt="Properties"
              className="absolute inset-0 w-full h-full rounded-lg object-cover transition duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300">
              <span className="text-white text-sm sm:text-lg md:text-2xl font-bold">Properties</span>
            </div>
          </div>
          {/* Land Carousel (Right) */}
          <div
            className="relative group cursor-pointer w-full sm:w-80 md:w-96 h-60"
            onClick={() => handleNavigate('/land')}
          >
            <img
              src={rightImages[rightImageIndex]}
              alt="Land"
              className="absolute inset-0 w-full h-full rounded-lg object-cover transition duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300">
              <span className="text-white text-sm sm:text-lg md:text-2xl font-bold">Land</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Properties Section */}
      <div className="p-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">Available Properties</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProperties.map(property => (
            <Card key={property.id} {...property} />
          ))}
        </div>
      </div>

      {/* Available Land Section */}
      <div className="p-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8">Available Land</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProperties.map((property, index) => (
            <Card
              key={property.id + '-land'}
              {...property}
              image={index < leftImages.length ? leftImages[index] : rightImages[index % rightImages.length]}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
