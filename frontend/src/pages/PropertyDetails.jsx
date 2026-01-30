import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  useEffect(() => {
    const fetchPropertyAndRelated = async () => {
      try {
        const propertyRes = await axios.get(`${API_BASE_URL}/api/properties/${id}`);
        setProperty(propertyRes.data);

        // Fetch all properties and get related ones (same location or similar price)
        const allPropertiesRes = await axios.get(`${API_BASE_URL}/api/properties`);
        const related = allPropertiesRes.data
          .filter((p) => p.id !== id && p._id !== id && p.location === propertyRes.data.location)
          .slice(0, 4);
        
        setRelatedProperties(related);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch property details');
        setLoading(false);
      }
    };

    fetchPropertyAndRelated();
  }, [id]);

  const handlePreviousImage = () => {
    if (property?.imageUrls) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.imageUrls.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (property?.imageUrls) {
      setCurrentImageIndex((prev) =>
        prev === property.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const getAuthToken = () => Cookies.get('token') || localStorage.getItem('token');

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !isModalOpen) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data?.user || res.data);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, [isModalOpen]);

  const handleRequestPapers = () => {
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const handleSubmitRequest = async () => {
    const token = getAuthToken();
    if (!token || !currentUser?._id) {
      alert('Please log in to request papers.');
      return;
    }
    if (!isCheckboxChecked) {
      alert('Please confirm that you agree to pay the fee.');
      return;
    }

    setRequestSubmitting(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/request`,
        { userId: currentUser._id, propertyId: id, landId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Request submitted successfully!');
      setIsModalOpen(false);
      setIsCheckboxChecked(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Request failed';
      alert(msg);
    } finally {
      setRequestSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const amenities = property.amenities ? (typeof property.amenities === 'string' 
    ? property.amenities.split(',').map(a => a.trim()) 
    : Array.isArray(property.amenities) ? property.amenities : []) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-black hover:text-gray-600 font-semibold transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Listings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Image Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Image & Gallery */}
          <div className="lg:col-span-2">
            <div className="relative h-96 sm:h-500px lg:h-600px rounded-2xl overflow-hidden bg-gray-200 group mb-4">
              {property.imageUrls && property.imageUrls.length > 0 ? (
                <>
                  <img
                    src={property.imageUrls[currentImageIndex]}
                    alt={`${property.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {currentImageIndex + 1} / {property.imageUrls.length}
                  </div>

                  {/* Wishlist & Share Buttons */}
                  <div className="absolute top-4 left-4 flex gap-2 z-20">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-3 rounded-full transition-all ${
                        isWishlisted
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      <Heart className="w-6 h-6" />
                    </button>
                    <button className="p-3 rounded-full bg-white text-black hover:bg-gray-100 transition-all">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <span className="text-gray-600">No images available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {property.imageUrls && property.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.imageUrls.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      idx === currentImageIndex ? 'border-black' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Info Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-fit sticky top-24">
            <h1 className="text-3xl font-bold text-black mb-4">{property.title}</h1>

            {/* Price */}
            <div className="mb-6 pb-6 border-b-2 border-gray-200">
              <p className="text-gray-600 text-sm mb-2">Price</p>
              <p className="text-4xl font-bold text-black">₹{(property.price || 0).toLocaleString()}</p>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 mb-6">
              <MapPin className="w-5 h-5 text-black flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-600 text-sm">Location</p>
                <p className="text-lg font-semibold text-black">{property.location}</p>
              </div>
            </div>

            {/* Quick Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b-2 border-gray-200">
              {property.area && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-xs mb-1">Area</p>
                  <p className="text-lg font-bold text-black">{property.area} acres</p>
                </div>
              )}
              {property.age && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-xs mb-1">Age</p>
                  <p className="text-lg font-bold text-black">{property.age} years</p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-lg transition-all">
                <Phone className="w-5 h-5" />
                Contact Agent
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-black text-black hover:bg-gray-50 font-bold rounded-lg transition-all">
                <Mail className="w-5 h-5" />
                Send Message
              </button>
            </div>

            {/* Request Papers Button */}
            <button
              onClick={handleRequestPapers}
              className="w-full px-4 py-3 bg-gray-800 hover:bg-black text-white font-bold rounded-lg transition-all"
            >
              Request Property Papers
            </button>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Description & Details */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-black mb-4">About This Property</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{property.description}</p>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.area && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Ruler className="w-6 h-6 text-black flex-shrink-0" />
                    <div>
                      <p className="text-gray-600 text-sm">Total Area</p>
                      <p className="text-xl font-bold text-black">{property.area} acres</p>
                    </div>
                  </div>
                )}
                {property.age && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-6 h-6 text-black flex-shrink-0" />
                    <div>
                      <p className="text-gray-600 text-sm">Property Age</p>
                      <p className="text-xl font-bold text-black">{property.age} years old</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Home className="w-6 h-6 text-black flex-shrink-0" />
                  <div>
                    <p className="text-gray-600 text-sm">Property Type</p>
                    <p className="text-xl font-bold text-black">Residential Land</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-black flex-shrink-0" />
                  <div>
                    <p className="text-gray-600 text-sm">Price per Acre</p>
                    <p className="text-xl font-bold text-black">₹{((property.price || 0) / (property.area || 1)).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-black mb-6">Amenities & Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Check className="w-5 h-5 text-black flex-shrink-0" />
                      <p className="text-gray-700 font-medium">{amenity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Highlights */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-black mb-6">Key Highlights</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-black">
                <p className="font-semibold text-black mb-1">Prime Location</p>
                <p className="text-gray-700 text-sm">Located in a high-demand area</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-black">
                <p className="font-semibold text-black mb-1">Verified Listing</p>
                <p className="text-gray-700 text-sm">100% verified and authentic</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-black">
                <p className="font-semibold text-black mb-1">Best Price</p>
                <p className="text-gray-700 text-sm">Competitive pricing in the area</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-black">
                <p className="font-semibold text-black mb-1">Expert Support</p>
                <p className="text-gray-700 text-sm">24/7 customer support available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-black mb-8 border-b-2 border-black pb-4">
              More Properties in {property.location}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProperties.map((prop) => (
                <div
                  key={prop._id || prop.id}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/property-details/${prop._id || prop.id}`)}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden group">
                    <img
                      src={prop.imageUrl || prop.imageUrls?.[0] || 'https://via.placeholder.com/400x300'}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">{prop.title}</h3>
                    
                    <div className="flex items-center gap-2 text-gray-700 mb-3">
                      <MapPin className="w-4 h-4" />
                      <p className="text-sm">{prop.location}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
                      <p className="text-xl font-bold text-black">₹{(prop.price || 0).toLocaleString()}</p>
                      {prop.area && <p className="text-sm text-gray-600">{prop.area} acres</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Request Papers Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-black">Request Property Papers</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {!getAuthToken() ? (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 font-medium mb-3">Please log in to request papers.</p>
                <button
                  onClick={() => { setIsModalOpen(false); navigate('/login'); }}
                  className="w-full px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-black">
                  <p className="text-gray-700">
                    <span className="font-bold text-black">Fee:</span> ₹500 for requesting property papers
                  </p>
                </div>

                <label className="flex items-start gap-3 mb-6 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
                  <input
                    type="checkbox"
                    checked={isCheckboxChecked}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 mt-1 accent-black cursor-pointer"
                  />
                  <span className="text-gray-700">
                    I confirm my request and agree to pay ₹500 for the property papers
                  </span>
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitRequest}
                    disabled={!currentUser || !isCheckboxChecked || requestSubmitting}
                    className={`flex-1 px-4 py-3 font-bold rounded-lg transition-all ${
                      currentUser && isCheckboxChecked && !requestSubmitting
                        ? 'bg-black hover:bg-gray-800 text-white'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {requestSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
