// Example: How to use API_BASE_URL in your components

import axios from 'axios';
import API_BASE_URL from '../config/api';

// ✅ CORRECT WAY - Use API_BASE_URL
const fetchData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/lands`);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// ✅ With authentication header
const fetchProtected = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// ✅ POST request with data
const submitData = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/properties`, data);
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// ❌ WRONG WAY - Don't hardcode localhost
// const response = await axios.get('http://localhost:5001/api/lands');

export { fetchData, fetchProtected, submitData };
