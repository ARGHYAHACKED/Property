import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { 
  Upload, X, Plus, Home, MapPin, Info, 
  DollarSign, Building, List, Image as ImageIcon, 
  Video, Star, Phone, FileText, CheckCircle2 
} from 'lucide-react';

const AddLand = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'land',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      coordinates: { lat: 0, lng: 0 }
    },
    price: {
      total: '',
      perSqft: '',
      negotiable: false
    },
    area: {
      value: '',
      unit: 'acre'
    },
    ownershipType: 'freehold',
    rera: {
      registered: false,
      reraId: '',
      state: ''
    },
    amenitiesList: [],
    videos: [],
    documents: []
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [newAmenity, setNewAmenity] = useState('');

  const steps = [
    { id: 1, title: 'Essentials', icon: Home },
    { id: 2, title: 'Location & Area', icon: MapPin },
    { id: 3, title: 'Price & Legal', icon: DollarSign },
    { id: 4, title: 'Media & Docs', icon: ImageIcon },
  ];

  const nextStep = () => {
    if (currentStep === 1 && !formData.title.trim()) {
      setError('Property Title is required');
      return;
    }
    if (currentStep === 3 && !formData.price.total) {
      setError('Total Price is required');
      return;
    }
    setError('');
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };
  const prevStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Recursive handler for deep nested objects
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    const keys = name.split('.');

    setFormData(prev => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = val;
      return newData;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
        setPreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          documents: [...prev.documents, { name: file.name, url: reader.result }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!formData.title || !formData.price.total) {
      setError('Critical fields are missing. Please check your inputs.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        price: {
          ...formData.price,
          total: parseFloat(formData.price.total) || 0,
          perSqft: parseFloat(formData.price.perSqft) || 0,
        },
        area: {
          ...formData.area,
          value: parseFloat(formData.area.value) || 0
        },
        images: images // Backend handles Cloudinary upload
      };

      const response = await axios.post(`${API_BASE_URL}/api/lands`, submitData, { withCredentials: true });
      console.log('Submission success:', response.data);
      alert('Land published successfully!');
      navigate('/admin/lands');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to publish land.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-l-8 border-orange-600">
          <h1 className="text-3xl font-bold text-gray-800">Add New Land Asset</h1>
          <p className="text-gray-600 uppercase tracking-widest text-xs font-black mt-2">Modular Schema v2.0</p>
        </div>

        {/* Stepper */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {steps.map(step => (
            <button type="button" key={step.id} onClick={() => setCurrentStep(step.id)} className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${currentStep === step.id ? 'bg-orange-600 text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:border-orange-300'}`}>
              <step.icon className="w-5 h-5" /> {step.title}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 font-bold animate-shake">{error}</div>}

          {/* Step 1: Essentials */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-orange-700 uppercase tracking-tighter italic border-b-2 border-orange-100 pb-2"><Home className="w-5 h-5" /> Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-500 outline-none font-bold" placeholder="e.g., Green Valley Acres" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">Property Type</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-500 outline-none font-bold">
                      <option value="land">Land</option>
                      <option value="plot">Plot</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">Ownership Type</label>
                    <select name="ownershipType" value={formData.ownershipType} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-500 outline-none font-bold">
                      <option value="freehold">Freehold</option>
                      <option value="leasehold">Leasehold</option>
                      <option value="power_of_attorney">Power of Attorney</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-500 outline-none font-bold" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Area */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-700 uppercase tracking-tighter italic border-b-2 border-green-100 pb-2"><MapPin className="w-5 h-5" /> Precise Geography</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">Full Address</label>
                    <input type="text" name="location.address" value={formData.location.address} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-500 outline-none font-bold" placeholder="Street, Sector..." />
                  </div>
                  <input type="text" name="location.city" value={formData.location.city} onChange={handleInputChange} placeholder="City" className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none font-bold" />
                  <input type="text" name="location.state" value={formData.location.state} onChange={handleInputChange} placeholder="State" className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none font-bold" />
                  <input type="text" name="location.pincode" value={formData.location.pincode} onChange={handleInputChange} placeholder="Pincode" className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl outline-none font-bold" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-700 uppercase tracking-tighter italic border-b-2 border-blue-100 pb-2"><Building className="w-5 h-5" /> Area Measurement</h2>
                <div className="flex gap-4">
                  <input type="number" name="area.value" value={formData.area.value} onChange={handleInputChange} className="flex-1 px-4 py-3 border-2 border-gray-100 rounded-xl font-bold" placeholder="Value" />
                  <select name="area.unit" value={formData.area.unit} onChange={handleInputChange} className="w-32 px-4 py-3 border-2 border-gray-100 rounded-xl font-bold">
                    <option value="sqft">Sqft</option>
                    <option value="sqyd">Sqyd</option>
                    <option value="acre">Acre</option>
                    <option value="hectare">Hectare</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Finance & RERA */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-700 uppercase tracking-tighter italic border-b-2 border-indigo-100 pb-2"><DollarSign className="w-5 h-5" /> Commercial Value</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">Total Price (₹)</label>
                    <input type="number" name="price.total" value={formData.price.total} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl font-bold" required />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-500 mb-2">Per Sqft (₹)</label>
                    <input type="number" name="price.perSqft" value={formData.price.perSqft} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl font-bold" />
                  </div>
                  <label className="md:col-span-2 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer">
                    <input type="checkbox" name="price.negotiable" checked={formData.price.negotiable} onChange={handleInputChange} className="w-5 h-5 rounded text-orange-600" />
                    <span className="font-bold text-gray-700">Price is Negotiable</span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-700 uppercase tracking-tighter italic border-b-2 border-purple-100 pb-2"><Star className="w-5 h-5" /> RERA & Legal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <label className="md:col-span-2 flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100 cursor-pointer">
                    <input type="checkbox" name="rera.registered" checked={formData.rera.registered} onChange={handleInputChange} className="w-5 h-5 rounded text-purple-600" />
                    <span className="font-bold text-purple-800 uppercase text-xs">Is RERA Registered?</span>
                  </label>
                  {formData.rera.registered && (
                    <>
                      <input type="text" name="rera.reraId" value={formData.rera.reraId} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl" placeholder="RERA ID" />
                      <input type="text" name="rera.state" value={formData.rera.state} onChange={handleInputChange} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl" placeholder="Registration State" />
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Media & Documents */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-700 uppercase tracking-tighter italic border-b-2 border-red-100 pb-2"><ImageIcon className="w-5 h-5" /> Visual Media</h2>
                <div className="border-4 border-dashed border-gray-100 rounded-2xl p-10 text-center hover:border-orange-500 transition-all cursor-pointer bg-gray-50" onClick={() => document.getElementById('image-upload').click()}>
                  <input type="file" id="image-upload" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  <Upload className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Drop Assets Here</p>
                </div>
                
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-8">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border-2 border-white">
                        <img src={url} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => {
                          setImages(prev => prev.filter((_, i) => i !== index));
                          setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                        }} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-orange-700 uppercase tracking-tighter italic border-b-2 border-orange-100 pb-2"><FileText className="w-5 h-5" /> Legal Documents</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <input type="file" multiple onChange={handleDocumentChange} className="text-sm font-bold text-gray-500" />
                  </div>
                  {formData.documents.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white border-2 border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-xs font-bold text-gray-600 truncate">{doc.name}</span>
                      </div>
                      <button type="button" onClick={() => setFormData(p => ({ ...p, documents: p.documents.filter((_, i) => i !== idx) }))} className="text-red-500 p-1"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 uppercase tracking-tighter italic border-b-2 border-gray-100 pb-2"><List className="w-5 h-5" /> Amenities</h2>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newAmenity} 
                    onChange={(e) => setNewAmenity(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newAmenity) {
                          setFormData(p => ({ ...p, amenitiesList: [...p.amenitiesList, newAmenity] }));
                          setNewAmenity('');
                        }
                      }
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-100 rounded-xl outline-none" 
                    placeholder="e.g., Gated Community" 
                  />
                  <button type="button" onClick={() => {
                    if(newAmenity) {
                      setFormData(p => ({ ...p, amenitiesList: [...p.amenitiesList, newAmenity] }));
                      setNewAmenity('');
                    }
                  }} className="bg-black text-white px-4 py-2 rounded-xl font-bold">ADD</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenitiesList.map((site, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-black flex items-center gap-2">
                      {site} <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData(p => ({ ...p, amenitiesList: p.amenitiesList.filter((_, idx) => idx !== i) }))} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4 pt-10 border-t-4 border-gray-100">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all">BACK</button>
            )}
            {currentStep < steps.length ? (
              <button type="button" onClick={nextStep} className="flex-1 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg hover:bg-orange-700 transition-all uppercase tracking-widest">NEXT STEP</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-green-600 text-white font-black rounded-2xl shadow-lg hover:bg-green-700 transition-all uppercase tracking-widest disabled:bg-gray-400">
                {loading ? 'DYNAMO PUBLISHING...' : 'SAVE & PUBLISH ASSET'}
              </button>
            )}
             <button type="button" onClick={() => navigate('/admin/dashboard')} className="px-8 py-4 border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-50 transition-all">EXIT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLand;
