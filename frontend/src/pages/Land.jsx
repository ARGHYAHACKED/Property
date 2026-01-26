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

const Land = () => {
  const [lands, setLands] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [isSelling, setIsSelling] = useState(false);
  const [sellData, setSellData] = useState({ title: "", description: "", price: "", location: "", area: "" });
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch lands from the API
  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/lands");
        setLands(response.data);
      } catch (error) {
        console.error("Error fetching lands:", error);
      }
    };
    fetchLands();
  }, []);

  const handleLocationChange = (e) => {
    const { value, checked } = e.target;
    setSelectedLocations((prev) =>
      checked ? [...prev, value] : prev.filter((loc) => loc !== value)
    );
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSizes((prev) =>
      checked ? [...prev, value] : prev.filter((size) => size !== value)
    );
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
      await axios.post("http://localhost:5001/api/lands", sellData);
      alert("Land added successfully!");
      setIsSelling(false);
      setSellData({ title: "", description: "", price: "", location: "", area: "" });
    } catch (error) {
      console.error("Error adding land:", error);
      alert("Failed to add land. Please try again.");
    }
  };

  const filteredLands = lands.filter((land) => {
    const codeMatch = searchCode
      ? land.title.toLowerCase().includes(searchCode.toLowerCase())
      : true;
    const locationMatch = selectedLocations.length
      ? selectedLocations.includes(land.location)
      : true;
    const sizeMatch = selectedSizes.length
      ? selectedSizes.includes(land.area)
      : true;
    return codeMatch && locationMatch && sizeMatch;
  });

  const handleLandClick = (land) => {
    navigate(`/land/${land.id}`); // Use navigate to redirect to the land detail page
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
            } absolute lg:relative z-10 bg-white shadow-lg p-4 rounded-lg lg:w-1/4 w-64`}
        >
          <h4 className="font-bold mb-2">Location</h4>
          {["Jaipur", "Pune", "Bangalore"].map((loc) => (
            <label key={loc} className="block">
              <input
                type="checkbox"
                value={loc}
                onChange={handleLocationChange}
                className="mr-2"
              />
              {loc}
            </label>
          ))}

          <h4 className="font-bold mt-4 mb-2">Size</h4>
          {["5 acres", "2,000 sq ft", "10,000 sq ft"].map((size) => (
            <label key={size} className="block">
              <input
                type="checkbox"
                value={size}
                onChange={handleSizeChange}
                className="mr-2"
              />
              {size}
            </label>
          ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLands.map((land, index) => (
              <React.Fragment key={land._id}>
                <div
                  className="bg-white p-4 shadow rounded-lg hover:shadow-lg cursor-pointer"
                  onClick={() => handleLandClick(land)} // Trigger the click handler
                >
                  <img
                    src={land.imageUrl || "https://via.placeholder.com/150"}
                    alt={land.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <h5 className="text-lg font-bold mt-2">{land.title}</h5>
                  <p>{land.description}</p>
                  <p>₹{land.price.toLocaleString()}</p>
                  <p>Location: {land.location}</p>
                </div>

                {/* Add blank space after every two cards on small screens */}
                {index % 2 === 1 && (
                  <div className="sm:hidden block h-[250px] "></div>
                )}
              </React.Fragment>
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
