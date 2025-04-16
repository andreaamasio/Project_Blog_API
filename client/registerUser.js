// /client/registerUser.js

export default async function registerUser(email, password) {
  const response = await fetch("http://localhost:3000/user/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ email, password }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data?.errors?.[0]?.msg || "Registration failed")
  }

  return response.json()
}
