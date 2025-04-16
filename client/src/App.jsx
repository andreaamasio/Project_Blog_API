import React, { useEffect, useState } from "react"
import Navbar from "../components/NavBar"
import AdminDashboard from "../components/AdminDashboard"
import UserDashboard from "../components/UserDashboard"
import RegisterForm from "../components/RegisterForm"
import LoginForm from "../components/LoginForm"

import loginUser from "../loginUser"

const App = () => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetch("http://localhost:3000/user/check-auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token")
          return res.json()
        })
        .then((data) => {
          setUser(data.user)
          setToken(token)
        })
        .catch(() => {
          setUser(null)
          setToken(null)
          localStorage.removeItem("token")
        })
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }
  return (
    <div>
      {successMessage && (
        <p className="text-center mt-4 text-green-600">{successMessage}</p>
      )}
      <Navbar user={user} onLogout={handleLogout} />
      {user ? (
        user.is_admin ? (
          <AdminDashboard token={token} />
        ) : (
          <UserDashboard token={token} />
        )
      ) : showRegister ? (
        <>
          <RegisterForm onSuccess={() => setShowRegister(false)} />
          <p className="text-center mt-2">
            Already have an account?{" "}
            <button
              className="text-blue-600 underline"
              onClick={() => setShowRegister(false)}
            >
              Log in
            </button>
          </p>
        </>
      ) : (
        <>
          <LoginForm
            onLogin={(userData, accessToken) => {
              console.log("✅ Logged in as:", userData)
              console.log("🔐 Token:", accessToken)
              setSuccessMessage(`Welcome back, ${userData.email}`)
              setUser(userData)
              setToken(accessToken)
              localStorage.setItem("token", accessToken)
              localStorage.setItem("user", JSON.stringify(userData))
            }}
          />
          <p className="text-center mt-2">
            Don't have an account?{" "}
            <button
              className="text-blue-600 underline"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </p>
        </>
      )}
    </div>
  )
}

export default App
