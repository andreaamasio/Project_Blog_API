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
async function postNewComment(text, createdById, postId) {
  try {
    const newPost = await prisma.comment.create({
      data: {
        text,
        createdById,
        postId,
      },
    })

    console.log(`Comment successfully created: ${text}`)
    return newPost
  } catch (error) {
    console.error(`Error creating new comment (${text}):`, error)
    throw error
  }
}
module.exports = {
  findUserByEmail,
  findUserById,
  postNewUser,
  postNewPost,
  postNewComment,
}
