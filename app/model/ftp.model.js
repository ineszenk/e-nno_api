/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  const Ftp = sequelize.define("ftp_conso", {
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
  return Ftp;
};
