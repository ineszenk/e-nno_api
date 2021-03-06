/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  const Pulse = sequelize.define("pulse_conso", {
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
  return Pulse;
};
