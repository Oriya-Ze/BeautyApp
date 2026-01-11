import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSparkles, FiDroplet, FiEye, FiShoppingBag, FiExternalLink } from 'react-icons/fi'
import './ResultsScreen.css'

export default function ResultsScreen() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('skincare')
  const [analysis, setAnalysis] = useState(null)
  const [recommendations, setRecommendations] = useState(null)

  useEffect(() => {
    // Get results from sessionStorage
    const storedResults = sessionStorage.getItem('analysisResults')
    
    if (!storedResults) {
      // If no results, redirect to upload
      navigate('/')
      return
    }

    try {
      const results = JSON.parse(storedResults)
      setAnalysis(results.analysis)
      setRecommendations(results.recommendations)
    } catch (error) {
      console.error('Error parsing results:', error)
      navigate('/')
    }
  }, [navigate])

  const openUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (!analysis || !recommendations) {
    return (
      <div className="results-screen">
        <div className="screen-container">
          <div className="analyzing-container">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="results-screen">
      <div className="screen-container">
        <div className="results-container">
          <div className="results-header">
            <h1 className="results-title">✨ Your Personalized Guide</h1>
            <div className="analysis-info">
              <span>Skin: <strong>{analysis.skinType}</strong></span>
              <span>•</span>
              <span>Tone: <strong>{analysis.skinTone}</strong></span>
              <span>•</span>
              <span>Undertone: <strong>{analysis.undertone}</strong></span>
            </div>
          </div>

          <div className="card">
            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'skincare' ? 'active' : ''}`}
                onClick={() => setActiveTab('skincare')}
              >
                <FiDroplet /> Skincare
              </button>
              <button
                className={`tab ${activeTab === 'makeup' ? 'active' : ''}`}
                onClick={() => setActiveTab('makeup')}
              >
                <FiSparkles /> Makeup
              </button>
              <button
                className={`tab ${activeTab === 'outfits' ? 'active' : ''}`}
                onClick={() => setActiveTab('outfits')}
              >
                <FiShoppingBag /> Outfits
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'skincare' && (
                <div className="recommendations-grid">
                  <RecommendationCard
                    title="Cleanser"
                    icon={<FiDroplet />}
                    description={recommendations.skincare.cleanser.type}
                    detail={recommendations.skincare.cleanser.description}
                    url={recommendations.skincare.cleanser.url}
                    onPress={() => openUrl(recommendations.skincare.cleanser.url)}
                  />
                  <RecommendationCard
                    title="Serum"
                    icon={<FiDroplet />}
                    description={recommendations.skincare.serum.type}
                    detail={recommendations.skincare.serum.description}
                    url={recommendations.skincare.serum.url}
                    onPress={() => openUrl(recommendations.skincare.serum.url)}
                  />
                  <RecommendationCard
                    title="Moisturizer"
                    icon={<FiDroplet />}
                    description={recommendations.skincare.moisturizer.type}
                    detail={recommendations.skincare.moisturizer.description}
                    url={recommendations.skincare.moisturizer.url}
                    onPress={() => openUrl(recommendations.skincare.moisturizer.url)}
                  />
                  <RecommendationCard
                    title="SPF Protection"
                    icon={<FiDroplet />}
                    description={recommendations.skincare.spf.type}
                    detail={recommendations.skincare.spf.description}
                    url={recommendations.skincare.spf.url}
                    onPress={() => openUrl(recommendations.skincare.spf.url)}
                  />
                </div>
              )}

              {activeTab === 'makeup' && (
                <div className="recommendations-grid">
                  <RecommendationCard
                    title="Foundation"
                    icon={<FiSparkles />}
                    description={recommendations.makeup.foundation.type}
                    detail={recommendations.makeup.foundation.description}
                    url={recommendations.makeup.foundation.url}
                    onPress={() => openUrl(recommendations.makeup.foundation.url)}
                  />
                  <RecommendationCard
                    title="Blush Shades"
                    icon={<FiSparkles />}
                    description={recommendations.makeup.blush.shades.join(', ')}
                    detail={recommendations.makeup.blush.description}
                    badges={recommendations.makeup.blush.shades}
                    url={recommendations.makeup.blush.url}
                    onPress={() => openUrl(recommendations.makeup.blush.url)}
                  />
                  <RecommendationCard
                    title="Lipstick Shades"
                    icon={<FiSparkles />}
                    description={recommendations.makeup.lipstick.shades.join(', ')}
                    detail={recommendations.makeup.lipstick.description}
                    badges={recommendations.makeup.lipstick.shades}
                    url={recommendations.makeup.lipstick.url}
                    onPress={() => openUrl(recommendations.makeup.lipstick.url)}
                  />
                  <RecommendationCard
                    title="Eye Makeup"
                    icon={<FiEye />}
                    description={recommendations.makeup.eyeMakeup.style}
                    detail={recommendations.makeup.eyeMakeup.description}
                    url={recommendations.makeup.eyeMakeup.url}
                    onPress={() => openUrl(recommendations.makeup.eyeMakeup.url)}
                  />
                </div>
              )}

              {activeTab === 'outfits' && (
                <div className="recommendations-grid">
                  <RecommendationCard
                    title={recommendations.outfits.outfit1.style}
                    icon={<FiShoppingBag />}
                    description={recommendations.outfits.outfit1.description}
                    detail={`Colors: ${recommendations.outfits.outfit1.colors.join(', ')}`}
                    badges={recommendations.outfits.outfit1.colors}
                    url={recommendations.outfits.outfit1.url}
                    onPress={() => openUrl(recommendations.outfits.outfit1.url)}
                  />
                  <RecommendationCard
                    title={recommendations.outfits.outfit2.style}
                    icon={<FiShoppingBag />}
                    description={recommendations.outfits.outfit2.description}
                    detail={`Colors: ${recommendations.outfits.outfit2.colors.join(', ')}`}
                    badges={recommendations.outfits.outfit2.colors}
                    url={recommendations.outfits.outfit2.url}
                    onPress={() => openUrl(recommendations.outfits.outfit2.url)}
                  />
                </div>
              )}
            </div>

            <div className="results-footer">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  sessionStorage.removeItem('analysisResults')
                  sessionStorage.removeItem('uploadedImage')
                  navigate('/')
                }}
              >
                Analyze Another Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const RecommendationCard = ({ title, icon, description, detail, badges, url, onPress }) => (
  <div className="recommendation-card" onClick={onPress}>
    <div className="recommendation-title">
      {icon}
      {title}
    </div>
    <div className="recommendation-description">{description}</div>
    {detail && <div className="recommendation-detail">{detail}</div>}
    {badges && badges.length > 0 && (
      <div className="recommendation-badges">
        {badges.slice(0, 4).map((badge, index) => (
          <span key={index} className="badge">{badge}</span>
        ))}
      </div>
    )}
    <div className="recommendation-link">
      View Recommendation <FiExternalLink />
    </div>
  </div>
)

