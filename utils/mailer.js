const { mailUser } = require("../config/constants");
const { transporter } = require("../config/mailConfig");

const sendMail = async(email, subject, html)=>{
    try {
        const info = await transporter.sendMail({
            from: mailUser, // sender address
            to: email, // list of receivers
            subject, // Subject line
            html, // html body
          }); 
          return info.response
    } catch (error) {
        console.log(error)
    }
}

module.exports = sendMail