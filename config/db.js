const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tecsup',
  database: 'mossSport',
});

const dbPromise = db.promise();

module.exports = dbPromise;
