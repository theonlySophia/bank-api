const AsyncHandler = require("express-async-handler")
const sql = require("../config/db")
const { hashPassword } = require("../utils/passwords")

const createAdmin = (req, res)=>{
   
}

const register = AsyncHandler(async(req, res)=>{
  try {
      const {email, firstName, lastName, password, dateOfBirth} = req.body
    if(!email || !firstName || !lastName || !password || !dateOfBirth){
        return res.status(400).json({
            status : 400,
            message : "invalid input"
        })
    }
    const user = await sql`SELECT * from user_table WHERE email = ${email} `
    if(user.length < 1){
        // console.log("im here")
        const hashedPassword = await hashPassword(password)
        // console.log(hashedPassword)
        const user = await sql`INSERT INTO user_table 
            (firstname,lastname,email,user_password,dateofbirth) 
        VALUES 
        (${firstName},${lastName},${email},${hashedPassword},${dateOfBirth})
        returning firstname, lastname,email,user_password,dateofbirth`
        return res.status(201).json({
            user
        })
    }else{
        return res.status(401).json({
            message : "User already exists"
        })
    }
  } catch (error) {
    return res.status(500).json({
        error
    })
  }
})


module.exports = {
    register
}