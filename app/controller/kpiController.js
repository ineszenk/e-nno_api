const { db, static_db } = require("../config/db.config.js");

const static_kpi = db.kpi;

exports.Kpi = async (req, res) => {
  const { key } = req.params;

  try {
    // GET KPI DATA
    const building_emulator = await static_db.multi(
      `SELECT emulator_serial FROM buildings where key = '${key}'`
    );
    console.log("EMULATOR SERIAL", building_emulator);
    const kpi = await static_kpi.findAll({
      where: {
        emulator_serial: building_emulator[0][0].emulator_serial
      }
    });
    res.status(200).json({
      description: "KPIs",
      cum_conso_pred: kpi[0].cum_conso_pred,
      cum_conso_measured: kpi[0].cum_conso_measured,
      co2_savings: kpi[0].co2_savings,
      financial_savings: kpi[0].financial_savings,
      idc: kpi[0].idc,
      opti: kpi[0].opti,
      emulator_serial: kpi[0].emulator_serial
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      description: "KPIs data not available"
    });
  }
};
