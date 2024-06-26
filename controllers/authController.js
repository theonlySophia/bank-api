const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const sql = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/passwords");
const {
  signToken,
  signRefreshToken,
  signForgotToken,
  verifyToken,
} = require("../utils/token");
const sendMail = require("../utils/mailer");
const createAdmin = (req, res) => {};

const register = AsyncHandler(async (req, res) => {
  try {
    const { email, firstName, lastName, password, dateOfBirth } = req.body;
    if (!email || !firstName || !lastName || !password || !dateOfBirth) {
      // return res.status(400).json({
      //   status: 400,
      //   message: "invalid input",
      // });
      res.status(400);
      throw new Error("invalid input");
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
      // return res.status(401).json({
      //   message: "User already exists",
      // });
      res.status(401);
      throw new Error("User already exists");
    }
  } catch (error) {
    // return res.status(500).json({
    //   error,
    // });
    next(error);
  }
});

const login = AsyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // return res.status(400).json({
      //   status: 400,
      //   message: "invalid input",
      // });
      res.status(400);
      throw new Error("invalid input");
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
        //return res.status(401).json({
        //status: 401,
        //message: "Password incorrect",
        //});
        res.status(401);
        throw new Error("Password Incorrect");
      }
    } else {
      // return res.status(401).json({
      //   status: 401,
      //   message: "User doesn't exist",
      // });
      res.status(401);
      throw new Error("User doesn't exist");
    }
  } catch (error) {
    // return res.status(500).json({
    //   error,
    // });
    next(error);
  }
});

const forgotPassword = AsyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      // return res.status(400).json({
      //   status: 400,
      //   message: "invalid input",
      // });
      res.status(400);
      throw new Error("invalid input");
    }
    const fetchUser =
      await sql`SELECT * from user_table WHERE email = ${email}`;
    const user = fetchUser[0];
    if (user) {
      let subject = `Forgot Password`;
      let token = signForgotToken(email);
      let html = `<p>Hello ${user.firstname}<p>
      <p>Please click the <a href="http://localhost:3000/auth/verify-user/${token}">link<a/> to reset your password<p/>`;

      const response = await sendMail(email, subject, html);

      return res.status(200).json({
        message: "Email successfully sent",
        response,
      });
    } else {
      // return res.status(401).json({
      //   status: 401,
      //   message: "User doesn't exist",
      // });
      res.status(401);
      throw new Error("User doesn't exist");
    }
  } catch (error) {
    // return res.status(500).json({
    //   error,
    //});
    next(error);
  }
});

const verifyUser = AsyncHandler(async (req, res, next) => {
  try {
    const { token } = req.params;
    // method to decode the signed jwt token and return the signed content(payload)
    const payload = verifyToken(token);

    // destructure the email from the payload
    const { email } = payload;

    if (email) {
      const fetchUser =
        await sql`SELECT * from user_table WHERE email = ${email}`;
      const user = fetchUser[0];
      if (user) {
        const accessToken = signToken(user.user_id);

        return res.status(200).json({
          message: "User Verified",
          accessToken,
        });
      }
      // return res.status(401).json({
      //   message: "User not Found",
      // });
      res.status(401);
      throw new Error("User not found");
    }
    // return res.status(401).json({
    //   message: "Invalid token, please retry",
    // });
    res.status(401);
    throw new Error("Invalid token, please retry");
  } catch (error) {
    // return res.status(500).json({
    //   error,
    // });
    next(error);
  }
});

const resetPassword = AsyncHandler(async (req, res, next) => {
  try {
    const { password } = req.body;
    // the userid passed from authMiddleware
    const { userId } = req;
    if (!password) {
      // return res.status(400).json({
      //   message: "incomplete input"
      // })
      res.status(400);
      throw new Error("Incomplete input");
    }
    const fetchUser =
      await sql`SELECT * from user_table WHERE user_id = ${userId}`;
    const user = fetchUser[0];
    if (user) {
      const hashedPassword = await hashPassword(password);
      await sql`UPDATE user_table SET user_password = ${hashedPassword} WHERE email = ${user.email}`;
      return res.status(200).json({
        message: "password reset successful",
      });
    }
    // return res.status(401).json({
    //   message: "user not found"
    // })
    res.status(401);
    throw new Error("User not found");
  } catch (error) {
    // return res.status(500).json({
    //   error,
    // });
    next(error);
  }
});

module.exports = {
  register,
  login,
  forgotPassword,
  verifyUser,
  resetPassword,
};
