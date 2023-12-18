const postgres = require("postgres");
const { dbPort, host, database, username, password } = require("./constants");

const sql = postgres({
  host, // Postgres ip address[s] or domain name[s]
  port: dbPort, // Postgres server port[s]
  database, // Name of database to connect to
  username, // Username of database user
  password, // Password of database user
});

module.exports = sql;
