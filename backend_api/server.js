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
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend port
    credentials: true,
  })
)
app.use("/blog", blogRouter)
app.use("/comment", commentRouter)
app.use("/user", userRouter)
app.listen(3000, () => console.log("Server listening on port 3000!"))
