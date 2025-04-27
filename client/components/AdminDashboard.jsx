import React, { useEffect, useState } from "react"

const API_URL = "http://localhost:3000"

const AdminDashboard = ({ token }) => {
  const [posts, setPosts] = useState([])
  const [editPostId, setEditPostId] = useState(null)
  const [editData, setEditData] = useState({ title: "", text: "" })
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
    fetch(`${API_URL}/blog`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
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
    setEditData({ title: post.title, text: post.text })
  }

  const handleCancelEdit = () => {
    setEditPostId(null)
    setEditData({ title: "", text: "" })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    console.log("Editing post with ID:", editPostId)
    console.log("Edit data:", editData)

    const res = await fetch(`${API_URL}/blog/post/${editPostId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    })

    if (res.ok) {
      const updatedPost = await res.json()
      console.log("Updated Post from API:", updatedPost)
      console.log("Before update:", [...posts])
      const newPosts = posts.map((post) => {
        if (post.id === editPostId) {
          return { ...updatedPost } // If the API returns the complete updated post
        } else {
          return { ...post }
        }
      })
      console.log("After update:", newPosts)
      setPosts(newPosts)
      setEditPostId(null)
      setEditData({ title: "", text: "" })
    } else {
      alert("Failed to update post")
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
          <div key={post.id} className="border-b py-2">
            {editPostId === post.id ? (
              <form onSubmit={handleEditSubmit} className="space-y-2">
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
              <div className="py-2">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p>{post.text}</p>
                <div className="space-x-2 mt-1">
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
            )}
          </div>
        ))}
    </div>
  )
}

export default AdminDashboard
