import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/api';
import { 
  Upload, X, Plus, Home, MapPin, Info, 
  Image as ImageIcon, Video, Star, Phone, FileText, Save, ArrowLeft 
} from 'lucide-react';

const EditLand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    age: '',
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
    contactDeveloper: { name: '', phone: '', email: '' },
    showInBanner: false
  });

  const [aroundProject, setAroundProject] = useState([{ category: '', name: '', distance: '' }]);
  const [floorPlans, setFloorPlans] = useState([]);
  const [tourVideos, setTourVideos] = useState(['']);
  const [amenitiesList, setAmenitiesList] = useState(['']);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Essentials', icon: Home },
    { id: 2, title: 'Details', icon: Info },
    { id: 3, title: 'Media & Plans', icon: ImageIcon },
    { id: 4, title: 'Seller Info', icon: Phone },
  ];

  useEffect(() => {
    const fetchLandData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/lands/${id}`);
        const data = response.data;
        
        setFormData({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          age: data.age || '',
          area: data.area || '',
          price: data.price || '',
          amenities: data.amenities || '',
          developer: data.developer || '',
          emiStarts: data.emiStarts || '',
          possessionStarts: data.possessionStarts || '',
          avgPrice: data.avgPrice || '',
          sizes: data.sizes || '',
          configurations: data.configurations || '',
          reraId: data.reraId || '',
          projectUnits: data.projectUnits || '',
          areaUnit: data.areaUnit || 'acres',
          projectSize: data.projectSize || '',
          launchDate: data.launchDate || '',
          overviewProject: data.overviewProject || '',
          moreAboutProject: data.moreAboutProject || '',
          priceTrends: data.priceTrends || '',
          brochureUrl: data.brochureUrl || '',
          locality: data.locality || '',
          contactDeveloper: data.contactDeveloper || { name: '', phone: '', email: '' },
          showInBanner: data.showInBanner || false
        });

        if (data.aroundProject && data.aroundProject.length > 0) {
          setAroundProject(data.aroundProject);
        }
        if (data.floorPlans && data.floorPlans.length > 0) {
          setFloorPlans(data.floorPlans);
        }
        if (data.tourVideos && data.tourVideos.length > 0) {
          setTourVideos(data.tourVideos);
        }
        if (data.amenitiesList && data.amenitiesList.length > 0) {
          setAmenitiesList(data.amenitiesList);
        }
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
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: val }
      });
    } else {
      setFormData({ ...formData, [name]: val });
    }
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

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        area: parseFloat(formData.area) || 0,
        aroundProject: aroundProject.filter(item => item.name),
        floorPlans: floorPlans,
        tourVideos: tourVideos.filter(item => item),
        amenitiesList: amenitiesList.filter(item => item),
        images: images
      };

      await axios.put(`${API_BASE_URL}/api/lands/${id}`, submitData, { withCredentials: true });
      alert('Land updated successfully!');
      navigate('/admin/lands');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update land.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
           <button onClick={() => navigate('/admin/lands')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
           </button>
           <div>
             <h1 className="text-3xl font-bold text-gray-800">Edit Land</h1>
             <p className="text-gray-600">Update detailed information for this land listing</p>
           </div>
        </div>

        {/* Stepper */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {steps.map(step => (
            <button 
              key={step.id} 
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
                currentStep === step.id ? 'bg-orange-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200 hover:border-orange-400'
              }`}
            >
              <step.icon className="w-5 h-5" /> {step.title}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
           {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">{error}</div>}

           {/* Step 1: Essentials */}
           {currentStep === 1 && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-orange-700">
                    <Home className="w-5 h-5" /> Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Land Title</label>
                      <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (numeric)</label>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Price Range</label>
                      <input type="text" name="avgPrice" value={formData.avgPrice} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="flex items-center gap-2 cursor-pointer p-4 bg-orange-50 rounded-lg border border-orange-100">
                          <input type="checkbox" name="showInBanner" checked={formData.showInBanner} onChange={handleInputChange} className="w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500" />
                          <span className="font-bold text-orange-800">Show in Homepage Banner</span>
                       </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                   <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-green-700">
                    <MapPin className="w-5 h-5" /> Location & Area
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Land Address</label>
                        <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Area Size</label>
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
                   </div>
                </div>
             </div>
           )}

           {/* Step 2: Details */}
           {currentStep === 2 && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-yellow-700">
                    <Info className="w-5 h-5" /> Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Land Overview</label>
                        <textarea name="overviewProject" value={formData.overviewProject} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
                     </div>
                  </div>
                </div>
             </div>
           )}

           {/* Step 3: Media */}
           {currentStep === 3 && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                   <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-orange-700">
                    <ImageIcon className="w-5 h-5" /> Gallery Images
                   </h2>
                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors cursor-pointer mb-6" onClick={() => document.getElementById('image-upload').click()}>
                      <input type="file" id="image-upload" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                      <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Upload New Images</p>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm">
                           <img src={url} alt="preview" className="w-full h-full object-cover" />
                           <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                              <X className="w-4 h-4" />
                           </button>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-orange-700">
                    <FileText className="w-5 h-5" /> Site Plans
                  </h2>
                  <div className="space-y-6">
                    {floorPlans.map((plan, index) => (
                       <div key={index} className="p-4 border rounded-xl bg-gray-50 flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                            <input type="text" value={plan.title} onChange={(e) => {
                               const newList = [...floorPlans];
                               newList[index].title = e.target.value;
                               setFloorPlans(newList);
                            }} placeholder="Plan Title (e.g., Layout Plan)" className="font-bold text-gray-700 bg-transparent border-b outline-none focus:border-orange-500" />
                            <button type="button" onClick={() => setFloorPlans(prev => prev.filter((_, i) => i !== index))} className="text-red-500 p-1 hover:bg-red-50 rounded">
                               <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex gap-4 items-center">
                             {plan.imageUrl ? (
                               <img src={plan.imageUrl} className="w-20 h-20 object-cover rounded-lg border" />
                             ) : (
                               <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center">No Plan Image</div>
                             )}
                             <input type="file" accept="image/*" onChange={(e) => handleFloorPlanImageChange(index, e)} className="text-xs" />
                          </div>
                       </div>
                    ))}
                    <button type="button" onClick={() => setFloorPlans(prev => [...prev, { title: '', size: '', price: '', imageUrl: '' }])} className="flex items-center gap-1 text-orange-600 font-bold text-sm">
                       <Plus className="w-4 h-4" /> Add Site Plan
                    </button>
                  </div>
                </div>
             </div>
           )}

           {/* Step 4: Seller Info */}
           {currentStep === 4 && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-700">
                    <Phone className="w-5 h-5" /> Seller Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Developer/Owner Name</label>
                      <input type="text" name="developer" value={formData.developer} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                      <input type="text" name="contactDeveloper.name" value={formData.contactDeveloper.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="text" name="contactDeveloper.phone" value={formData.contactDeveloper.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" name="contactDeveloper.email" value={formData.contactDeveloper.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
                    </div>
                  </div>
                </div>
             </div>
           )}

           {/* Actions */}
           <div className="flex gap-4 pt-8 border-t">
              <button 
                type="submit" 
                disabled={saveLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {saveLoading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
              </button>
              <button type="button" onClick={() => navigate('/admin/lands')} className="px-8 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-500 font-bold py-4 rounded-xl transition-colors">
                Cancel
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default EditLand;
