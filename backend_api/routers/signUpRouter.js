const { Router } = require("express")
const express = require("express")

const signUpController = require("../controllers/signUpController")
const signUpRouter = Router()
signUpRouter.use(express.urlencoded({ extended: true }))

signUpRouter.get("/", signUpController.getSignUp)
signUpRouter.post("/", signUpController.postSignUp)

module.exports = signUpRouter
