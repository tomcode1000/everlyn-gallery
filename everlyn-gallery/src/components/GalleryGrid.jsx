import React, { useState, useRef, useEffect } from 'react'
import CommentSection from './CommentSection'

const GalleryGrid = ({ uploads, onNewComment }) => {
  const videoRefs = useRef({})
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileType = (file) => {
    if (file.type.startsWith('video/')) return '🎥 VIDEO'
    if (file.type.startsWith('image/')) return '🖼️ IMAGE'
    return '📁 FILE'
  }

  if (uploads.length === 0) {
    return (
      <div className="empty-state">
        <h2>🎨 Welcome to Everlyn Gallery</h2>
        <p>Be the first to share your amazing AI creations with the community!</p>
        <p>Upload your videos and images made with Everlyn AI to inspire others.</p>
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8 }}>
          <p>💡 Supported formats: JPEG, PNG, GIF, WebP, MP4, WebM, OGG</p>
          <p>📏 Maximum file size: 50MB</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gallery-grid">
      {uploads.map((upload) => (
        <div key={upload.id} className="gallery-item">
          <div className="media-container">
            <div className="file-type">{getFileType(upload.file)}</div>
            {upload.file.type.startsWith('video/') ? (
              <VideoPlayer 
                key={upload.id}
                upload={upload}
                ref={el => videoRefs.current[upload.id] = el}
              />
            ) : (
              <img 
                src={upload.file.url} 
                alt={`Creation by ${upload.username}`}
              />
            )}
          </div>
          <div className="item-info">
            <div className="username">👤 {upload.username}</div>
            <div className="upload-date">📅 {formatDate(upload.uploadDate)}</div>
          </div>
          <CommentSection 
            comments={upload.comments || []}
            onNewComment={(comment) => onNewComment(upload.id, comment)}
          />
        </div>
      ))}
    </div>
  )
}

// Video Player Component
const VideoPlayer = React.forwardRef(({ upload }, ref) => {
  const videoRef = useRef(null)
  const [videoSrc, setVideoSrc] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Create a fresh blob URL when component mounts or upload changes
    if (upload.file.data) {
      try {
        const blob = new Blob([upload.file.data], { type: upload.file.type })
        const url = URL.createObjectURL(blob)
        setVideoSrc(url)
        setError(false)
        
        // Cleanup function to revoke the blob URL
        return () => {
          URL.revokeObjectURL(url)
        }
      } catch (err) {
        console.error('Error creating video blob:', err)
        setError(true)
      }
    } else if (upload.file.url && !upload.file.url.startsWith('blob:')) {
      // For non-blob URLs (like when data is already a URL)
      setVideoSrc(upload.file.url)
    } else {
      setError(true)
    }
  }, [upload])

  const handleVideoError = () => {
    console.error('Video playback error for:', upload.file.name)
    setError(true)
  }

  const handleLoadedData = () => {
    if (videoRef.current) {
      // Reset video to beginning and ensure it's ready to play
      videoRef.current.currentTime = 0
    }
  }

  const handleCanPlay = () => {
    setError(false)
  }

  React.useImperativeHandle(ref, () => ({
    reset: () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.load() // Reload the video element
      }
    },
    play: () => {
      if (videoRef.current) {
        videoRef.current.play()
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }))

  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: '#f8f9fa',
        color: '#666',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div>🎥</div>
        <div style={{ fontSize: '0.9rem', textAlign: 'center' }}>
          Video unavailable<br />
          <small>{upload.file.name}</small>
        </div>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      src={videoSrc}
      controls
      preload="metadata"
      onError={handleVideoError}
      onLoadedData={handleLoadedData}
      onCanPlay={handleCanPlay}
      style={{ width: '100%', height: '100%' }}
      poster={upload.file.thumbnail}
    >
      <source src={videoSrc} type={upload.file.type} />
      Your browser does not support the video tag.
    </video>
  )
})

VideoPlayer.displayName = 'VideoPlayer'

export default GalleryGrid