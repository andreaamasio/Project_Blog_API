const { Router } = require("express")
const express = require("express")
const blogController = require("../controllers/blogController")
const userController = require("../controllers/userController")
const blogRouter = Router()
blogRouter.use(express.urlencoded({ extended: true }))

blogRouter.get("/", blogController.getPosts)
//blogRouter.get("/post/:postId", blogController.getPost)
blogRouter.post(
  "/post",
  userController.authenticateToken,
  blogController.postFormPost
)
// blogRouter.post("/login", blogController.loginUser)
// blogRouter.get("/logout", blogController.logoutUser)

module.exports = blogRouter
