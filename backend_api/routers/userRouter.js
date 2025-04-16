const { Router } = require("express")
const express = require("express")

const userController = require("../controllers/userController")
const userRouter = Router()

userRouter.get("/sign-up", userController.getSignUp)
userRouter.post("/sign-up", userController.postSignUp)
userRouter.get("/login", userController.getLogin)
userRouter.post("/login", userController.postLogin)
userRouter.get("/login/admin", userController.getLoginAdmin)
userRouter.post("/login/admin", userController.postLoginAdmin)
userRouter.get("/check-auth", userController.authenticateToken, (req, res) => {
  res.json({ user: req.user })
})

module.exports = userRouter
