const express = require('express')
const { register } = require('../controllers/authController')

const authRouter = express.Router()

// authRouter.get("/admin", )

authRouter.route("/users").post(register)

module.exports = authRouter
