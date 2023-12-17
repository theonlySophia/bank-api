const express = require('express')
const { register, login } = require('../controllers/authController')

const authRouter = express.Router()

// authRouter.get("/admin", )

authRouter.route("/users").post(register)
authRouter.route("/users/login").post(login)

module.exports = authRouter
