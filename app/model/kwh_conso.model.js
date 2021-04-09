/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  const Kwh_conso = sequelize.define("kwh_conso", {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tmp: {
      type: Sequelize.DATE,
      allowNull: true
    },
    value: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    enno_serial: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    timestamps:false
  });
  return Kwh_conso;
};
