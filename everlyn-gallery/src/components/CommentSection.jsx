import React, { useState } from 'react'

const CommentSection = ({ comments, onNewComment }) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [username, setUsername] = useState('')
  const [showCommentForm, setShowCommentForm] = useState(false)

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!username.trim() || !newComment.trim()) {
      alert('Please enter both username and comment')
      return
    }

    onNewComment({
      username: username.trim(),
      text: newComment.trim()
    })

    setNewComment('')
    setUsername('')
    setShowCommentForm(false)
  }

  return (
    <div className="comment-section">
      <div className="comment-header">
        <button 
          className="comment-toggle"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </button>
        <button 
          className="add-comment-btn"
          onClick={() => setShowCommentForm(!showCommentForm)}
        >
          ➕ Add Comment
        </button>
      </div>

      {showCommentForm && (
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <input
            type="text"
            placeholder="Your Twitter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="comment-username-input"
            required
          />
          <textarea
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input"
            rows={3}
            required
          />
          <div className="comment-form-actions">
            <button type="submit" className="submit-comment-btn">
              Post Comment
            </button>
            <button 
              type="button" 
              className="cancel-comment-btn"
              onClick={() => {
                setShowCommentForm(false)
                setNewComment('')
                setUsername('')
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {showComments && (
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header-info">
                  <span className="comment-username">@{comment.username}</span>
                  <span className="comment-date">{formatCommentDate(comment.timestamp)}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default CommentSection