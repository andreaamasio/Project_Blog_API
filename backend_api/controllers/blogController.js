const db = require("../../db/queries")
const getPosts = (req, res) => {
  // Render the page with posts
  res.json({ posts: "list of posts" })
}
module.exports = { getPosts }
