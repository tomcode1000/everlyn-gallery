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
      try {
        const parsedUploads = JSON.parse(savedUploads)
        // Convert the data arrays back to proper format for videos
        const processedUploads = parsedUploads.map(upload => {
          if (upload.file && upload.file.data && Array.isArray(upload.file.data)) {
            return {
              ...upload,
              file: {
                ...upload.file,
                data: new Uint8Array(upload.file.data)
              }
            }
          }
          return upload
        })
        setUploads(processedUploads)
      } catch (error) {
        console.error('Error loading uploads from localStorage:', error)
        // Clear corrupted data
        localStorage.removeItem('everlynGalleryUploads')
      }
    }
  }, [])

  // Save uploads to localStorage whenever uploads change
  useEffect(() => {
    try {
      // Convert Uint8Array data back to regular arrays for JSON serialization
      const serializedUploads = uploads.map(upload => {
        if (upload.file && upload.file.data && upload.file.data instanceof Uint8Array) {
          return {
            ...upload,
            file: {
              ...upload.file,
              data: Array.from(upload.file.data)
            }
          }
        }
        return upload
      })
      localStorage.setItem('everlynGalleryUploads', JSON.stringify(serializedUploads))
    } catch (error) {
      console.error('Error saving uploads to localStorage:', error)
    }
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
