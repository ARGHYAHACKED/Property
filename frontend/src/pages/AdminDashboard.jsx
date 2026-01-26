import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Add, Delete } from '@mui/icons-material';
import { 
  Box, 
  Button, 
  Card, 
  CardContent,
  Dialog, 
  DialogActions, 
  DialogContent,
  DialogContentText,
  DialogTitle, 
  Grid, 
  Typography,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [lands, setLands] = useState([]);
  const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
  const [isLandFormOpen, setIsLandFormOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isPropertyDialogOpen, setIsPropertyDialogOpen] = useState(false);
  const [isLandDialogOpen, setIsLandDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    age: '',
    area: '',
    amenities: '',
    images: [],
    type: 'property'
  });

  useEffect(() => {
    fetchMessages();
    fetchUsers();
    fetchProperties();
    fetchLands();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/messages', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/auth/users', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err.message);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/properties', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setProperties(response.data);
      }
    } catch (err) {
      console.error('Error fetching properties:', err.message);
    }
  };

  const fetchLands = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/lands', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setLands(response.data);
      }
    } catch (err) {
      console.error('Error fetching lands:', err.message);
    }
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === 'images') {
      const fileList = Array.from(files);
      const base64Images = await Promise.all(
        fileList.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        })
      );

      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...base64Images],
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = formData.type === 'property' ? 'properties' : 'lands';
      const response = await axios.post(
        `http://localhost:5001/api/${endpoint}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`${formData.type} details submitted successfully:`, response.data);
      alert(`${formData.type} details submitted successfully!`);
      setIsPropertyFormOpen(false);
      setIsLandFormOpen(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        price: '',
        age: '',
        area: '',
        amenities: '',
        images: [],
        type: 'property'
      });
      if (formData.type === 'property') {
        fetchProperties();
      } else {
        fetchLands();
      }
    } catch (error) {
      console.error(`Error submitting ${formData.type} details:`, error.response?.data || error.message);
      alert(`Error submitting ${formData.type} details. Please try again.`);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5001/api/messages/${messageId}`, {
        withCredentials: true,
      });
      setMessages(messages.filter(message => message._id !== messageId));
    } catch (err) {
      console.error('Error deleting message:', err.message);
      alert('Error deleting message. Please try again.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const endpoint = itemToDelete.type === 'property' ? 'properties' : 'lands';
      await axios.delete(`http://localhost:5001/api/${endpoint}/${itemToDelete.id}`, {
        withCredentials: true,
      });
      if (itemToDelete.type === 'property') {
        setProperties(properties.filter(property => property._id !== itemToDelete.id));
      } else {
        setLands(lands.filter(land => land._id !== itemToDelete.id));
      }
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error(`Error deleting ${itemToDelete.type}:`, err.message);
      alert(`Error deleting ${itemToDelete.type}. Please try again.`);
    }
  };

  const openDeleteConfirm = (id, type) => {
    setItemToDelete({ id, type });
    setDeleteConfirmOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Messages</Typography>
              <Typography variant="h4">{messages.length}</Typography>
              <Button onClick={() => setIsMessageDialogOpen(true)}>View</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Properties</Typography>
              <Typography variant="h4">{properties.length}</Typography>
              <Button onClick={() => setIsPropertyDialogOpen(true)}>View</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Lands</Typography>
              <Typography variant="h4">{lands.length}</Typography>
              <Button onClick={() => setIsLandDialogOpen(true)}>View</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Users</Typography>
              <Typography variant="h4">{users.length}</Typography>
              <Button onClick={() => setIsUserDialogOpen(true)}>View</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          sx={{
            borderRadius: '20px',
            width: 120,
            height: 60,
            backgroundColor: '#2F4F4F',
            color: 'white',
            '&:hover': {
              backgroundColor: '#3D6F6F',
            },
          }}
          onClick={() => {
            setFormData(prev => ({ ...prev, type: 'property' }));
            setIsPropertyFormOpen(true);
          }}
        >
          <Add />
          Add Property
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: '20px',
            width: 120,
            height: 60,
            backgroundColor: '#2F4F4F',
            color: 'white',
            '&:hover': {
              backgroundColor: '#3D6F6F',
            },
          }}
          onClick={() => {
            setFormData(prev => ({ ...prev, type: 'land' }));
            setIsLandFormOpen(true);
          }}
        >
          <Add />
          Add Land
        </Button>
      </Box>

      <Dialog open={isMessageDialogOpen} onClose={() => setIsMessageDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Messages</DialogTitle>
        <DialogContent>
          {messages.map((message, index) => (
            <Card key={message._id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{index + 1}. Message</Typography>
                  <IconButton onClick={() => handleDeleteMessage(message._id)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
                <Typography><strong>Name:</strong> {message.name}</Typography>
                <Typography><strong>Phone:</strong> {message.phone}</Typography>
                <Typography><strong>Plot:</strong> {message.plot}</Typography>
                <Typography><strong>Mouja:</strong> {message.mouja}</Typography>
                <Typography><strong>Comment:</strong> {message.comment}</Typography>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMessageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isUserDialogOpen} onClose={() => setIsUserDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Users</DialogTitle>
        <DialogContent>
          {users.map((user, index) => (
            <Card key={user._id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography><strong>{index + 1}. Name:</strong> {user.name}</Typography>
                <Typography><strong>Email:</strong> {user.email}</Typography>
                <Typography><strong>Phone:</strong> {user.phone}</Typography>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsUserDialogOpen(false)}
            sx={{
              borderRadius: '16px',
              backgroundColor: '#2F4F4F',
              color: 'white',
              '&:hover': {
                backgroundColor: '#3D6F6F',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isPropertyDialogOpen} onClose={() => setIsPropertyDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Properties</DialogTitle>
        <DialogContent>
          {properties.map((property, index) => (
            <Card key={property._id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{index + 1}. {property.title}</Typography>
                  <IconButton onClick={() => openDeleteConfirm(property._id, 'property')} color="error">
                    <Delete />
                  </IconButton>
                </Box>
                <Typography><strong>Price:</strong> ${property.price}</Typography>
                <Typography><strong>Location:</strong> {property.location}</Typography>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPropertyDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isLandDialogOpen} onClose={() => setIsLandDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Lands</DialogTitle>
        <DialogContent>
          {lands.map((land, index) => (
            <Card key={land._id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{index + 1}. {land.title}</Typography>
                  <IconButton onClick={() => openDeleteConfirm(land._id, 'land')} color="error">
                    <Delete />
                  </IconButton>
                </Box>
                <Typography><strong>Price:</strong> ${land.price}</Typography>
                <Typography><strong>Location:</strong> {land.location}</Typography>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLandDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isPropertyFormOpen || isLandFormOpen} onClose={() => {
        setIsPropertyFormOpen(false);
        setIsLandFormOpen(false);
      }}>
        <DialogTitle>Submit {formData.type === 'property' ? 'Property' : 'Land'} Details</DialogTitle>
        <DialogContent>
          <FormFields
            formData={formData}
            handleChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setIsPropertyFormOpen(false);
            setIsLandFormOpen(false);
          }}>Cancel</Button>
          <Button onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const FormFields = ({ formData, handleChange }) => (
  <Box>
    <TextField
      fullWidth
      margin="normal"
      label="Title"
      name="title"
      value={formData.title}
      onChange={handleChange}
      required
    />
    <TextField
      fullWidth
      margin="normal"
      label="Description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      multiline
      rows={4}
      required
    />
    <TextField
      fullWidth
      margin="normal"
      label="Location"
      name="location"
      value={formData.location}
      onChange={handleChange}
      required
    />
    <TextField
      fullWidth
      margin="normal"
      label="Price"
      name="price"
      type="number"
      value={formData.price}
      onChange={handleChange}
      required
    />
    <TextField
      fullWidth
      margin="normal"
      label="Age"
      name="age"
      type="number"
      value={formData.age}
      onChange={handleChange}
      required
    />
    <TextField
      fullWidth
      margin="normal"
      label="Area"
      name="area"
      type="number"
      value={formData.area}
      onChange={handleChange}
      required
    />
    <TextField
      fullWidth
      margin="normal"
      label="Amenities"
      name="amenities"
      value={formData.amenities}
      onChange={handleChange}
      required
    />
    <input
      type="file"
      name="images"
      multiple
      onChange={handleChange}
      style={{ marginTop: '16px' }}
    />
  </Box>
);

export default AdminDashboard;

