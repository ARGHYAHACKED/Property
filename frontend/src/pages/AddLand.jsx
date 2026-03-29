import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { Upload, X, Plus, Home, MapPin, Info, DollarSign, Building, List, Image as ImageIcon, Video, Star, Phone, FileText } from 'lucide-react';

const AddLand = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    area: '',
    price: '',
    amenities: '',
    developer: '',
    emiStarts: '',
    possessionStarts: '',
    avgPrice: '',
    sizes: '',
    configurations: '',
    reraId: '',
    projectUnits: '',
    areaUnit: 'acres',
    projectSize: '',
    launchDate: '',
    overviewProject: '',
    moreAboutProject: '',
    priceTrends: '',
    brochureUrl: '',
    locality: '',
    contactDeveloper: { name: '', phone: '', email: '' }
  });

  const [aroundProject, setAroundProject] = useState([{ category: '', name: '', distance: '' }]);
  const [floorPlans, setFloorPlans] = useState([{ title: '', size: '', price: '', imageUrl: '' }]);
  const [tourVideos, setTourVideos] = useState(['']);
  const [amenitiesList, setAmenitiesList] = useState(['']);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Essentials', icon: Home },
    { id: 2, title: 'Details', icon: Info },
    { id: 3, title: 'Media & Plans', icon: ImageIcon },
    { id: 4, title: 'Seller Info', icon: Phone },
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleListChange = (index, value, list, setList) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const handleObjectListChange = (index, field, value, list, setList) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };
    setList(newList);
  };

  const handleFloorPlanImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newList = [...floorPlans];
        newList[index] = { ...newList[index], imageUrl: reader.result };
        setFloorPlans(newList);
      };
      reader.readAsDataURL(file);
    }
  };

  const addListItem = (list, setList, defaultValue, limit) => {
    if (limit && list.length >= limit) {
      alert(`Maximum limit of ${limit} reached.`);
      return;
    }
    setList([...list, defaultValue]);
  };

  const removeListItem = (index, list, setList) => {
    if (list.length > 1) {
      setList(list.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes (Cloudinary free tier limit)

    // Check each file size before processing
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join(', ');
      alert(`The following files exceed the 10MB limit:\n${fileNames}\n\nPlease compress your images before uploading. You can use free tools like TinyPNG or compress them in your photo editor.`);
      e.target.value = ''; // Clear the file input
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
        setPreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        area: parseFloat(formData.area) || 0,
        aroundProject: aroundProject.filter(item => item.name),
        floorPlans: floorPlans.filter(item => item.title || item.imageUrl), // Include floor plans with title OR image
        tourVideos: tourVideos.filter(item => item),
        amenitiesList: amenitiesList.filter(item => item),
        images: images
      };

      const response = await axios.post(`${API_BASE_URL}/api/lands`, submitData, { withCredentials: true });
      console.log('Land Submission Response:', response.data);
      alert('Land listing added successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to add land.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-l-8 border-orange-600">
          <h1 className="text-3xl font-bold text-gray-800">Add Professional Land Listing</h1>
          <p className="text-gray-600">Enter detailed information for the land property</p>
        </div>

        {/* Multi-Step Stepper */}
        <div className="mb-10 px-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-orange-600 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-orange-600 text-white ring-4 ring-orange-100 scale-110' :
                      isCompleted ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-200'
                      }`}
                  >
                    {isCompleted ? <Star className="w-5 h-5 md:w-6 md:h-6" /> : <Icon className="w-5 h-5 md:w-6 md:h-6" />}
                  </div>
                  <span className={`absolute -bottom-7 text-[10px] md:text-xs font-bold whitespace-nowrap uppercase tracking-wider ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">{error}</div>}

          {/* Step 1: Essentials */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-orange-700">
                  <Home className="w-5 h-5" /> Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Land Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., Prime Agricultural Land" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Developer/Owner Name</label>
                    <input type="text" name="developer" value={formData.developer} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., Green Earth Properties" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (numeric for sorting)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Display (e.g., ₹25.00 L - 30.00 L)</label>
                    <input type="text" name="avgPrice" value={formData.avgPrice} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-orange-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-green-700">
                  <MapPin className="w-5 h-5" /> Location & Area
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Address</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g., Galsi, Burdwan" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Locality/Neighborhood</label>
                    <input type="text" name="locality" value={formData.locality} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Area</label>
                      <input type="number" name="area" value={formData.area} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" step="0.01" required />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <select name="areaUnit" value={formData.areaUnit} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                        <option value="acres">Acres</option>
                        <option value="sq.ft">Sq.Ft</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size Spec (e.g., 2.5 Acres)</label>
                    <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-yellow-700">
                  <Building className="w-5 h-5" /> Project/Land Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RERA/Reg ID</label>
                    <input type="text" name="reraId" value={formData.reraId} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Possession/Type</label>
                    <input type="text" name="possessionStarts" value={formData.possessionStarts} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none" placeholder="e.g., Immediate" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Land Overview</label>
                    <textarea name="overviewProject" value={formData.overviewProject} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">More About Land/Project</label>
                    <textarea name="moreAboutProject" value={formData.moreAboutProject} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-indigo-700">
                  <List className="w-5 h-5" /> Features & Nearby
                </h2>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities/Features</label>
                  {amenitiesList.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input type="text" value={item} onChange={(e) => handleListChange(index, e.target.value, amenitiesList, setAmenitiesList)} className="flex-1 px-4 py-2 border rounded-lg outline-none" placeholder="e.g., Water Source" />
                      <button type="button" onClick={() => removeListItem(index, amenitiesList, setAmenitiesList)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addListItem(amenitiesList, setAmenitiesList, '')} className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium">
                    <Plus className="w-4 h-4" /> Add Feature
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Around This Location</label>
                  {aroundProject.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 p-3 border rounded-lg bg-gray-50">
                      <input type="text" value={item.category} onChange={(e) => handleObjectListChange(index, 'category', e.target.value, aroundProject, setAroundProject)} className="px-3 py-2 border rounded focus:ring-1 focus:ring-orange-500 outline-none" placeholder="Category" />
                      <input type="text" value={item.name} onChange={(e) => handleObjectListChange(index, 'name', e.target.value, aroundProject, setAroundProject)} className="px-3 py-2 border rounded focus:ring-1 focus:ring-orange-500 outline-none" placeholder="Name" />
                      <div className="flex gap-2">
                        <input type="text" value={item.distance} onChange={(e) => handleObjectListChange(index, 'distance', e.target.value, aroundProject, setAroundProject)} className="flex-1 px-3 py-2 border rounded focus:ring-1 focus:ring-orange-500 outline-none" placeholder="Distance" />
                        <button type="button" onClick={() => removeListItem(index, aroundProject, setAroundProject)} className="p-2 text-red-500 hover:bg-red-50 rounded"><X className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addListItem(aroundProject, setAroundProject, { category: '', name: '', distance: '' })} className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium">
                    <Plus className="w-4 h-4" /> Add Nearby Landmark
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Media & Plans */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-indigo-700">
                  <FileText className="w-5 h-5" /> Site Plans (Max 4)
                </h2>
                <div className="space-y-6">
                  {floorPlans.map((plan, index) => (
                    <div key={index} className="p-4 border rounded-xl bg-gray-50 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-700">Plan {index + 1}</h4>
                        {floorPlans.length > 1 && (
                          <button type="button" onClick={() => removeListItem(index, floorPlans, setFloorPlans)} className="text-red-500 flex items-center gap-1 text-sm font-medium">
                            <X className="w-4 h-4" /> Remove Plan
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" value={plan.title} onChange={(e) => handleObjectListChange(index, 'title', e.target.value, floorPlans, setFloorPlans)} className="px-4 py-2 border rounded-lg outline-none" placeholder="Title" />
                        <input type="text" value={plan.size} onChange={(e) => handleObjectListChange(index, 'size', e.target.value, floorPlans, setFloorPlans)} className="px-4 py-2 border rounded-lg outline-none" placeholder="Size" />
                        <input type="text" value={plan.price} onChange={(e) => handleObjectListChange(index, 'price', e.target.value, floorPlans, setFloorPlans)} className="px-4 py-2 border rounded-lg outline-none" placeholder="Price" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <input type="file" accept="image/*" onChange={(e) => handleFloorPlanImageChange(index, e)} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                        {plan.imageUrl && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden border">
                            <img src={plan.imageUrl} alt="Plan preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {floorPlans.length < 4 && (
                    <button type="button" onClick={() => addListItem(floorPlans, setFloorPlans, { title: '', size: '', price: '', imageUrl: '' }, 4)} className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium">
                      <Plus className="w-4 h-4" /> Add Site Plan (Max 4)
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-red-700">
                  <ImageIcon className="w-5 h-5" /> Media & Attachments
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images Upload</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors cursor-pointer" onClick={() => document.getElementById('image-upload').click()}>
                      <input type="file" id="image-upload" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                      <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload land images</p>
                    </div>
                    {previewUrls.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group aspect-square">
                            <img src={url} alt="preview" className="w-full h-full object-cover rounded-lg" />
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(index); }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Trend/Map Link</label>
                    <input type="text" name="priceTrends" value={formData.priceTrends} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Link to region map or price analysis" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Seller Info */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-700">
                  <Phone className="w-5 h-5" /> Seller/Agent Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input type="text" name="contactDeveloper.name" value={formData.contactDeveloper.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="text" name="contactDeveloper.phone" value={formData.contactDeveloper.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" name="contactDeveloper.email" value={formData.contactDeveloper.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" required />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex flex-col md:flex-row gap-4 pt-8 border-t">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="md:w-48 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-xl transition-all shadow-md active:scale-95"
              >
                Previous Step
              </button>
            )}

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Next Step <Plus className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:bg-gray-400"
              >
                {loading ? 'Submitting Land...' : 'Save and Publish Land'}
              </button>
            )}

            <button type="button" onClick={() => navigate('/admin/dashboard')} className="md:w-32 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-500 font-semibold py-4 rounded-xl transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLand;
