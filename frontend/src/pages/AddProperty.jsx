import React, { useState } from 'react';

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add backend API integration here
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Add a Property</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="title" className="block font-bold mb-1">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            className="w-full border rounded p-2"
            onChange={handleChange}
            value={formData.title}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block font-bold mb-1">Description</label>
          <textarea
            name="description"
            id="description"
            className="w-full border rounded p-2"
            onChange={handleChange}
            value={formData.description}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block font-bold mb-1">Price</label>
          <input
            type="number"
            name="price"
            id="price"
            className="w-full border rounded p-2"
            onChange={handleChange}
            value={formData.price}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block font-bold mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            id="image"
            className="w-full border rounded p-2"
            onChange={handleChange}
            value={formData.image}
          />
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
