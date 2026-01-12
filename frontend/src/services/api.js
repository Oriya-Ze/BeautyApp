import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 seconds for image upload/processing
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Analyze face image
 * @param {File} imageFile - Image file to analyze
 * @returns {Promise} Analysis results with recommendations
 */
export const analyzeFace = async (imageFile) => {
  const formData = new FormData()
  formData.append('image', imageFile)

  try {
    const response = await api.post('/api/analyze-face', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

/**
 * Get test recommendations (for testing without image)
 */
export const getTestRecommendations = async () => {
  try {
    const response = await api.get('/api/recommendations/test')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export default api


