import React, { useState } from "react"
import registerUser from "../registerUser"

const RegisterForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const data = await registerUser(email, password)
      setSuccess("Account created! You can now log in.")
      onSuccess && onSuccess()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 p-4 shadow-md border rounded"
    >
      <h2 className="text-lg font-semibold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}
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
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Register
      </button>
    </form>
  )
}

export default RegisterForm
