const { Router } = require("express")
const express = require("express")
const blogController = require("../controllers/blogController")
const blogRouter = Router()
blogRouter.use(express.urlencoded({ extended: true }))

blogRouter.get("/", blogController.getPosts)
// blogRouter.post("/login", blogController.loginUser)
// blogRouter.get("/logout", blogController.logoutUser)

module.exports = blogRouter
