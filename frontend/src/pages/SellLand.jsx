import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, FileText, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import API_BASE_URL from '../config/api';

const SellLand = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    mouja: "",
    plot: "",
    khatian: "",
    comment: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError("");
  };

  const validateStep1 = () => {
    if (!form.name || !form.phone) {
      setError("Name and Phone are required.");
      return false;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mouja || !form.plot || !form.khatian) {
      setError("Please fill all required land details.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token"))
        ?.split("=")[1]; 

      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        `${API_BASE_URL}/api/messages/create`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCurrentStep(3); // Success step
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 md:p-12 font-sans selection:bg-black selection:text-white">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black z-50"></div>
      
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">
            Liquidate <br />
            <span className="text-gray-300">Your Asset</span>
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Premium Land Listing Portal</p>
        </div>

        {/* Form Container */}
        <div className="bg-white border-[10px] border-black p-8 md:p-12 shadow-[30px_30px_0px_0px_rgba(0,0,0,0.1)] transition-all">
          {error && (
            <div className="bg-black text-white p-4 mb-8 font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
              <span className="bg-white text-black w-5 h-5 flex items-center justify-center rounded-full text-xs">!</span>
              {error}
            </div>
          )}

          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="flex items-center gap-4 mb-10 border-b-4 border-black pb-4">
                 <div className="bg-black text-white p-3"><User className="w-6 h-6"/></div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter">Contact Identity</h2>
              </div>
              
              <div className="space-y-8">
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 group-focus-within:text-black transition-colors">Owner Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-3 text-xl font-bold transition-all placeholder:text-gray-200"
                    placeholder="FULL LEGAL NAME"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 group-focus-within:text-black transition-colors">Primary Phone</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={form.phone} 
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-3 text-xl font-bold transition-all placeholder:text-gray-200"
                      placeholder="10 DIGIT NUMBER"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 group-focus-within:text-black transition-colors">Alternate Contact</label>
                    <input 
                      type="tel" 
                      name="altPhone" 
                      value={form.altPhone} 
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-3 text-xl font-bold transition-all placeholder:text-gray-200"
                      placeholder="OPTIONAL"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full mt-10 bg-black text-white font-black py-6 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-sm hover:invert transition-all"
                >
                  Configure Details <ArrowRight className="w-5 h-5"/>
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-6 duration-500">
              <div className="flex items-center gap-4 mb-10 border-b-4 border-black pb-4">
                 <div className="bg-black text-white p-3"><MapPin className="w-6 h-6"/></div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter">Land Attributes</h2>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Mouja</label>
                    <input 
                      type="text" 
                      name="mouja" 
                      value={form.mouja} 
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-3 font-bold text-lg"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Plot No.</label>
                    <input 
                      type="text" 
                      name="plot" 
                      value={form.plot} 
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-3 font-bold text-lg"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Khatian</label>
                    <input 
                      type="text" 
                      name="khatian" 
                      value={form.khatian} 
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-200 focus:border-black outline-none py-3 font-bold text-lg"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 uppercase">Additional Briefing</label>
                  <textarea 
                    name="comment" 
                    value={form.comment} 
                    onChange={handleChange}
                    rows="4"
                    className="w-full border-2 border-gray-100 focus:border-black outline-none p-4 font-bold text-lg bg-gray-50/50"
                    placeholder="ADD ANY SPECIFIC DETAILS OR NOTES..."
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="w-1/3 border-4 border-black text-black font-black py-6 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-sm hover:bg-black hover:text-white transition-all"
                  >
                    <ArrowLeft className="w-5 h-5"/>
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-2/3 bg-black text-white font-black py-6 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-sm hover:invert transition-all disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin"/> : <>Submit Proposal <CheckCircle className="w-5 h-5"/></>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center py-12 animate-in zoom-in-95 duration-500">
               <div className="w-32 h-32 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <CheckCircle className="w-16 h-16"/>
               </div>
               <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Submission <br/> Received</h2>
               <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-10 text-center mx-auto max-w-xs leading-loose">
                  Your inquiry has been logged into our premium secure ledger. Our specialists will contact you shortly.
               </p>
               <button 
                  onClick={() => navigate('/land')}
                  className="border-4 border-black px-12 py-5 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all"
                >
                  Return to portal
               </button>
            </div>
          )}
        </div>

        {/* Footer Text */}
        <div className="mt-12 flex justify-between items-center px-4">
           <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">55ACRE / LIQUIDITY / L-PORTAL</div>
           <div className="flex gap-1">
              {[1,2,3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${currentStep >= i ? 'bg-black' : 'bg-gray-200'}`}></div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SellLand;

