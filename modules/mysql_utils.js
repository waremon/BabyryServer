var mysql = require('mysql');

exports.connection = function() {
  var conn = mysql.createConnection({
    host: 'localhost',
    database: 'db_babyry',
    user: 'babyry',
    password: 'babyry'
  });
  return conn;
}
