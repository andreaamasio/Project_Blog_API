import React, { useState } from "react"
import loginUser from "../loginUser"

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const data = await loginUser(email, password)
      onLogin(data.user, data.accessToken)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 p-4 shadow-md border rounded"
    >
      <h2 className="text-lg font-semibold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <label className="block mb-2">
        <span>Email</span>
        <input
          type="email"
          className="w-full border px-2 py-1 mt-1 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="block mb-4">
        <span>Password</span>
        <input
          type="password"
          className="w-full border px-2 py-1 mt-1 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  )
}

export default LoginForm
