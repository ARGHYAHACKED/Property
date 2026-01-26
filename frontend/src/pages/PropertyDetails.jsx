import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import {
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Modal,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const PropertyDetails = () => {
  const { id } = useParams(); // Property ID from URL
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  // User Info (Replace this with the logged-in user data)
  const userId = "67533ce7a4fdf6b9ff5abf04"; // Replace with logged-in user's ID

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/properties/${id}`);
        setLand(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch property details');
        setLoading(false);
      }
    };

    fetchLand();
  }, [id]);

  const nextImage = () => {
    if (land && land.imageUrls) {
      setCurrentIndex((prevIndex) =>
        prevIndex === land.imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (land && land.imageUrls) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? land.imageUrls.length - 1 : prevIndex - 1
      );
    }
  };

  const handleRequestPapers = () => {
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const handleSubmitRequest = async () => {
    const requestData = {
      userId,
      landId: id, // Ensure you use `landId` instead of `propertyId`
      confirmation: isCheckboxChecked,
    };
    console.log(requestData);

    try {
      await axios.post(`${API_BASE_URL}/api/land-request`, requestData);
      alert('Request submitted successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request.');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Box maxWidth="lg" mx="auto" p={3}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {land.title}
          </Typography>

          {/* Image Carousel */}
          <Box position="relative" mb={3} height={400}>
            {land.imageUrls && land.imageUrls.length > 0 ? (
              <>
                <Box height="100%" overflow="hidden" borderRadius={2}>
                  <img
                    src={land.imageUrls[currentIndex]}
                    alt={`Land Image ${currentIndex + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <IconButton
                  size="large"
                  onClick={prevImage}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 16,
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  size="large"
                  onClick={nextImage}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 16,
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </>
            ) : (
              <Box
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="grey.200"
                borderRadius={2}
              >
                <Typography>No images available</Typography>
              </Box>
            )}
          </Box>

          {/* Land Description */}
          <Typography variant="body1" paragraph>
            {land.description}
          </Typography>

          {/* Price */}
          <Typography variant="h6" gutterBottom>
            Price: <Box component="span" color="success.main">₹{land.price.toLocaleString()}</Box>
          </Typography>

          {/* Location */}
          <Typography variant="h6" gutterBottom>
            Location: <Box component="span" color="text.secondary">{land.location}</Box>
          </Typography>

          {/* Request for Papers Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleRequestPapers}
            sx={{ mt: 2 }}
          >
            Request for Papers
          </Button>
        </CardContent>
      </Card>

      {/* Modal for Request Confirmation */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="request-papers-modal"
        aria-describedby="request-papers-description"
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width={400}
          bgcolor="background.paper"
          p={4}
          borderRadius={2}
          boxShadow={24}
        >
          <Typography variant="h6" gutterBottom>
            Confirm Request
          </Typography>
          <Typography variant="body1" mb={2}>
            I am ready to pay ₹500 for requesting the property papers.
          </Typography>
          <FormControlLabel
            control={<Checkbox checked={isCheckboxChecked} onChange={handleCheckboxChange} />}
            label="I confirm my request"
          />
          <Button
            variant="contained"
            color="success"
            fullWidth
            disabled={!isCheckboxChecked}
            onClick={handleSubmitRequest}
            sx={{ mt: 2 }}
          >
            Submit Request
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default PropertyDetails;
