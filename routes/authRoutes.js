const express = require('express')
const { register, login, forgotPassword } = require('../controllers/authController')

const authRouter = express.Router()

// authRouter.get("/admin", )

authRouter.route("/users").post(register)
authRouter.route("/users/login").post(login)
authRouter.route("/users/forgotpassword").post(forgotPassword)
module.exports = authRouter
