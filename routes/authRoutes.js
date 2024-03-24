const express = require('express')
const { register, login, forgotPassword, verifyUser, resetPassword } = require('../controllers/authController')

const authRouter = express.Router()

// authRouter.get("/admin", )

authRouter.route("/users").post(register)
authRouter.route("/users/login").post(login)
authRouter.route("/verify-user/:token").get(verifyUser)
authRouter.route("/users/forgotpassword").post(forgotPassword)
authRouter.route("/users/resetpassword").post(resetPassword)
module.exports = authRouter
