import React from "react"

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <h1 className="text-xl font-bold">My Blog</h1>
      <div>
        {user && (
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
