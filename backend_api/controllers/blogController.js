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
  body("text").notEmpty().withMessage(`Text: ${emptyErr}`).isLength({ min: 8 }),
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
const putFormPost = [
  validatePost,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).json({
        errors: errors.array(),
      })
    }

    let text = req.body.text
    let title = req.body.title

    let { postId } = req.params
    await db.putPost(postId, title, text)

    res.json({
      message: `The post with id postId: ${postId} will be updated`,
    })
  },
]
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
