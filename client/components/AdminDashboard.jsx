import React, { useEffect, useState } from "react"

const AdminDashboard = ({ token }) => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch("/api/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []))
  }, [token])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>
      {posts.map((post) => (
        <div key={post.id} className="border-b py-2">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p>{post.text}</p>
        </div>
      ))}
    </div>
  )
}

export default AdminDashboard
