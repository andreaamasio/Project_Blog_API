import React, { useEffect, useState } from "react"

const API_URL = "http://localhost:3000" // adjust if different

const UserDashboard = ({ token, userId }) => {
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState({})
  const [newComments, setNewComments] = useState({})
  const [editCommentId, setEditCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [showComments, setShowComments] = useState({})
  const [commentCounts, setCommentCounts] = useState({}) // Add this state

  useEffect(() => {
    fetchPosts()
  }, [token])

  const fetchPosts = async () => {
    const res = await fetch(`${API_URL}/blog`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    const fetchedPosts = data.posts || []
    setPosts(fetchedPosts)

    // Fetch comment counts for each post
    fetchedPosts.forEach((post) => {
      fetchCommentCount(post.id)
    })
  }

  const fetchCommentCount = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/comment/count/${postId}`, {
        // Correct API endpoint
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setCommentCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: data.count || 0, // Ensure we have a default value
      }))
    } catch (error) {
      console.error("Failed to fetch comment count:", error)
      // Handle error, e.g., set count to 0 to avoid breaking the UI
      setCommentCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: 0,
      }))
    }
  }

  const fetchComments = async (postId) => {
    const res = await fetch(`${API_URL}/comment/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    const loadedComments = (data.comments || []).map((comment) => ({
      ...comment,
      isOwner: comment.createdById === userId,
    }))
    setComments((prev) => ({ ...prev, [postId]: loadedComments }))
  }

  const handleNewCommentChange = (postId, text) => {
    setNewComments((prev) => ({ ...prev, [postId]: text }))
  }

  const handleAddComment = async (postId) => {
    const text = newComments[postId]
    if (!text) return

    const res = await fetch(`${API_URL}/comment/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    })

    if (res.ok) {
      await fetchComments(postId)
      setNewComments((prev) => ({ ...prev, [postId]: "" }))
      setShowComments((prevShowComments) => ({
        ...prevShowComments,
        [postId]: true,
      }))
      fetchCommentCount(postId) // Update comment count
    } else {
      alert("Failed to add comment")
    }
  }

  const handleEditComment = (comment) => {
    setEditCommentId(comment.id)
    setEditCommentText(comment.text)
  }

  const handleCancelEdit = () => {
    setEditCommentId(null)
    setEditCommentText("")
  }

  const handleSaveEditComment = async (postId) => {
    const res = await fetch(`${API_URL}/comment/${editCommentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: editCommentText }),
    })

    if (res.ok) {
      await fetchComments(postId)
      handleCancelEdit()
    } else {
      alert("Failed to update comment")
    }
  }

  const handleDeleteComment = async (postId, commentId) => {
    const confirm = window.confirm("Delete this comment?")
    if (!confirm) return

    const res = await fetch(`${API_URL}/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.ok) {
      await fetchComments(postId)
      fetchCommentCount(postId) // Update comment count
    } else {
      alert("Failed to delete comment")
    }
  }

  const toggleComments = (postId) => {
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [postId]: !prevShowComments[postId],
    }))
    if (!showComments[postId]) {
      fetchComments(postId)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">User Dashboard</h2>
      {posts
        .filter((post) => post.is_published)
        .map((post) => (
          <div key={post.id} className="border-b py-4">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="mb-2">{post.text}</p>

            {commentCounts[post.id] > 0 && ( // Use commentCounts here
              <button
                onClick={() => toggleComments(post.id)}
                className="text-blue-600 underline mb-2"
              >
                {showComments[post.id] ? "Hide Comments" : "Show Comments"}
              </button>
            )}

            {showComments[post.id] && (
              <div className="space-y-2 mt-2">
                {comments[post.id] &&
                  comments[post.id].map((comment) => (
                    <div
                      key={comment.id}
                      className="border p-2 rounded bg-gray-100"
                    >
                      {editCommentId === comment.id ? (
                        <>
                          <textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="border p-1 w-full"
                          />
                          <div className="space-x-2 mt-1">
                            <button
                              onClick={() => handleSaveEditComment(post.id)}
                              className="px-2 py-1 bg-green-600 text-white rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-1 bg-gray-500 text-white rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p>{comment.text}</p>
                          {comment.isOwner && (
                            <div className="space-x-2 mt-1">
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="text-blue-600 underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteComment(post.id, comment.id)
                                }
                                className="text-red-600 underline"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="mt-4">
              <textarea
                value={newComments[post.id] || ""}
                onChange={(e) =>
                  handleNewCommentChange(post.id, e.target.value)
                }
                placeholder="Write a comment..."
                className="border p-2 w-full"
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="bg-blue-600 text-white mt-2 px-3 py-1 rounded"
              >
                Add Comment
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default UserDashboard
