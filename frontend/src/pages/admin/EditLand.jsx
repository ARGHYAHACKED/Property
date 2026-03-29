import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
import { 
  Upload, X, Plus, Home, MapPin, Info, 
  DollarSign, Building, List, Image as ImageIcon, 
  Video, Star, Phone, FileText, Save, ArrowLeft, CheckCircle2
} from 'lucide-react';

const EditLand = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
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

  useEffect(() => {
    const fetchLandData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/lands/${id}`);
        const data = response.data;
        
        // Deep merge data with initial state to ensure nested objects exist
        setFormData({
          title: data.title || '',
          description: data.description || '',
          propertyType: data.propertyType || 'land',
          location: {
            address: data.location?.address || '',
            city: data.location?.city || '',
            state: data.location?.state || '',
            pincode: data.location?.pincode || '',
            coordinates: {
                lat: data.location?.coordinates?.lat || 0,
                lng: data.location?.coordinates?.lng || 0
            }
          },
          price: {
            total: data.price?.total || '',
            perSqft: data.price?.perSqft || '',
            negotiable: data.price?.negotiable || false
          },
          area: {
            value: data.area?.value || '',
            unit: data.area?.unit || 'acre'
          },
          ownershipType: data.ownershipType || 'freehold',
          rera: {
            registered: data.rera?.registered || false,
            reraId: data.rera?.reraId || '',
            state: data.rera?.state || ''
          },
          amenitiesList: data.amenitiesList || [],
          videos: data.videos || [],
          documents: data.documents || []
        });

        if (data.imageUrls && data.imageUrls.length > 0) {
          setImages(data.imageUrls);
          setPreviewUrls(data.imageUrls);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching land:', err);
        setError('Failed to fetch land details.');
        setLoading(false);
      }
    };

    fetchLandData();
  }, [id]);

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

    setSaveLoading(true);
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
        images: images
      };

      const adminToken = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${adminToken || ''}`,
        },
        withCredentials: true
      };

      await axios.put(`${API_BASE_URL}/api/lands/${id}`, submitData, config);
      alert('Land updated successfully!');
      navigate('/admin/lands');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update land.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-3xl italic">RECALIBRATING ASSET DATA...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6 mb-8 border-b-8 border-black pb-6">
           <button onClick={() => navigate('/admin/lands')} className="p-4 bg-black text-white hover:bg-gray-800 transition-colors">
              <ArrowLeft className="w-8 h-8" />
           </button>
           <div>
             <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Edit Asset Portfolio</h1>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Updating: {formData.title || 'Untitled'}</p>
           </div>
        </div>

        {/* Stepper */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {steps.map(step => (
            <button 
              key={step.id} 
              type="button"
              onClick={() => setCurrentStep(step.id)} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all whitespace-nowrap ${currentStep === step.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}
            >
              <step.icon className="w-4 h-4" /> {step.title}
            </button>
          ))}
        </div>

        <div className="space-y-12">
           {error && <div className="p-4 bg-red-100 text-red-700 rounded-none border-4 border-red-500 font-black uppercase text-xs animate-shake">{error}</div>}

           {/* Step 1: Essentials */}
           {currentStep === 1 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
               <div className="bg-white rounded-none shadow-2xl p-8 border-t-8 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-gray-100 pb-4 flex items-center gap-3"><Home className="w-6 h-6" /> Primary Attributes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Portfolio Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black outline-none font-black text-xl uppercase tracking-tighter" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Property Category</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black outline-none font-black uppercase tracking-widest text-xs">
                      <option value="land">Land</option>
                      <option value="plot">Plot</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Title Status</label>
                    <select name="ownershipType" value={formData.ownershipType} onChange={handleInputChange} className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black outline-none font-black uppercase tracking-widest text-xs">
                      <option value="freehold">Freehold</option>
                      <option value="leasehold">Leasehold</option>
                      <option value="power_of_attorney">Power of Attorney</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Technical Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="6" className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black outline-none font-bold text-gray-700" />
                  </div>
                </div>
              </div>
            </div>
           )}

           {/* Step 2: Location & Area */}
           {currentStep === 2 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
               <div className="bg-white rounded-none shadow-2xl p-8 border-t-8 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-gray-100 pb-4 flex items-center gap-3"><MapPin className="w-6 h-6" /> Geographical Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Site Address</label>
                    <input type="text" name="location.address" value={formData.location.address} onChange={handleInputChange} className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black outline-none font-black uppercase tracking-tighter" />
                  </div>
                  <input type="text" name="location.city" value={formData.location.city} onChange={handleInputChange} placeholder="CITY" className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black outline-none font-black uppercase text-xs" />
                  <input type="text" name="location.state" value={formData.location.state} onChange={handleInputChange} placeholder="STATE" className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black outline-none font-black uppercase text-xs" />
                  <input type="text" name="location.pincode" value={formData.location.pincode} onChange={handleInputChange} placeholder="PINCODE" className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black outline-none font-black uppercase text-xs" />
                </div>
              </div>

              <div className="bg-white rounded-none shadow-2xl p-8 border-t-8 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-gray-100 pb-4 flex items-center gap-3"><Building className="w-6 h-6" /> Area Metrics</h2>
                <div className="flex gap-6">
                  <input type="number" name="area.value" value={formData.area.value} onChange={handleInputChange} className="flex-1 px-6 py-4 border-4 border-gray-100 focus:border-black font-black text-2xl tracking-tighter" placeholder="VALUE" />
                  <select name="area.unit" value={formData.area.unit} onChange={handleInputChange} className="w-48 px-6 py-4 border-4 border-gray-100 focus:border-black font-black uppercase tracking-widest text-xs">
                    <option value="sqft">Sqft</option>
                    <option value="sqyd">Sqyd</option>
                    <option value="acre">Acre</option>
                    <option value="hectare">Hectare</option>
                  </select>
                </div>
              </div>
            </div>
           )}

           {/* Step 3: Prices & Legal */}
           {currentStep === 3 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-none shadow-2xl p-8 border-t-8 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-gray-100 pb-4 flex items-center gap-3"><DollarSign className="w-6 h-6" /> Valuation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Total Project Value (₹)</label>
                    <input type="number" name="price.total" value={formData.price.total} onChange={handleInputChange} className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black font-black text-3xl tracking-tighter" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Price Per Sqft (₹)</label>
                    <input type="number" name="price.perSqft" value={formData.price.perSqft} onChange={handleInputChange} className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black font-black text-2xl tracking-tighter" />
                  </div>
                  <label className="md:col-span-2 flex items-center gap-4 p-6 bg-gray-50 border-4 border-gray-100 cursor-pointer">
                    <input type="checkbox" name="price.negotiable" checked={formData.price.negotiable} onChange={handleInputChange} className="w-8 h-8 rounded-none border-4 border-black text-black focus:ring-black" />
                    <span className="font-black uppercase tracking-widest text-xs">Valuation is Negotiable</span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-none shadow-2xl p-8 border-t-8 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-gray-100 pb-4 flex items-center gap-3"><Star className="w-6 h-6" /> Regulatory Compliance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <label className="md:col-span-2 flex items-center gap-4 p-6 bg-black text-white cursor-pointer">
                    <input type="checkbox" name="rera.registered" checked={formData.rera.registered} onChange={handleInputChange} className="w-8 h-8 rounded-none border-4 border-white text-white focus:ring-white" />
                    <span className="font-black uppercase tracking-widest text-xs">Certified RERA Registration</span>
                  </label>
                  {formData.rera.registered && (
                    <>
                      <input type="text" name="rera.reraId" value={formData.rera.reraId} onChange={handleInputChange} className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black font-black uppercase text-xs" placeholder="REGISTRATION ID" />
                      <input type="text" name="rera.state" value={formData.rera.state} onChange={handleInputChange} className="w-full px-6 py-4 border-4 border-gray-100 focus:border-black font-black uppercase text-xs" placeholder="REGISTRATION STATE" />
                    </>
                  )}
                </div>
              </div>
            </div>
           )}

           {/* Step 4: Media & Docs */}
           {currentStep === 4 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
               <div className="bg-white rounded-none shadow-2xl p-8 border-t-8 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-gray-100 pb-4 flex items-center gap-3"><ImageIcon className="w-6 h-6" /> Visual Repository</h2>
                <div className="border-8 border-dashed border-gray-100 p-12 text-center hover:border-black transition-all cursor-pointer bg-gray-50" onClick={() => document.getElementById('image-upload').click()}>
                  <input type="file" id="image-upload" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                  <Upload className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                  <p className="font-black uppercase tracking-widest text-xs text-gray-400">Add Creative Assets</p>
                </div>
                
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group aspect-square border-4 border-black">
                        <img src={url} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => {
                           setImages(prev => prev.filter((_, i) => i !== index));
                           setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                        }} className="absolute top-0 right-0 bg-black text-white p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-none shadow-2xl p-8 border-t-8 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-gray-100 pb-4 flex items-center gap-3"><FileText className="w-6 h-6" /> Legal Documentation</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-6 bg-gray-50 p-6 border-4 border-gray-100">
                    <input type="file" multiple onChange={handleDocumentChange} className="font-black uppercase text-[10px] text-gray-400" />
                  </div>
                  {formData.documents.map((doc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-white border-4 border-black">
                      <div className="flex items-center gap-3 truncate">
                        <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-black truncate">{doc.name}</span>
                      </div>
                      <button type="button" onClick={() => setFormData(p => ({ ...p, documents: p.documents.filter((_, i) => i !== idx) }))} className="text-black p-2 hover:bg-red-600 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-none shadow-2xl p-8 border-t-8 border-black">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-gray-100 pb-4 flex items-center gap-3"><List className="w-6 h-6" /> Project Features</h2>
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-orange-500" 
                    placeholder="e.g., Gated Community" 
                  />
                  <button type="button" onClick={() => {
                    if(newAmenity) {
                      setFormData(p => ({ ...p, amenitiesList: [...p.amenitiesList, newAmenity] }));
                      setNewAmenity('');
                    }
                  }} className="bg-black text-white px-4 py-2 rounded-lg font-bold">ADD</button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {formData.amenitiesList.map((site, i) => (
                    <span key={i} className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                      {site} <X className="w-4 h-4 cursor-pointer hover:text-red-500" onClick={() => setFormData(p => ({ ...p, amenitiesList: p.amenitiesList.filter((_, idx) => idx !== i) }))} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
           )}

           {/* Controls */}
           <div className="flex gap-6 pt-12 border-t-8 border-black">
             {currentStep > 1 && (
               <button type="button" onClick={prevStep} className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-xs border-4 border-black hover:bg-gray-50 transition-all">BACK</button>
             )}
             {currentStep < steps.length ? (
              <button type="button" onClick={nextStep} className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-sm rounded-none shadow-2xl transition-all">NEXT STEP</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={saveLoading} className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-sm rounded-none shadow-2xl transition-all disabled:bg-gray-400">
                {saveLoading ? 'UPDATING...' : 'SAVE CHANGES'}
              </button>
            )}
            <button type="button" onClick={() => navigate('/admin/lands')} className="px-10 py-4 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition-all">CANCEL</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLand;
