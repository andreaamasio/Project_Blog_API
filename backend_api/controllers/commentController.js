const { body, validationResult } = require("express-validator")
const emptyErr = "cannot be empty."
const db = require("../../db/queries")
const getComments = (req, res) => {
  // Render the page with posts
  res.json({ posts: "list of comments" })
}

const getFormComment = (req, res) => {
  res.json({ message: "this is the view for creating a new comment" })
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
module.exports = { getComments, getFormComment, postFormComment }
