import { useState, useEffect } from 'react'
import './App.css'
import UploadModal from './components/UploadModal'
import GalleryGrid from './components/GalleryGrid'
import Header from './components/Header'

function App() {
  const [uploads, setUploads] = useState([])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Load uploads from localStorage on component mount
  useEffect(() => {
    const savedUploads = localStorage.getItem('everlynGalleryUploads')
    if (savedUploads) {
      setUploads(JSON.parse(savedUploads))
    }
  }, [])

  // Save uploads to localStorage whenever uploads change
  useEffect(() => {
    localStorage.setItem('everlynGalleryUploads', JSON.stringify(uploads))
  }, [uploads])

  const handleNewUpload = (newUpload) => {
    const upload = {
      ...newUpload,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString(),
      comments: []
    }
    setUploads(prevUploads => [upload, ...prevUploads])
    setIsUploadModalOpen(false)
  }

  const handleNewComment = (uploadId, comment) => {
    setUploads(prevUploads => 
      prevUploads.map(upload => 
        upload.id === uploadId 
          ? { 
              ...upload, 
              comments: [...upload.comments, {
                id: Date.now().toString(),
                username: comment.username,
                text: comment.text,
                timestamp: new Date().toISOString()
              }]
            }
          : upload
      )
    )
  }

  return (
    <div className="app">
      <Header onUploadClick={() => setIsUploadModalOpen(true)} />
      <main className="main-content">
        <GalleryGrid uploads={uploads} onNewComment={handleNewComment} />
      </main>
      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleNewUpload}
        />
      )}
    </div>
  )
}

export default App
