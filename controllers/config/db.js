const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'moss_sportv2',
});

const dbPromise = db.promise();

module.exports = dbPromise;