import React from 'react';

const Card = ({ title, description, price, image }) => {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-green-600 font-bold mt-2">${price}</p>
      </div>
    </div>
  );
};

export default Card;
