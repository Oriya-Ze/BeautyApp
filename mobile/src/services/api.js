import axios from 'axios';

// Update this to match your backend URL
// For development: 'http://localhost:5000' (use your computer's IP for physical device)
// For Android emulator: 'http://10.0.2.2:5000'
// For iOS simulator: 'http://localhost:5000'
const API_URL = __DEV__ 
  ? 'http://localhost:5000'  // Change to your IP for physical device testing
  : 'https://your-production-api.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Analyze face image
 * @param {string} imageUri - Local URI of the image
 * @returns {Promise} Analysis results with recommendations
 */
export const analyzeFace = async (imageUri) => {
  const formData = new FormData();
  
  // Extract filename from URI
  const filename = imageUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('image', {
    uri: imageUri,
    name: filename || 'photo.jpg',
    type: type,
  });

  try {
    const response = await api.post('/api/analyze-face', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default api;


