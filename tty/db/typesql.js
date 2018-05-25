var TypeSQL = {
  insert:'INSERT INTO ttieytype(typename,ynupdate) values(?,now())',
  queryAll:'SELECT * FROM ttieytype',
  getTypeByName:'SELECT * FROM ttieytype WHERE typename=?',
}

module.exports = TypeSQL
