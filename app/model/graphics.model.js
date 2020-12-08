/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  const Graphics = sequelize.define("graphics", {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tmp: {
      type: Sequelize.DATE,
      allowNull: false
    },
    tt: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    conso_pred: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    conso_measured: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    opti: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    emulator_serial: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  });
  return Graphics;
};
