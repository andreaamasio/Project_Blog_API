const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const db = require("../../db/queries")
const jwt = require("jsonwebtoken")

const emptyErr = "cannot be empty."
const validateUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email: ${emptyErr}`)
    .isEmail()
    .withMessage(`Email: Please use a valid email address`)
    .normalizeEmail({ gmail_remove_dots: false })
    .custom(async (value) => {
      const existingUser = await db.findUserByEmail(value)
      if (existingUser) {
        throw new Error("Email already exists. Please choose another one.")
      }
    }),

  body("password")
    .notEmpty()
    .withMessage(`Password: ${emptyErr}`)
    .isLength({ min: 8 })
    .withMessage(`Password: Minimum 8 characters`)
    .matches(/[A-Z]/)
    .withMessage(`Password: Must contain at least one uppercase letter`)
    .matches(/[0-9]/)
    .withMessage(`Password: Must contain at least one number`)
    .matches(/[\W_]/)
    .withMessage(
      `Password: Must contain at least one special character (!@#$%^&*)`
    ),
]

const getSignUp = (req, res) => {
  res.json({ message: "this is the sign-up route" })
}
const postSignUp = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).json({
        errors: errors.array(),
      })
    }

    let email = req.body.email
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    console.log(`email:${email}`)
    console.log(`hashedPassword:${hashedPassword}`)

    await db.postNewUser(email, hashedPassword)

    res.json({
      message: `The user with email ${email} and password ${req.body.password}, hashed: ${hashedPassword} will be registered with prisma`,
    })
  },
]
const getLoginAdmin = (req, res) => {
  res.json({ message: "this is the login route for the admin" })
}
const postLoginAdmin = async (req, res) => {
  const user = await db.findUserByEmail(req.body.email)
  if (!user)
    res.json({
      message: "the user does not exist in database, sign up first",
    })
  if (!user.is_admin) res.status(403).send("Forbidden, not an admin")
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      })
      res.json({
        message: `Hi ${user.email}, you successfully logged in.`,
        accessToken,
      })
    } else {
      res.json({
        message: "the password did not match",
      })
    }
  } catch {
    res.json({
      message: "comparison of password was not successful",
    })
  }
}
const getLogin = (req, res) => {
  res.json({ message: "this is the login route for the admin" })
}
const postLogin = async (req, res) => {
  const user = await db.findUserByEmail(req.body.email)
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      })
      res.json({
        message: `Hi ${user.email}, you successfully logged in.`,
        accessToken,
      })
    } else {
      res.json({
        message: "the password did not match",
      })
    }
  } catch {
    res.json({
      message: "comparison of password was not successful",
    })
  }
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403)
    }
    req.user = user
    next()
  })
}
function authorizeAdmin(req, res, next) {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: "Access denied. Admins only." })
  }
  next()
}
module.exports = {
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
  getLoginAdmin,
  postLoginAdmin,
  authenticateToken,
  authorizeAdmin,
}
