import React from 'react'

const Header = ({ onUploadClick }) => {
  return (
    <header className="header">
      <div className="header-left">
        {/* Replace the text-logo with img tag below when logo file is available */}
        {/* <img src="/everlyn-logo.jpg" alt="Everlyn AI Logo" className="logo" /> */}
        <div className="text-logo">EVERLYN</div>
        <div>
          <h1 className="header-title">Everlyn Gallery</h1>
          <p className="header-subtitle">Community creations powered by Everlyn AI</p>
        </div>
      </div>
      <button 
        className="upload-btn"
        onClick={onUploadClick}
      >
        📤 Share Your Creation
      </button>
    </header>
  )
}

export default Header