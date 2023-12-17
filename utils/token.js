const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const signToken = (id) => {
  let payload = {
    id,
  };
  let token = jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
  return token;
};

const signRefreshToken = async(id) => {
  let payload = {
    id,
  };
  let token = jwt.sign(payload, secret, {
    expiresIn: "1 month",
  });
  return token;
};

const verifyToken = async(token) => {
  let payload = jwt.verify(token, secret);
  return payload;
};

module.exports = {
  signToken,
  signRefreshToken,
  verifyToken,
};
