const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const sql = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/passwords");
const { signToken, signRefreshToken, signForgotToken, verifyToken } = require("../utils/token");
const sendMail = require("../utils/mailer");
const createAdmin = (req, res) => {};

const register = AsyncHandler(async (req, res) => {
  try {
    const { email, firstName, lastName, password, dateOfBirth } = req.body;
    if (!email || !firstName || !lastName || !password || !dateOfBirth) {
      return res.status(400).json({
        status: 400,
        message: "invalid input",
      });
    }
    const user = await sql`SELECT * from user_table WHERE email = ${email} `;
    if (user.length < 1) {
      // console.log("im here")
      const hashedPassword = await hashPassword(password);
      // console.log(hashedPassword)
      const user = await sql`INSERT INTO user_table 
            (firstname,lastname,email,user_password,dateofbirth) 
        VALUES 
        (${firstName},${lastName},${email},${hashedPassword},${dateOfBirth})
        returning firstname, lastname,email,user_password,dateofbirth`;
      return res.status(201).json({
        user,
      });
    } else {
      return res.status(401).json({
        message: "User already exists",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

const login = AsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "invalid input",
      });
    }
    // The above code checks if an email and password has been entered and the fields aren't empty
    const fetchUser =
      await sql`SELECT * from user_table WHERE email = ${email}`;
    const user = fetchUser[0];
    if (user) {
      const passCheck = await comparePassword(user.user_password, password);
      if (passCheck) {
        const accessToken = signToken(user.user_id);
        const refreshToken = signRefreshToken(user.user_id);

        await sql`UPDATE user_table SET refresh_token = ${refreshToken} WHERE user_id = ${user.user_id}`;
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
          user: { ...user, refresh_token: null },
          token: accessToken,
        });
      } else {
        return res.status(401).json({
          status: 401,
          message: "Password incorrect",
        });
      }
    } else {
      return res.status(401).json({
        status: 401,
        message: "User doesn't exist",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

const forgotPassword = AsyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: 400,
        message: "invalid input",
      });
    }
    const fetchUser =
      await sql`SELECT * from user_table WHERE email = ${email}`;
    const user = fetchUser[0];
    if (user) {
      let subject = `Forgot Password`;
      let token = signForgotToken(email)
      let html = `<p>Hello ${user.firstname}<p>
      <p>Please click the <a href="http://localhost:3000/auth/verify-user/${token}">link<a/> to reset your password<p/>`;

      const response = await sendMail(email, subject, html);

      return res.status(200).json({
        message: "Email successfully sent",
        response,
      });
    } else {
      return res.status(401).json({
        status: 401,
        message: "User doesn't exist",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

const verifyUser = AsyncHandler(async(req, res,next)=>{
try {
  const {token} = req.params
  console.log(token)
} catch (error) {
  return res.status(500).json({
    error,
  });
}
})

module.exports = {
  register,
  login,
  forgotPassword,
  verifyUser
};
