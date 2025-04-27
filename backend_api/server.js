require("dotenv").config()
const cors = require("cors")
const express = require("express")
const jwt = require("jsonwebtoken")
const blogRouter = require("./routers/blogRouter")
const userRouter = require("./routers/userRouter")
const commentRouter = require("./routers/commentRouter")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Use a function to dynamically set the origin based on environment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from your Netlify domain and localhost
    const allowedOrigins = [
      "http://localhost:5173", // For local development with Vite
      "https://blogapiofandrea.netlify.app", // Netlify domain
    ]
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, { origin: true, credentials: true })
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.use("/blog", blogRouter)
app.use("/comment", commentRouter)
app.use("/user", userRouter)
app.use("/", (req, res) => {
  res.json({
    message: "Welcome to the blog API!",
  })
})
const port = process.env.PORT || 3000 // Use process.env.PORT for Render
app.listen(port, () => console.log(`Server listening on port ${port}!`))
