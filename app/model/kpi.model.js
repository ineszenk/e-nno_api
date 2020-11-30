/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  const Kpi = sequelize.define("KPIs", {
    cum_conso_pred: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    cum_conso_measured: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    co2_savings: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    financial_savings: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    idc: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    opti: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    emulator_serial: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    }
  });
  return Kpi;
};
