
/*
 * GET users listing.
 */

exports.login = function(req, res){
  res.render('login', { title: 'login' });
};

exports.result = function(req, res){
  var mysql_util = require('../modules/mysql_utils');
  var conn = mysql_util.connection();
  var crypto = require('crypto')
   , sha1sum = crypto.createHash('sha1');
  sha1sum.update(req.body.password);
  var hashed_password = sha1sum.digest('hex');
  conn.query('select * from user where name = ? and password = ?;', [req.body.name, hashed_password],  function(error, rows, fields){
    var str = '';
    if (error) {
      str = error;
    } else if(rows.length==0) {
      str = 'No such user or wrong password.'
    } else {
      str = 'Welcome Babyry.'
      req.session.user = req.body.name;
    } 
    res.render('login_result', { title: 'login', result: str, name: req.body.name, password: hashed_password });
  });
  conn.end();
};

exports.register = function(req, res){
  var mysql_util = require('../modules/mysql_utils');
  var conn = mysql_util.connection();
  conn.query('select * from user where name = ?;', req.body.new_name, function(error, rows, fields){
    var str = '';
    if (error) {
      str = error;
    } else if(rows.length==0) {
      var crypto = require('crypto')
        , sha1sum = crypto.createHash('sha1');
      sha1sum.update(req.body.new_password);
      var hashed_password = sha1sum.digest('hex');
      var conn2 = mysql_util.connection();
      conn2.query('insert into user set ?;', { name:req.body.new_name, password:hashed_password }, function(error, rows, fields) {
        if (error) {
          str = error;
        } else {
          str = 'Success to register.';
          req.session.user = req.body.new_name;
        }
        res.render('login_result', { title: 'login', result: str, name: req.body.new_name, password: hashed_password });
      });
      conn2.end();
      console.log(hashed_password);
      return;
    } else {
      str = 'This name is already registerd.'
    }
    res.render('login_result', { title: 'login', result: str, name: req.body.new_name, password: req.body.new_password });
  });
  conn.end();
  return;
}
