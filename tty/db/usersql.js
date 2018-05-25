var UserSQL = {
  insert:'INSERT INTO ttieyuser(username,userpassword) VALUES(?,?)',
  queryAll:'SELECT * FROM ttieyuser',
  getUserByUsername:'SELECT * FROM ttieyuser WHERE username=?',
}

module.exports = UserSQL
