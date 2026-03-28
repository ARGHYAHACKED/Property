import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import API_BASE_URL from '../config/api';
import {
  MapPin,
  DollarSign,
  Home,
  Clock,
  Ruler,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Share2,
  Phone,
  Mail,
  Building,
  Info,
  Calendar,
  ShieldCheck,
  Play,
  Video,
  Star,
  Map,
  Download,
  PhoneCall,
  MessageSquare,
  Image as ImageIcon,
  FileText
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [selectedConfigIndex, setSelectedConfigIndex] = useState(0);

  // Refs for scroll-to-section
  const sectionRefs = {
    overview: useRef(null),
    amenities: useRef(null),
    floorplans: useRef(null),
    around: useRef(null),
    videos: useRef(null)
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/properties/${id}`);
        setProperty(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch property details');
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const scrollToSection = (section) => {
    setActiveTab(section);
    sectionRefs[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get('v');
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    } else if (url.includes('m.youtube.com/watch')) {
      const urlParams = new URL(url).searchParams;
      videoId = urlParams.get('v');
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const handleRequestPapers = () => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (!token) {
      alert('Please log in to request property papers.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitRequest = async () => {
    setRequestSubmitting(true);
    const token = Cookies.get('token') || localStorage.getItem('token');
    try {
      await axios.post(
        `${API_BASE_URL}/api/request/create`,
        { propertyId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      alert('Request submitted successfully!');
      setIsModalOpen(false);
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(msg || 'Failed to submit request.');
    } finally {
      setRequestSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600"></div>
    </div>
  );

  if (error || !property) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 uppercase tracking-widest text-gray-500">
      <p className="mb-4">{error || 'Property not found'}</p>
      <button onClick={() => navigate(-1)} className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* 1. Sticky Navigation Header */}
      <div className="bg-white border-b sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold truncate max-w-[300px]">{property.title}</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {property.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {['overview', 'amenities', 'floorplans', 'around', 'videos'].map((tab) => (
              <button
                key={tab}
                onClick={() => scrollToSection(tab)}
                className={`text-sm font-semibold capitalize pb-5 border-b-2 transition-all mt-5 ${activeTab === tab ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-600 hover:text-orange-500'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full"><Share2 className="w-5 h-5" /></button>
            <button onClick={() => setIsWishlisted(!isWishlisted)} className={`p-2 hover:bg-gray-100 rounded-full ${isWishlisted ? 'text-red-500' : ''}`}>
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Banner / Hero Summary */}
      <div className="bg-gray-900 text-white py-6">
        <div className="max-width-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-1">{property.title}</h2>
            <p className="text-gray-400 flex items-center gap-1"><MapPin className="w-4 h-4" /> {property.location}</p>
          </div>
          <div className="text-right md:col-span-1 hidden md:block">
            <p className="text-gray-400 text-sm">Avg. Price</p>
            <p className="text-2xl font-bold text-orange-400">{property.avgPrice || formatPrice(property.price)}</p>
          </div>
          <div className="md:col-span-1">
            <a 
              href="https://wa.me/918768380240?text=I%20am%20interested" 
              target="_blank" 
              rel="noreferrer" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-5 h-5" /> Contact Seller
            </a>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-10">

          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black group">
              {property.imageUrls?.length > 0 ? (
                <>
                  <img src={property.imageUrls[currentImageIndex]} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" alt="Property" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-2">
                    <span className="bg-black/60 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm font-medium">
                      {currentImageIndex + 1} / {property.imageUrls.length} Photos
                    </span>
                    {property.tourVideos?.length > 0 && (
                      <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Play className="w-3 h-3 fill-current" /> {property.tourVideos.length} Videos
                      </span>
                    )}
                  </div>
                  <button onClick={() => setCurrentImageIndex(prev => prev === 0 ? property.imageUrls.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-xl p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={() => setCurrentImageIndex(prev => prev === property.imageUrls.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-xl p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-16 h-16 mb-2" />
                  <p>No photos available</p>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {property.imageUrls?.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`relative flex-shrink-0 w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === i ? 'border-orange-600 scale-105 shadow-lg' : 'border-transparent opacity-70'}`}
                >
                  <img src={url} className="w-full h-full object-cover" alt="Thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* 3a. Configuration Selection (99acres style) */}
          {property.floorPlans?.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Configuration</h3>
              <div className="flex flex-wrap gap-4">
                {property.floorPlans.map((plan, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedConfigIndex(index)}
                    className={`px-8 py-4 rounded-xl font-black uppercase tracking-tighter text-sm transition-all border-4 ${
                      selectedConfigIndex === index 
                      ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-200' 
                      : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    {plan.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Header Summary Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-orange-50 rounded-2xl p-6 border border-orange-100 transition-all">
            <div className="space-y-1">
              <p className="text-gray-500 text-xs uppercase font-bold text-[10px] tracking-widest">Configuration</p>
              <p className="text-gray-900 font-bold">{property.floorPlans?.[selectedConfigIndex]?.title || property.configurations || '3, 4 BHK Units'}</p>
            </div>
            <div className="space-y-1 border-l-0 md:border-l border-orange-200 md:pl-4">
              <p className="text-gray-500 text-xs uppercase font-bold text-[10px] tracking-widest">Possession Starts</p>
              <p className="text-gray-900 font-bold">{property.possessionStarts || 'Dec, 2026'}</p>
            </div>
            <div className="space-y-1 border-l-0 md:border-l border-orange-200 md:pl-4">
              <p className="text-gray-500 text-xs uppercase font-bold text-[10px] tracking-widest">Avg. Price</p>
              <p className="text-gray-900 font-bold text-orange-600">{property.floorPlans?.[selectedConfigIndex]?.price || property.avgPrice || formatPrice(property.price)}</p>
            </div>
            <div className="space-y-1 border-l-0 md:border-l border-orange-200 md:pl-4">
              <p className="text-gray-500 text-xs uppercase font-bold text-[10px] tracking-widest">Unit Area</p>
              <p className="text-gray-900 font-bold uppercase">{property.floorPlans?.[selectedConfigIndex]?.size || property.area + ' ' + (property.areaUnit || 'sq.ft')}</p>
            </div>
          </div>

          {/* Overview Section */}
          <section ref={sectionRefs.overview} className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2"><Info className="text-orange-600" /> Overview</h3>
              {property.reraId && <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">RERA: {property.reraId}</span>}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Building className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Developer</p>
                  <p className="text-lg font-bold text-gray-900">{property.developer || 'Elite Builders Group'}</p>
                </div>
              </div>

              <div className="prose max-w-none text-gray-700 leading-relaxed">
                <p className="font-bold text-lg text-gray-900">About {property.title}</p>
                <p>{property.overviewProject || property.description}</p>
                {property.moreAboutProject && (
                  <div className="mt-4 p-4 border-l-4 border-orange-600 bg-gray-50 rounded-r-xl italic">
                    {property.moreAboutProject}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-xl">
                <Calendar className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Launch Date</p>
                  <p className="font-bold">{property.launchDate || 'Jan, 2024'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-xl">
                <Map className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Project Area</p>
                  <p className="font-bold">{property.projectSize || property.area + ' ' + (property.areaUnit || 'acres')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Amenities Section */}
          <section ref={sectionRefs.amenities} className="space-y-6">
            <h3 className="text-2xl font-bold border-b pb-4 flex items-center gap-2"><Star className="text-orange-600" /> Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
              {(property.amenitiesList?.length > 0 ? property.amenitiesList : (property.amenities?.split(',') || [])).map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                    <Check className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-gray-700 font-medium">{item.trim()}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Floor Plans Section */}
          {property.floorPlans?.length > 0 && (
            <section ref={sectionRefs.floorplans} className="space-y-6">
              <h3 className="text-2xl font-bold border-b pb-4">Project Floor Plans</h3>
              <div className="space-y-6">
                {/* Highlighted Selected Floor Plan */}
                <div className="border-4 border-orange-600 rounded-[32px] overflow-hidden bg-white shadow-2xl relative group">
                   <div className="absolute top-6 left-6 z-10">
                      <span className="bg-orange-600 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">Selected: {property.floorPlans[selectedConfigIndex].title}</span>
                   </div>
                   <div className="aspect-video bg-gray-50 flex items-center justify-center p-12">
                      <img src={property.floorPlans[selectedConfigIndex].imageUrl || 'https://via.placeholder.com/800x600?text=Floor+Plan'} className="max-w-full max-h-full object-contain" alt={property.floorPlans[selectedConfigIndex].title} />
                   </div>
                   <div className="p-10 bg-gray-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                      <div>
                        <h4 className="text-3xl font-black uppercase tracking-tighter mb-2">{property.floorPlans[selectedConfigIndex].title} Configuration</h4>
                        <p className="text-orange-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Ruler className="w-4 h-4" /> Area: {property.floorPlans[selectedConfigIndex].size}</p>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Starting From</p>
                        <p className="text-4xl font-black tracking-tighter text-white">{property.floorPlans[selectedConfigIndex].price}</p>
                      </div>
                   </div>
                </div>

                {/* Other Plans Carousel/List */}
                {property.floorPlans.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                    {property.floorPlans.map((plan, i) => (
                      <button 
                        key={i}
                        onClick={() => setSelectedConfigIndex(i)}
                        className={`p-4 border-2 rounded-2xl transition-all text-left ${selectedConfigIndex === i ? 'border-orange-600 bg-orange-50' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                      >
                        <p className="font-black uppercase tracking-tighter text-sm mb-1">{plan.title}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{plan.size}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Tour Videos */}
          {property.tourVideos?.length > 0 && (
            <section ref={sectionRefs.videos} className="space-y-6">
              <h3 className="text-2xl font-bold border-b pb-4 flex items-center gap-2"><Video className="text-orange-600" /> Project Tour</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.tourVideos.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border bg-black shadow-lg shadow-orange-900/10">
                    <iframe
                      className="w-full h-full"
                      src={getYouTubeEmbedUrl(url)}
                      title="Tour Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Around the Property */}
          <section ref={sectionRefs.around} className="space-y-6">
            <h3 className="text-2xl font-bold border-b pb-4 flex items-center gap-2"><MapPin className="text-orange-600" /> Around {property.locality || 'the Neighborhood'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.aroundProject?.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">{item.category}</p>
                      <p className="font-bold text-gray-900">{item.name}</p>
                    </div>
                  </div>
                  <span className="text-orange-600 font-bold text-sm bg-orange-50 px-3 py-1 rounded-full">{item.distance}</span>
                </div>
              )) || <p className="text-gray-500 col-span-2 italic">Nearby location details coming soon...</p>}
            </div>
          </section>

        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">

            {/* Contact Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl space-y-6">
              <div className="flex items-center gap-4 border-b pb-6">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Building className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Posted by</p>
                  <p className="text-xl font-bold text-gray-900">{property.contactDeveloper?.name || 'Authorized Agent'}</p>
                  <div className="flex items-center gap-1 text-green-600 mt-1">
                    <ShieldCheck className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Verified Seller</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600 font-medium">I'm interested in this project and would like to schedule a site visit.</p>
                <div className="grid grid-cols-1 gap-3">
                  <a 
                    href="https://wa.me/918768380240?text=I%20am%20interested" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full bg-gray-900 hover:bg-black text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95"
                  >
                    <MessageSquare className="w-5 h-5" /> Contact Seller
                  </a>
                  <a 
                    href="https://wa.me/918768380240?text=I%20am%20interested" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-50 h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95"
                  >
                    <MessageSquare className="w-5 h-5" /> Send WhatsApp
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t space-y-4">
                <button onClick={handleRequestPapers} className="w-full bg-orange-50 text-orange-600 hover:bg-orange-100 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                  <Download className="w-5 h-5" /> Request Property Papers
                </button>
                {property.brochureUrl && (
                  <a href={property.brochureUrl} target="_blank" rel="noreferrer" className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <FileText className="w-5 h-5" /> Download Brochure
                  </a>
                )}
              </div>
            </div>

            {/* Price Alert Segment */}
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-300">
              <h4 className="text-xl font-bold mb-2">EMI Starts @ {property.emiStarts || '₹45K/mo'}</h4>
              <p className="text-orange-100 text-sm mb-6 opacity-90">Interested in getting home loan assistance? We have tied up with multiple banks.</p>
              {/* <button className="w-full bg-white text-orange-600 h-12 rounded-xl font-bold hover:bg-orange-50 transition-colors">Apply Now</button> */}
            </div>

          </div>
        </div>

      </div>

      {/* 4. Request Papers Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Request Legal Papers</h3>
                <p className="text-gray-500 mt-2">Get verified ownership and legal documents for this property.</p>
              </div>

              <div className="bg-orange-50 p-6 rounded-3xl space-y-1">
                <p className="text-orange-900 font-bold text-xl">Service Fee: ₹500</p>
                <p className="text-orange-700 text-sm opacity-80">One-time processing fee for paper retrieval.</p>
              </div>

              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCheckboxChecked}
                  onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                  className="w-6 h-6 mt-1 rounded border-gray-300 focus:ring-orange-500 text-orange-600 accent-orange-600"
                />
                <span className="text-gray-600 text-sm leading-relaxed">
                  I confirm that I want to request the legal papers for <span className="font-bold text-gray-900">{property.title}</span> and agree to pay the retrieval fee.
                </span>
              </label>

              <button
                onClick={handleSubmitRequest}
                disabled={!isCheckboxChecked || requestSubmitting}
                className={`w-full h-16 rounded-2xl font-bold text-lg transition-all shadow-lg ${isCheckboxChecked && !requestSubmitting
                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200 scale-[1.02]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {requestSubmitting ? 'Processing Request...' : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PropertyDetails;
