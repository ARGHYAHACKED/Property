import React from 'react';

const Card = ({ title, description, price, image, avgPrice }) => {
  const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    if (price >= 1000) return `₹${(price / 1000).toFixed(2)} k`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden flex flex-col h-full bg-white hover:shadow-xl transition-shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="font-bold text-lg line-clamp-1">{title}</h2>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{description}</p>
        <p className="text-black font-bold mt-auto pt-3 text-lg">
          {avgPrice || formatPrice(price)}
        </p>
      </div>
    </div>
  );
};

export default Card;
