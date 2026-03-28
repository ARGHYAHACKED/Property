import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import API_BASE_URL from '../config/api';
import {
  MapPin,
  DollarSign,
  Home,
  Ruler,
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

const LandDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  // Refs for scroll-to-section
  const sectionRefs = {
    overview: useRef(null),
    amenities: useRef(null),
    around: useRef(null),
    videos: useRef(null)
  };

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/lands/${id}`);
        setLand(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch land details');
        setLoading(false);
      }
    };
    fetchLand();
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
      alert('Please log in to request land papers.');
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
        `${API_BASE_URL}/api/land-request/create`,
        { landId: id },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Request submitted successfully!');
      setIsModalOpen(false);
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(msg || 'Failed to submit the request. Please try again.');
    } finally {
      setRequestSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600"></div>
    </div>
  );

  if (error || !land) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 uppercase tracking-widest text-gray-500">
      <p className="mb-4">{error || 'Land listing not found'}</p>
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
              <h1 className="text-lg font-bold truncate max-w-[300px]">{land.title}</h1>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {land.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {['overview', 'amenities', 'around', 'videos'].map((tab) => (
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
      <div className="bg-green-900 text-white py-6">
        <div className="max-width-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-1">{land.title}</h2>
            <p className="text-gray-400 flex items-center gap-1"><MapPin className="w-4 h-4" /> {land.location}</p>
          </div>
          <div className="text-right md:col-span-1 hidden md:block">
            <p className="text-gray-400 text-sm">Avg. Price</p>
            <p className="text-2xl font-bold text-green-400">{land.avgPrice || formatPrice(land.price)}</p>
          </div>
          <div className="md:col-span-1">
            <a 
              href="https://wa.me/918768380240?text=I%20am%20interested" 
              target="_blank" 
              rel="noreferrer" 
              className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors uppercase"
            >
              <MessageSquare className="w-5 h-5" /> Contact Owner
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
              {land.imageUrls?.length > 0 ? (
                <>
                  <img src={land.imageUrls[currentImageIndex]} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" alt="Land" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 flex items-center gap-2">
                    <span className="bg-black/60 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm font-medium">
                      {currentImageIndex + 1} / {land.imageUrls.length} Photos
                    </span>
                    {land.tourVideos?.length > 0 && (
                      <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Play className="w-3 h-3 fill-current" /> {land.tourVideos.length} Videos
                      </span>
                    )}
                  </div>
                  <button onClick={() => setCurrentImageIndex(prev => prev === 0 ? land.imageUrls.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-xl p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={() => setCurrentImageIndex(prev => prev === land.imageUrls.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-xl p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
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
              {land.imageUrls?.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`relative flex-shrink-0 w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === i ? 'border-green-600 scale-105 shadow-lg' : 'border-transparent opacity-70'}`}
                >
                  <img src={url} className="w-full h-full object-cover" alt="Thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Header Summary Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-green-50 rounded-2xl p-6 border border-green-100">
            <div className="space-y-1">
              <p className="text-gray-500 text-xs uppercase font-bold">Total Area</p>
              <p className="text-gray-900 font-bold">{land.area} {land.areaUnit || 'Acres'}</p>
            </div>
            <div className="space-y-1 border-l-0 md:border-l border-green-200 md:pl-4">
              <p className="text-gray-500 text-xs uppercase font-bold">Land Type</p>
              <p className="text-gray-900 font-bold">{land.possessionStarts || 'Agricultural'}</p>
            </div>
            <div className="space-y-1 border-l-0 md:border-l border-green-200 md:pl-4">
              <p className="text-gray-500 text-xs uppercase font-bold">Avg. Price</p>
              <p className="text-gray-900 font-bold text-green-600">{land.avgPrice || formatPrice(land.price)}</p>
            </div>
            <div className="space-y-1 border-l-0 md:border-l border-green-200 md:pl-4">
              <p className="text-gray-500 text-xs uppercase font-bold">RERA ID</p>
              <p className="text-gray-900 font-bold">{land.reraId || 'Not Applicable'}</p>
            </div>
          </div>

          {/* Overview Section */}
          <section ref={sectionRefs.overview} className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2"><Info className="text-green-600" /> Land Overview</h3>
              {land.reraId && <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">RERA Verified</span>}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Landowner / Developer</p>
                  <p className="text-lg font-bold text-gray-900">{land.developer || 'Direct Owner'}</p>
                </div>
              </div>

              <div className="prose max-w-none text-gray-700 leading-relaxed">
                <p className="font-bold text-lg text-gray-900">About this {land.title}</p>
                <p>{land.overviewProject || land.description}</p>
                {land.moreAboutProject && (
                  <div className="mt-4 p-4 border-l-4 border-green-600 bg-gray-50 rounded-r-xl italic">
                    {land.moreAboutProject}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-xl hover:border-green-200 transition-colors">
                <Ruler className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Dimensions</p>
                  <p className="font-bold">{land.sizes || land.area + ' ' + (land.areaUnit || 'acres')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border rounded-xl hover:border-green-200 transition-colors">
                <Map className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Locality</p>
                  <p className="font-bold">{land.locality || land.location}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Amenities Section */}
          <section ref={sectionRefs.amenities} className="space-y-6">
            <h3 className="text-2xl font-bold border-b pb-4 flex items-center gap-2"><Star className="text-green-600" /> Key Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
              {(land.amenitiesList?.length > 0 ? land.amenitiesList : (land.amenities?.split(',') || [])).map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <Check className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-gray-700 font-medium">{item.trim()}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tour Videos */}
          {land.tourVideos?.length > 0 && (
            <section ref={sectionRefs.videos} className="space-y-6">
              <h3 className="text-2xl font-bold border-b pb-4 flex items-center gap-2"><Video className="text-green-600" /> Site Drone View</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {land.tourVideos.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border bg-black shadow-lg">
                    <iframe
                      className="w-full h-full"
                      src={getYouTubeEmbedUrl(url)}
                      title="Land Drone View"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Around the Location */}
          <section ref={sectionRefs.around} className="space-y-6">
            <h3 className="text-2xl font-bold border-b pb-4 flex items-center gap-2"><MapPin className="text-green-600" /> Vicinity Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {land.aroundProject?.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">{item.category}</p>
                      <p className="font-bold text-gray-900">{item.name}</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">{item.distance}</span>
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
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <PhoneCall className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Seller Info</p>
                  <p className="text-xl font-bold text-gray-900">{land.contactDeveloper?.name || 'Owner / Agent'}</p>
                  <div className="flex items-center gap-1 text-green-600 mt-1">
                    <ShieldCheck className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Verified Listing</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600 font-medium">I am interested in this land and would like to get more information.</p>
                <div className="grid grid-cols-1 gap-3">
                  <a 
                    href="https://wa.me/918768380240?text=I%20am%20interested" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full bg-gray-900 hover:bg-black text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95"
                  >
                    <MessageSquare className="w-5 h-5" /> Contact Owner
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
                <button onClick={handleRequestPapers} className="w-full bg-green-50 text-green-600 hover:bg-green-100 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                  <Download className="w-5 h-5" /> Request Land Papers
                </button>
                {land.brochureUrl && (
                  <a href={land.brochureUrl} target="_blank" rel="noreferrer" className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <FileText className="w-5 h-5" /> Detailed Map
                  </a>
                )}
              </div>
            </div>

            {/* Price Trend / Call to Action */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 text-white shadow-xl shadow-green-300">
              <h4 className="text-xl font-bold mb-2">Investment Opportunity</h4>
              <p className="text-green-100 text-sm mb-6 opacity-90">Get a detailed price trend analysis and future growth projection for this locality.</p>
              <button className="w-full bg-white text-green-600 h-12 rounded-xl font-bold hover:bg-green-50 transition-colors">Get Analysis</button>
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
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center text-green-600">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Request Land Papers</h3>
                <p className="text-gray-500 mt-2">Get legal documents, survey reports, and ownership records for this land.</p>
              </div>

              <div className="bg-green-50 p-6 rounded-3xl space-y-1">
                <p className="text-green-900 font-bold text-xl">Service Fee: ₹500</p>
                <p className="text-green-700 text-sm opacity-80">Retaining and verifying government records.</p>
              </div>

              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCheckboxChecked}
                  onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                  className="w-6 h-6 mt-1 rounded border-gray-300 focus:ring-green-500 text-green-600 accent-green-600"
                />
                <span className="text-gray-600 text-sm leading-relaxed">
                  I confirm that I want to request the verified papers for <span className="font-bold text-gray-900">{land.title}</span> and agree to pay the retrieval fee.
                </span>
              </label>

              <button
                onClick={handleSubmitRequest}
                disabled={!isCheckboxChecked || requestSubmitting}
                className={`w-full h-16 rounded-2xl font-bold text-lg transition-all shadow-lg ${isCheckboxChecked && !requestSubmitting
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-200 scale-[1.02]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {requestSubmitting ? 'Processing Request...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandDetails;
