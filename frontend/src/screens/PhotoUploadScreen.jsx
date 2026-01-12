import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUpload, FiCamera, FiImage } from 'react-icons/fi'
import './PhotoUploadScreen.css'

export default function PhotoUploadScreen() {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleUpload = () => {
    if (selectedImage) {
      // Store image in sessionStorage for the analyzing screen
      sessionStorage.setItem('uploadedImage', preview)
      sessionStorage.setItem('uploadedImageFile', JSON.stringify({
        name: selectedImage.name,
        type: selectedImage.type,
        size: selectedImage.size
      }))
      navigate('/analyzing', { state: { image: selectedImage } })
    }
  }

  const handleTakePhoto = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="upload-screen">
      <div className="screen-container">
        <div className="screen-content">
          <h1 className="screen-title">✨ BeautyApp</h1>
          <p className="screen-subtitle">
            Upload a photo or take a selfie to get personalized beauty recommendations
            for skincare, makeup, and outfits
          </p>

          <div className="card">
            {preview ? (
              <div className="image-preview-container">
                <img src={preview} alt="Preview" className="image-preview" />
                <div className="button-group">
                  <button className="btn btn-primary" onClick={handleUpload}>
                    <FiUpload /> Analyze Photo
                  </button>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => {
                      setSelectedImage(null)
                      setPreview(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                  >
                    Choose Different Photo
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`upload-area ${isDragging ? 'dragover' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiImage className="upload-icon" />
                  <div className="upload-text">Drag & Drop your photo here</div>
                  <div className="upload-hint">or click to browse</div>
                </div>

                <div className="button-group">
                  <button className="btn btn-primary" onClick={handleTakePhoto}>
                    <FiCamera /> Take Photo
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiUpload /> Upload from Device
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden-input"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


