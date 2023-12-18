const nodemailer = require("nodemailer")
const { mailPass, mailUser } = require("./constants")

module.exports.transporter = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 465,
    secure: true,
    auth : {
        user : mailUser,
        pass : mailPass
    }
})