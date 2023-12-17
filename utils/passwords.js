const bcrypt = require("bcrypt");
const hashPassword = async (originalPassword) => {
  let salt = await bcrypt.genSalt();
  let hash = await bcrypt.hash(originalPassword, salt);
  return hash;
};

const comparePassword = async (hash, pass) => {
  let validate = await bcrypt.compare(pass, hash);
  return validate
};
module.exports = {
  hashPassword,
  comparePassword,
};
