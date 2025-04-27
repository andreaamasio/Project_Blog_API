import React, { useEffect, useState } from "react"

const API_URL = "http://localhost:3000"

const AdminDashboard = ({ token }) => {
  const [posts, setPosts] = useState([])
  const [editPostId, setEditPostId] = useState(null)
  const [editData, setEditData] = useState({
    title: "",
    text: "",
    is_published: false,
  }) // Include is_published
  const [newPost, setNewPost] = useState({
    title: "",
    text: "",
    is_published: false,
  })

  const fetchPosts = async () => {
    const res = await fetch(`${API_URL}/blog`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    setPosts(data.posts || [])
  }
  useEffect(() => {
    fetchPosts()
  }, [token])

  const handleDeletePost = async (postId) => {
    const confirm = window.confirm("Delete this post?")
    if (!confirm) return

    const res = await fetch(`${API_URL}/blog/post/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.ok) {
      setPosts((prev) => prev.filter((post) => post.id !== postId))
    } else {
      alert("Failed to delete post")
    }
  }

  const handleEditClick = (post) => {
    setEditPostId(post.id)
    setEditData({
      title: post.title,
      text: post.text,
      is_published: post.is_published,
    }) // Include is_published
  }

  const handleCancelEdit = () => {
    setEditPostId(null)
    setEditData({ title: "", text: "", is_published: false }) // Reset is_published
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch(`${API_URL}/blog/post/${editPostId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData), // Send the editData
    })

    if (res.ok) {
      const updatedPost = await res.json()
      const newPosts = posts.map((post) => {
        if (post.id === editPostId) {
          return { ...updatedPost }
        } else {
          return { ...post }
        }
      })
      setPosts(newPosts)
      setEditPostId(null)
      setEditData({ title: "", text: "", is_published: false })
    } else {
      alert("Failed to update post")
    }
  }

  const handleTogglePublish = async (postId, currentIsPublished) => {
    const res = await fetch(`${API_URL}/blog/post/${postId}`, {
      method: "PUT", //  use PUT
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_published: !currentIsPublished }), // Send the opposite value
    })

    if (res.ok) {
      const updatedPost = await res.json() //get the updated post
      const newPosts = posts.map((post) =>
        post.id === postId
          ? { ...post, is_published: updatedPost.is_published }
          : post
      )
      setPosts(newPosts)
    } else {
      alert("Failed to toggle publish status")
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>
      <div className="border p-4 rounded mb-6">
        <h3 className="text-lg font-semibold mb-2">Create New Post</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const res = await fetch(`${API_URL}/blog/post`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(newPost),
            })

            if (res.ok) {
              const createdPost = await res.json()
              setPosts((prev) => [...prev, createdPost])
              setNewPost({ title: "", text: "", is_published: false })
              await fetchPosts()
            } else {
              alert("Failed to create post")
            }
          }}
          className="space-y-2"
        >
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="Title"
            className="border p-1 w-full"
            required
          />
          <textarea
            value={newPost.text}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
            placeholder="Text"
            className="border p-1 w-full"
            required
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newPost.is_published}
              onChange={(e) =>
                setNewPost({ ...newPost, is_published: e.target.checked })
              }
            />
            <span>Publish</span>
          </label>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Create Post
          </button>
        </form>
      </div>

      {posts
        .filter((post) => post.id)
        .map((post) => (
          <div
            key={post.id}
            className="border-b py-2 flex items-center justify-between"
          >
            {editPostId === post.id ? (
              <form
                onSubmit={handleEditSubmit}
                className="space-y-2 flex-1 mr-4"
              >
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="border p-1 w-full"
                />
                <textarea
                  value={editData.text}
                  onChange={(e) =>
                    setEditData({ ...editData, text: e.target.value })
                  }
                  className="border p-1 w-full"
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editData.is_published}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        is_published: e.target.checked,
                      })
                    }
                  />
                  <span>Publish</span>
                </label>
                <div className="space-x-2">
                  <button
                    type="submit"
                    className="px-2 py-1 bg-green-600 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-gray-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1 mr-4 py-2">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p>{post.text}</p>
                <p>Published: {post.is_published ? "Yes" : "No"}</p>
              </div>
            )}
            <div className="space-x-2 flex-shrink-0">
              <button
                onClick={() => handleTogglePublish(post.id, post.is_published)}
                className="text-purple-600 underline"
              >
                {post.is_published ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => handleEditClick(post)}
                className="text-blue-600 underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeletePost(post.id)}
                className="text-red-600 underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default AdminDashboard
