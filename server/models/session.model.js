module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define("session", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    expires: Sequelize.DATE,
    data: Sequelize.STRING(50000)
  });
  
  return Session;
};
