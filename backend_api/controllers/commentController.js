const { body, validationResult } = require("express-validator")
const emptyErr = "cannot be empty."
const db = require("../../db/queries")
const getComments = async (req, res) => {
  let postId = req.params.postId
  let comments = await db.getCommentsOfPost(postId)

  res.json({
    comments: comments,
  })
}

const getFormComment = async (req, res) => {
  let userId = req.user.id
  const comments = await db.getAllComments(userId)
  res.json({ comments })
}
const validateComment = [
  body("text").notEmpty().withMessage(`Text: ${emptyErr}`).isLength({ min: 8 }),
]
const postFormComment = [
  validateComment,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).json({
        errors: errors.array(),
      })
    }

    let text = req.body.text

    let createdById = req.user.id
    let { postId } = req.params

    console.log(`text:${text}`)

    await db.postNewComment(text, createdById, postId)

    res.json({
      message: `The comment with text ${text}is published in postId: ${postId} will be registered with prisma`,
    })
  },
]
const putFormComment = [
  validateComment,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).json({
        errors: errors.array(),
      })
    }
    let { commentId } = req.params
    const comment = await db.findCommentById(commentId)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    if (comment.createdById !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only edit your own comments" })
    }
    let text = req.body.text

    await db.putComment(commentId, text)

    res.json({
      message: `The comment with id postId: ${commentId} will be updated`,
    })
  },
]
const deleteComment = async (req, res) => {
  let { commentId } = req.params
  const comment = await db.findCommentById(commentId)

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" })
  }

  if (comment.createdById !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You can only delete your own comments" })
  }
  await db.deleteComment(commentId)

  res.json({
    message: `The comment with id commentId: ${commentId} will be deleted`,
  })
}
const getCommentCountByPostId = async (req, res) => {
  const { postId } = req.params
  try {
    const count = await db.getCommentCountByPostId(postId) // Replace with your actual database query
    res.json({ count })
  } catch (error) {
    console.error("Error fetching comment count:", error)
    res.status(500).json({ message: "Failed to fetch comment count" })
  }
}
module.exports = {
  getComments,
  getFormComment,
  postFormComment,
  putFormComment,
  deleteComment,
  getCommentCountByPostId,
}
