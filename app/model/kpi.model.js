/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  const Kpi = sequelize.define("kpis", {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
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
    },
    energy_savings: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    performance: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    intercept_ref: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    slope_ref: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    intercept_opti: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    slope_opti: {
      type: Sequelize.FLOAT,
      allowNull: true
    },
    last_updated: { type: Sequelize.DATE, allowNull: true }
  });
  return Kpi;
};
