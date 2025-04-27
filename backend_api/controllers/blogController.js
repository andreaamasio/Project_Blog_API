const { body, validationResult } = require("express-validator")
const emptyErr = "cannot be empty."
const db = require("../../db/queries")

const getPosts = async (req, res) => {
  let posts = await db.getAllPosts()

  res.json({
    posts: posts,
  })
}

const getFormPost = (req, res) => {
  res.json({ message: "this is the view for creating a new post" })
}
const validatePost = [
  body("title").trim().notEmpty().withMessage(`Title: ${emptyErr}`),
  body("text").notEmpty().withMessage(`Text: ${emptyErr}`).isLength({ min: 1 }),
]
const postFormPost = [
  validatePost,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).json({
        errors: errors.array(),
      })
    }

    let title = req.body.title
    let text = req.body.text
    let is_published = req.body.is_published

    console.log(`title:${title}`)
    console.log(`text:${text}`)
    console.log(`is_published:${is_published}`)
    await db.postNewPost(title, text, is_published)

    res.json({
      message: `The post with title ${title} and text " ${text} ", is_published: ${is_published} will be registered with prisma`,
    })
  },
]

const putFormPost = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log("errors found")
    return res.status(400).json({ errors: errors.array() })
  }

  const { text, title, is_published } = req.body // Get is_published from request
  const { postId } = req.params

  try {
    const updatedPost = await db.putPost(postId, title, text, is_published) // Pass is_published to db.putPost

    if (updatedPost) {
      res.json(updatedPost) // Send the updated post object back
    } else {
      res.status(404).json({ message: "Post not found" }) // Handle case where post doesn't exist
    }
  } catch (error) {
    console.error("Error updating post:", error)
    res.status(500).json({ message: "Failed to update post" }) // Handle database errors
  }
}

const deletePost = async (req, res) => {
  let { postId } = req.params

  await db.deletePost(postId)

  res.json({
    message: `The post with id postId: ${postId} will be deleted`,
  })
}
module.exports = {
  getPosts,
  getFormPost,
  postFormPost,
  putFormPost,
  deletePost,
}
