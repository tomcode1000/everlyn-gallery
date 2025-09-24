import React, { useState } from 'react'
import CommentSection from './CommentSection'

const GalleryGrid = ({ uploads, onNewComment }) => {
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
              <video 
                src={upload.file.url} 
                controls 
                poster={upload.file.thumbnail}
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

export default GalleryGrid