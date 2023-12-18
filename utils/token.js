const jwt = require("jsonwebtoken");
const { secret } = require("../config/constants");

const signToken = (id) => {
  let payload = {
    id,
  };
  let token = jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
  return token;
};

const signRefreshToken = (id) => {
  let payload = {
    id,
  };
  let token = jwt.sign(payload, secret, {
    expiresIn: "30d",
  });
  return token;
};

const verifyToken = (token) => {
  let payload = jwt.verify(token, secret);
  return payload;
};

module.exports = {
  signToken,
  signRefreshToken,
  verifyToken,
};
