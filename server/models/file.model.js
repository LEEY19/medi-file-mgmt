module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define('file', {
    id: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true
    },
    type: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    data: {
      type: Sequelize.BLOB('long')
    }
  });
  
  return File;
}