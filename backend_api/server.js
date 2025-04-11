require("dotenv").config()
const express = require("express")
const jwt = require("jsonwebtoken")
const app = express()
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the blog API",
  })
})
app.listen(3000, () => console.log("Server listening on port 3000!"))
