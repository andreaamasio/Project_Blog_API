require("dotenv").config()
const express = require("express")
const jwt = require("jsonwebtoken")
const blogRouter = require("./routers/blogRouter")
const app = express()
app.use(express.json())

app.use("/", blogRouter)
app.listen(3000, () => console.log("Server listening on port 3000!"))
