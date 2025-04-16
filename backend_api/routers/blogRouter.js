const { Router } = require("express")
const express = require("express")
const blogController = require("../controllers/blogController")
const userController = require("../controllers/userController")
const blogRouter = Router()
blogRouter.use(express.urlencoded({ extended: true }))

blogRouter.get("/", blogController.getPosts)
//blogRouter.get("/post/:postId", blogController.getPost)
blogRouter.post(
  "/post/:postId",
  userController.authenticateToken,
  userController.authorizeAdmin,
  blogController.postFormPost
)
blogRouter.put(
  "/post/:postId",
  userController.authenticateToken,
  userController.authorizeAdmin,
  blogController.putFormPost
)
blogRouter.delete(
  "/post/:postId",
  userController.authenticateToken,
  userController.authorizeAdmin,
  blogController.deletePost
)
// blogRouter.post("/login", blogController.loginUser)
// blogRouter.get("/logout", blogController.logoutUser)

module.exports = blogRouter
