import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const LandDetails = () => {
  const { id } = useParams();
  const [land, setLand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/lands/${id}`);
        setLand(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch land details');
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
    setOpenDialog(true);
  };

  const handleSubmitRequest = async () => {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token"))
        ?.split("=")[1];  // Assuming the token is stored in localStorage
    if (!token) {
      alert('You must be logged in to request papers.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/land-request/create',
        { landId: id }, // Send only the landId
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );
      console.log(response.data);
      setRequestSuccess(true);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit the request. Please try again.');
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

          {/* Dialog for Request */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Request Land Papers</DialogTitle>
            <DialogContent>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                  />
                }
                label="I agree to spend ₹500 for these papers"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleSubmitRequest}
                color="primary"
                variant="contained"
                disabled={!isAgreed} // Disable button unless agreed
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>

          {/* Success Message */}
          {requestSuccess && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              Request submitted successfully!
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LandDetails;
