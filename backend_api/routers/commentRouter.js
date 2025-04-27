const { Router } = require("express")
const express = require("express")
const commentController = require("../controllers/commentController")
const userController = require("../controllers/userController")
const commentRouter = Router()
commentRouter.use(express.urlencoded({ extended: true }))

commentRouter.get("/:postId", commentController.getComments)
//blogRouter.get("/post/:postId", blogController.getPost)
commentRouter.post(
  "/:postId",
  userController.authenticateToken,
  commentController.postFormComment
)
commentRouter.put(
  "/:commentId",
  userController.authenticateToken,
  commentController.putFormComment
)
commentRouter.delete(
  "/:commentId",
  userController.authenticateToken,
  commentController.deleteComment
)

// blogRouter.post("/login", blogController.loginUser)
// blogRouter.get("/logout", blogController.logoutUser)

module.exports = commentRouter
