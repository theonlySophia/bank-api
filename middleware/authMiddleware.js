const AsyncHandler = require("express-async-handler");
const { verifyToken } = require("../utils/token");

const authMiddleware = AsyncHandler(async (req, res, next) => {
  try {
    // destructure the bearer token from the authorization header(format below)
    const [scheme, token] = req.headers.authorization.split(" "); //returns ["Bearer" "my-token-here"]
    // checks if the scheme is "bearer" and the token is not empty
    if (scheme == "Bearer" && token) {
      // decodes the token and returns content
      const payload = verifyToken(token);
      //   stores decoded content(user id) on the request object
      req.userId = payload.id;
      //   passes control to the next handler in sequence
      next();
    } else {
      res.status(403);
      throw new Error("no bearer token in header");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  authMiddleware,
};
// {
//     headers: {
//       'Authorization': `Bearer ${bearerToken}`
//     }
// }
