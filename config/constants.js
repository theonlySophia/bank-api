require("dotenv").config();

module.exports.secret = process.env.JWT_SECRET;
module.exports.host = process.env.HOST; // Postgres ip address[s] or domain name[s]
module.exports.dbPort = process.env.DB_PORT; // Postgres server port[s]
module.exports.database = process.env.DB_NAME; // Name of database to connect to
module.exports.username = process.env.DB_USER; // Username of database user
module.exports.password = process.env.DB_PASSWORD;
module.exports.PORT = process.env.PORT
module.exports.mailUser = process.env.MAIL_USER;
module.exports.mailPass = process.env.MAIL_PASS;
