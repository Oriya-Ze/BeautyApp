import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { analyzeFace } from '../services/api'
import './AnalyzingScreen.css'

export default function AnalyzingScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const imageFile = location.state?.image

  useEffect(() => {
    if (!imageFile) {
      // If no image, redirect back to upload
      navigate('/')
      return
    }

    const analyzeImage = async () => {
      try {
        const result = await analyzeFace(imageFile)
        
        if (result.success) {
          // Store results in sessionStorage
          sessionStorage.setItem('analysisResults', JSON.stringify({
            analysis: result.analysis,
            recommendations: result.recommendations
          }))
          
          // Navigate to results
          navigate('/results')
        } else {
          throw new Error('Analysis failed')
        }
      } catch (error) {
        console.error('Analysis error:', error)
        alert(
          error.response?.data?.error || 
          'Failed to analyze image. Please try again.'
        )
        navigate('/')
      }
    }

    analyzeImage()
  }, [imageFile, navigate])

  return (
    <div className="analyzing-screen">
      <div className="screen-container">
        <div className="analyzing-container">
          <div className="card analyzing-card">
            <div className="spinner analyzing-spinner"></div>
            <h2 className="analyzing-text">Analyzing Your Photo...</h2>
            <p className="analyzing-subtext">
              Our AI is analyzing your facial features, skin tone, and undertone
              to provide personalized recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

