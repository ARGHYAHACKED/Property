import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { Upload, X, Plus, Home, MapPin, Info, DollarSign, Building, List, Image as ImageIcon, Video, Star, Phone, FileText } from 'lucide-react';

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    age: '',
    area: '',
    price: '',
    amenities: '', // Keeping original field for compatibility
    developer: '',
    emiStarts: '',
    possessionStarts: '',
    avgPrice: '',
    sizes: '',
    configurations: '',
    reraId: '',
    projectUnits: '',
    areaUnit: 'sq.ft',
    projectSize: '',
    launchDate: '',
    overviewProject: '',
    moreAboutProject: '',
    priceTrends: '',
    brochureUrl: '',
    locality: '',
    contactDeveloper: { name: '', phone: '', email: '' }
  });

  const [selectedBHKs, setSelectedBHKs] = useState([]);
  const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', 'Penthouse', 'Villa'];

  const [aroundProject, setAroundProject] = useState([{ category: '', name: '', distance: '' }]);
  const [floorPlans, setFloorPlans] = useState([]);
  const [tourVideos, setTourVideos] = useState(['']);
  const [amenitiesList, setAmenitiesList] = useState(['']);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Essentials', icon: Home },
    { id: 2, title: 'Project Details', icon: Building },
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

  const handleBHKToggle = (bhk) => {
    setSelectedBHKs(prev => {
      const isSelected = prev.includes(bhk);
      const newSelected = isSelected ? prev.filter(item => item !== bhk) : [...prev, bhk];
      
      // Sync floorPlans state
      if (!isSelected) {
        // Add new floor plan for this BHK if it doesn't exist
        if (!floorPlans.find(fp => fp.title === bhk)) {
          setFloorPlans([...floorPlans, { title: bhk, size: '', price: '', imageUrl: '' }]);
        }
      }
      
      return newSelected;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        configurations: selectedBHKs.join(', '),
        price: parseFloat(formData.price) || 0,
        area: parseFloat(formData.area) || 0,
        aroundProject: aroundProject.filter(item => item.name),
        floorPlans: floorPlans.filter(item => selectedBHKs.includes(item.title)), // Only submit floor plans for selected BHKs
        tourVideos: tourVideos.filter(item => item),
        amenitiesList: amenitiesList.filter(item => item),
        images: images
      };

      await axios.post(`${API_BASE_URL}/api/properties`, submitData, { withCredentials: true });
      alert('Property added successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to add property.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-l-8 border-blue-600">
          <h1 className="text-3xl font-bold text-gray-800">Add Professional Property Listing</h1>
          <p className="text-gray-600">Enter comprehensive details to create a high-quality listing</p>
        </div>

        {/* Multi-Step Stepper */}
        <div className="mb-10 px-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110' :
                      isCompleted ? 'bg-green-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-200'
                      }`}
                  >
                    {isCompleted ? <Star className="w-5 h-5 md:w-6 md:h-6" /> : <Icon className="w-5 h-5 md:w-6 md:h-6" />}
                  </div>
                  <span className={`absolute -bottom-7 text-[10px] md:text-xs font-bold whitespace-nowrap uppercase tracking-wider ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
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
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-700">
                  <Home className="w-5 h-5" /> Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Krishiv Residency" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Developer Name</label>
                    <input type="text" name="developer" value={formData.developer} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., KEDARNATH CONSTRUCTION DURGAPUR" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (numeric for sorting)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Display (e.g., ₹37.15 L - 48.64 L)</label>
                    <input type="text" name="avgPrice" value={formData.avgPrice} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EMI Starts (e.g., ₹19.67 K)</label>
                    <input type="text" name="emiStarts" value={formData.emiStarts} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Possession Starts (e.g., Dec, 2026)</label>
                    <input type="text" name="possessionStarts" value={formData.possessionStarts} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Benachity, Durgapur" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Locality/Neighborhood</label>
                    <input type="text" name="locality" value={formData.locality} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Benachity" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Project Area</label>
                      <input type="number" name="area" value={formData.area} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <select name="areaUnit" value={formData.areaUnit} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="sq.ft">Sq.Ft</option>
                        <option value="acres">Acres</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-purple-700">
                  <Building className="w-5 h-5" /> Project Specifics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Project Configurations (Select all that apply)</label>
                    <div className="flex flex-wrap gap-3">
                      {BHK_OPTIONS.map(bhk => (
                        <button
                          key={bhk}
                          type="button"
                          onClick={() => handleBHKToggle(bhk)}
                          className={`px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs transition-all border-2 ${selectedBHKs.includes(bhk)
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                              : 'bg-white border-gray-200 text-gray-400 hover:border-blue-400'
                            }`}
                        >
                          {bhk}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RERA ID</label>
                    <input type="text" name="reraId" value={formData.reraId} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Units</label>
                    <input type="text" name="projectUnits" value={formData.projectUnits} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., 9 units" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Size</label>
                    <input type="text" name="projectSize" value={formData.projectSize} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., 1 Building" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Launch Date</label>
                    <input type="text" name="launchDate" value={formData.launchDate} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Apr, 2025" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size Range (e.g., 1032 - 1351 sq.ft)</label>
                    <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Auto-populated from floor plans if left blank" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overview Description</label>
                    <textarea name="overviewProject" value={formData.overviewProject} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">More About Project</label>
                    <textarea name="moreAboutProject" value={formData.moreAboutProject} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-orange-700">
                  <List className="w-5 h-5" /> Amenities & Around Project
                </h2>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities List</label>
                  {amenitiesList.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input type="text" value={item} onChange={(e) => handleListChange(index, e.target.value, amenitiesList, setAmenitiesList)} className="flex-1 px-4 py-2 border rounded-lg outline-none" placeholder="e.g., Swimming Pool" />
                      <button type="button" onClick={() => removeListItem(index, amenitiesList, setAmenitiesList)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addListItem(amenitiesList, setAmenitiesList, '')} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium mt-2">
                    <Plus className="w-4 h-4" /> Add Amenity
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Around This Project (Schools, Hospitals, etc.)</label>
                  {aroundProject.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 p-3 border rounded-lg bg-gray-50">
                      <input type="text" value={item.category} onChange={(e) => handleObjectListChange(index, 'category', e.target.value, aroundProject, setAroundProject)} className="px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Category" />
                      <input type="text" value={item.name} onChange={(e) => handleObjectListChange(index, 'name', e.target.value, aroundProject, setAroundProject)} className="px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Name" />
                      <div className="flex gap-2">
                        <input type="text" value={item.distance} onChange={(e) => handleObjectListChange(index, 'distance', e.target.value, aroundProject, setAroundProject)} className="flex-1 px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Distance" />
                        <button type="button" onClick={() => removeListItem(index, aroundProject, setAroundProject)} className="p-2 text-red-500 hover:bg-red-50 rounded"><X className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addListItem(aroundProject, setAroundProject, { category: '', name: '', distance: '' })} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
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
                  <FileText className="w-5 h-5" /> Project Configurations & Floor Plans
                </h2>
                
                {selectedBHKs.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                    <p className="text-gray-400 font-medium">No configurations selected in Step 2.</p>
                    <button type="button" onClick={() => setCurrentStep(2)} className="text-blue-600 font-bold mt-2 hover:underline">Go back to select BHKs</button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {selectedBHKs.map((bhk, index) => {
                      const planIndex = floorPlans.findIndex(fp => fp.title === bhk);
                      if (planIndex === -1) return null;
                      const plan = floorPlans[planIndex];

                      return (
                        <div key={bhk} className="p-6 border-2 border-gray-100 rounded-2xl bg-white space-y-6 shadow-sm">
                          <div className="flex justify-between items-center border-b pb-4">
                            <h4 className="text-lg font-black uppercase tracking-tighter text-blue-900">{bhk} Details</h4>
                            <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Configuration Active</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Square Footage (e.g., 1250 sq.ft)</label>
                              <input 
                                type="text" 
                                value={plan.size} 
                                onChange={(e) => handleObjectListChange(planIndex, 'size', e.target.value, floorPlans, setFloorPlans)} 
                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none font-bold" 
                                placeholder="Enter area..." 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Starting Price (e.g., ₹45 L)</label>
                              <input 
                                type="text" 
                                value={plan.price} 
                                onChange={(e) => handleObjectListChange(planIndex, 'price', e.target.value, floorPlans, setFloorPlans)} 
                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none font-bold" 
                                placeholder="Enter price..." 
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Upload Floor Plan Image</label>
                            <div className="flex flex-col md:flex-row items-start gap-6">
                              <div className="flex-grow w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Select Image File</p>
                                  </div>
                                  <input type="file" accept="image/*" onChange={(e) => handleFloorPlanImageChange(planIndex, e)} className="hidden" />
                                </label>
                              </div>
                              {plan.imageUrl && (
                                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl group relative">
                                  <img src={plan.imageUrl} alt={`${bhk} floor plan`} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button type="button" onClick={() => handleObjectListChange(planIndex, 'imageUrl', '', floorPlans, setFloorPlans)} className="p-2 bg-red-500 text-white rounded-full">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-red-700">
                  <ImageIcon className="w-5 h-5" /> Media & Brochures
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tour Videos (YouTube/Vimeo URLs)</label>
                    {tourVideos.map((url, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input type="text" value={url} onChange={(e) => handleListChange(index, e.target.value, tourVideos, setTourVideos)} className="flex-1 px-4 py-2 border rounded-lg outline-none" placeholder="Video URL" />
                        <button type="button" onClick={() => removeListItem(index, tourVideos, setTourVideos)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-5 h-5" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addListItem(tourVideos, setTourVideos, '')} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium mt-2">
                      <Plus className="w-4 h-4" /> Add Video URL
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brochure URL</label>
                    <input type="text" name="brochureUrl" value={formData.brochureUrl} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Link to PDF brochure" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images Upload</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer" onClick={() => document.getElementById('image-upload').click()}>
                      <input type="file" id="image-upload" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                      <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload property images</p>
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
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Seller Info */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-cyan-700">
                  <Phone className="w-5 h-5" /> Seller/Developer Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input type="text" name="contactDeveloper.name" value={formData.contactDeveloper.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="text" name="contactDeveloper.phone" value={formData.contactDeveloper.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" name="contactDeveloper.email" value={formData.contactDeveloper.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Next Step <Plus className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:bg-gray-400"
              >
                {loading ? 'Submitting Property...' : 'Save and Publish Property'}
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

export default AddProperty;
