/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  const Meteo = sequelize.define("meteos", {
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
    meteo_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    value: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    cmd_name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
  },
  {
    timestamps:false
  });
  return Meteo;
};
