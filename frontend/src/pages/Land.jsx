import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import API_BASE_URL from '../config/api';

const Land = () => {
  const [lands, setLands] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [areaRanges, setAreaRanges] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [showMoreAreas, setShowMoreAreas] = useState(false);
  const [showMorePrices, setShowMorePrices] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [isSelling, setIsSelling] = useState(false);
  const [sellData, setSellData] = useState({ title: "", description: "", price: "", location: "", area: "" });
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch lands from the API
  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/lands`);
        setLands(response.data);
      } catch (error) {
        console.error("Error fetching lands:", error);
      }
    };
    fetchLands();
  }, []);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        console.log('Fetching filter options from:', `${API_BASE_URL}/api/lands/filters`);
        const response = await axios.get(`${API_BASE_URL}/api/lands/filters`);
        console.log('Filter options received:', response.data);

        if (response.data) {
          setAvailableLocations(response.data.locations || []);
          setAreaRanges(response.data.areaRanges || [
            { label: "0 - 5 acres", min: 0, max: 5 },
            { label: "5 - 10 acres", min: 5, max: 10 },
            { label: "10 - 20 acres", min: 10, max: 20 },
            { label: "20 - 55 acres", min: 20, max: 55 },
            { label: "55+ acres", min: 55, max: Infinity }
          ]);
          setPriceRanges(response.data.priceRanges || []);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
        console.error("Error details:", error.response?.data || error.message);

        // Set fallback values on error
        setAvailableLocations([]);
        setAreaRanges([
          { label: "0 - 5 acres", min: 0, max: 5 },
          { label: "5 - 10 acres", min: 5, max: 10 },
          { label: "10 - 20 acres", min: 10, max: 20 },
          { label: "20 - 55 acres", min: 20, max: 55 },
          { label: "55+ acres", min: 55, max: Infinity }
        ]);
        setPriceRanges([]);
      }
    };
    fetchFilterOptions();
  }, []);

  const handleLocationChange = (e) => {
    const { value, checked } = e.target;
    setSelectedLocations((prev) =>
      checked ? [...prev, value] : prev.filter((loc) => loc !== value)
    );
  };

  const handleAreaChange = (e) => {
    const { value, checked } = e.target;
    const selectedRange = areaRanges.find((range) => range.label === value);
    if (selectedRange) {
      setSelectedAreas((prev) =>
        checked ? [...prev, selectedRange] : prev.filter((area) => area.label !== value)
      );
    }
  };

  const handlePriceChange = (e) => {
    const { value, checked } = e.target;
    const selectedRange = priceRanges.find((range) => range.label === value);
    if (selectedRange) {
      setSelectedPrices((prev) =>
        checked ? [...prev, selectedRange] : prev.filter((price) => price.label !== value)
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearchCode(e.target.value);
  };

  const handleSellChange = (e) => {
    const { name, value } = e.target;
    setSellData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSellSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/lands`, sellData);
      alert("Land added successfully!");
      setIsSelling(false);
      setSellData({ title: "", description: "", price: "", location: "", area: "" });

      // Refresh lands and filter options
      const landsResponse = await axios.get(`${API_BASE_URL}/api/lands`);
      setLands(landsResponse.data);

      const filterResponse = await axios.get(`${API_BASE_URL}/api/lands/filters`);
      setAvailableLocations(filterResponse.data.locations);
      setAreaRanges(filterResponse.data.areaRanges);
      setPriceRanges(filterResponse.data.priceRanges);
    } catch (error) {
      console.error("Error adding land:", error);
      alert("Failed to add land. Please try again.");
    }
  };

  const filteredLands = lands.filter((land) => {
    const codeMatch = searchCode
      ? land.title.toLowerCase().includes(searchCode.toLowerCase())
      : true;

    const locationMatch = selectedLocations.length === 0
      ? true
      : selectedLocations.includes(land.location);

    const areaMatch = selectedAreas.length === 0 ? true : selectedAreas.some(selectedRange => {
      const landAreaNum = parseFloat(land.area);
      return landAreaNum >= selectedRange.min && landAreaNum <= selectedRange.max;
    });

    const priceMatch = selectedPrices.length === 0 ? true : selectedPrices.some(selectedRange => {
      return land.price >= selectedRange.min && land.price <= selectedRange.max;
    });

    return codeMatch && locationMatch && areaMatch && priceMatch;
  });

  const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const handleLandClick = (land) => {
    navigate(`/land/${land._id || land.id}`); // Use _id or fallback to id
  };

  return (
    <div className="flex flex-col p-4 bg-gray-100 min-h-screen">
      {/* Sell Button */}
      <Button
        variant="contained"
        color="success"
        onClick={() => navigate("/sell")} // Navigate to the /sell route
        sx={{ alignSelf: "flex-end", marginBottom: "16px" }}
      >
        Want to Sell?
      </Button>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="block lg:hidden bg-green-500 text-white px-4 py-2 rounded-lg shadow mb-4"
      >
        Filter Options
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Section */}
        <div
          className={`lg:block ${isFilterOpen ? "block" : "hidden"
            } absolute lg:relative z-10 bg-white shadow-lg p-4 rounded-lg lg:w-1/4 w-64 max-h-screen overflow-y-auto`}
        >
          {/* Location Filter */}
          <h4 className="font-bold mb-3 text-lg">Location</h4>
          {availableLocations.length > 0 ? (
            availableLocations.map((loc) => (
              <label key={loc} className="block mb-2">
                <input
                  type="checkbox"
                  value={loc}
                  onChange={handleLocationChange}
                  className="mr-2"
                />
                {loc}
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No locations available</p>
          )}

          {/* Area Range Filter */}
          <h4 className="font-bold mt-4 mb-3 text-lg">Area</h4>
          {areaRanges.length > 0 ? (
            <>
              {areaRanges.slice(0, showMoreAreas ? areaRanges.length : 5).map((range) => (
                <label key={range.label} className="block mb-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    value={range.label}
                    onChange={handleAreaChange}
                    className="mr-2"
                  />
                  {range.label}
                </label>
              ))}
              {areaRanges.length > 5 && (
                <button
                  onClick={() => setShowMoreAreas(!showMoreAreas)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-2"
                >
                  {showMoreAreas ? "Show Less" : "Show More"}
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-sm">No areas available</p>
          )}

          {/* Price Range Filter */}
          <h4 className="font-bold mt-4 mb-3 text-lg">Price</h4>
          {priceRanges.length > 0 ? (
            <>
              {priceRanges.slice(0, showMorePrices ? priceRanges.length : 5).map((range) => (
                <label key={range.label} className="block mb-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    value={range.label}
                    onChange={handlePriceChange}
                    className="mr-2"
                  />
                  {range.label}
                </label>
              ))}
              {priceRanges.length > 5 && (
                <button
                  onClick={() => setShowMorePrices(!showMorePrices)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold mt-2"
                >
                  {showMorePrices ? "Show Less" : "Show More"}
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-sm">No price ranges available</p>
          )}
        </div>

        {/* Land Cards Section */}
        <div className="lg:w-3/4 w-full mt-4 lg:mt-0">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Title"
              value={searchCode}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {filteredLands.map((land) => (
              <div
                key={land._id || land.id}
                onClick={() => handleLandClick(land)}
                className="bg-white p-3 md:p-4 shadow-sm hover:shadow-2xl transition-all border border-gray-100 hover:border-black rounded-none cursor-pointer flex flex-col group h-full"
              >
                <div className="overflow-hidden h-32 md:h-48 rounded-none mb-3">
                  <img
                    src={land.imageUrl || "https://placehold.co/400x300?text=Land+Image"}
                    alt={land.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h5 className="text-xs md:text-lg font-black uppercase tracking-tight line-clamp-1">{land.title}</h5>
                <p className="hidden md:block text-gray-500 text-xs mb-2 line-clamp-2 font-medium">{land.description}</p>
                <div className="mt-auto">
                    <p className="text-sm md:text-xl font-black text-black mb-1">
                    {land.avgPrice || formatPrice(land.price)}
                    </p>
                    <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-gray-400 truncate">📍 {land.location}</p>
                    
                    <button
                    onClick={(e) => { e.stopPropagation(); handleLandClick(land); }}
                    className="hidden md:block w-full bg-black hover:bg-gray-800 text-white font-black uppercase tracking-widest py-2 px-4 transition-all mt-4 text-xs"
                    >
                    View Details
                    </button>
                </div>
              </div>
            ))}

            {filteredLands.length === 0 && (
              <p className="text-center col-span-full text-gray-500">
                No lands found.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sell Form Dialog */}
      <Dialog open={isSelling} onClose={() => setIsSelling(false)}>
        <DialogTitle>Sell Your Land</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            value={sellData.title}
            onChange={handleSellChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={sellData.description}
            onChange={handleSellChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="price"
            label="Price"
            value={sellData.price}
            onChange={handleSellChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="location"
            label="Location"
            value={sellData.location}
            onChange={handleSellChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="area"
            label="Area"
            value={sellData.area}
            onChange={handleSellChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSelling(false)}>Cancel</Button>
          <Button onClick={handleSellSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Land;
