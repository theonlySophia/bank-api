const bcrypt = require("bcrypt");
const hashPassword = async (originalPassword) => {
  let salt = await bcrypt.genSalt();
  let hash = await bcrypt.hash(originalPassword, salt);
  return hash;
};

const comparePassword = async (hash, pass) => {
  return bcrypt.compare(pass, hash);
};
module.exports = {
  hashPassword,
  comparePassword,
};
