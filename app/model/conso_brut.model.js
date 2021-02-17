/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  const Conso_brut = sequelize.define("brut_conso", {
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
    unit: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    cmd_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    value: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    cmd_name: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    enno_serial: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    device_name: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  });
  return Conso_brut;
};
