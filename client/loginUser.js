const loginUser = async (email, password) => {
  const response = await fetch("http://localhost:3000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const contentType = response.headers.get("content-type")

  if (!response.ok) {
    // Try parsing error as JSON if possible
    let errorMsg = "Login failed"
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      errorMsg = errorData.message || errorMsg
    } else {
      const text = await response.text()
      errorMsg = text || errorMsg
    }
    throw new Error(errorMsg)
  }

  // Still check content-type before calling .json()
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Invalid server response (not JSON)")
  }

  const data = await response.json()
  return {
    user: {
      email: data.email,
      is_admin: data.is_admin,
    },
    accessToken: data.accessToken,
  }
}

export default loginUser
