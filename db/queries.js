const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      console.log(`User found: ${email}`)
    } else {
      console.log(`User not found: ${email}`)
    }

    return user
  } catch (error) {
    console.error(`Error finding user by email (${email}):`, error)
    throw error
  }
}

async function findUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (user) {
      console.log(`User found by ID: ${id}`)
    } else {
      console.log(`User not found by ID: ${id}`)
    }

    return user
  } catch (error) {
    console.error(`Error finding user by ID (${id}):`, error)
    throw error
  }
}
async function postNewUser(email, hashedPassword) {
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    console.log(`User successfully created: ${email}`)
    return newUser
  } catch (error) {
    console.error(`Error creating new user (${email}):`, error)
    throw error
  }
}
async function postNewPost(title, text) {
  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        text,
      },
    })

    console.log(`Post successfully created: ${title}`)
    return newPost
  } catch (error) {
    console.error(`Error creating new post (${title}):`, error)
    throw error
  }
}
async function getAllComments(userId) {
  try {
    const comments = await prisma.comment.findMany()

    console.log(`Comment of userId: ${userId}: ${comments}`)
    return comments
  } catch (error) {
    console.error(`Error fetching comments`, error)
    throw error
  }
}
async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany()

    console.log(`Posts: ${posts}`)
    return posts
  } catch (error) {
    console.error(`Error fetching posts`, error)
    throw error
  }
}
async function postNewComment(text, createdById, postId) {
  try {
    const newComment = await prisma.comment.create({
      data: {
        text,
        createdById,
        postId,
      },
    })

    console.log(`Comment successfully created: ${text}`)
    return newComment
  } catch (error) {
    console.error(`Error creating new comment (${text}):`, error)
    throw error
  }
}
async function putComment(postId, newText) {
  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: postId,
      },
      data: {
        text: newText,
      },
    })

    console.log(`Comment successfully updated with new text: ${newText}`)
    return updatedComment
  } catch (error) {
    console.error(`Error creating updating comment (${newText}):`, error)
    throw error
  }
}
async function deleteComment(postId) {
  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: postId,
      },
    })

    console.log(`Comment postId: ${postId}`)
    return deletedComment
  } catch (error) {
    console.error(`Error creating updating comment (${text}):`, error)
    throw error
  }
}
async function findCommentById(id) {
  return await prisma.comment.findUnique({ where: { id } })
}
module.exports = {
  findUserByEmail,
  findUserById,
  postNewUser,
  postNewPost,
  postNewComment,
  putComment,
  deleteComment,
  getAllComments,
  findCommentById,
  getAllPosts,
}
