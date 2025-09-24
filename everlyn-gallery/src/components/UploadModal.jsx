import React, { useState } from 'react'

const UploadModal = ({ onClose, onUpload }) => {
  const [username, setUsername] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg']
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image (JPEG, PNG, GIF, WebP) or video (MP4, WebM, OGG) file.')
        return
      }
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB.')
        return
      }
      
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!username.trim()) {
      alert('Please enter your username.')
      return
    }
    
    if (!selectedFile) {
      alert('Please select a file to upload.')
      return
    }
    
    setIsUploading(true)
    
    try {
      // Create object URL for the file
      const fileUrl = URL.createObjectURL(selectedFile)
      
      // Create upload object
      const upload = {
        username: username.trim(),
        file: {
          url: fileUrl,
          type: selectedFile.type,
          name: selectedFile.name,
          size: selectedFile.size
        }
      }
      
      // Call the onUpload callback
      onUpload(upload)
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Share Your Creation</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Twitter Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Twitter username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="file">Upload Image or Video</label>
            <input
              type="file"
              id="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="file-input"
              required
            />
            {selectedFile && (
              <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : '🚀 Share with Community'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UploadModal