const { db, static_db } = require("../config/db.config.js");

const Pulse = db.pulse;
const Ftp = db.ftp;

const Op = db.Sequelize.Op;

exports.Consumption = async (req, res, next) => {
  const { enno_serial, startDate, endDate } = req.params;

  // GET STATIC DATA FROM E-NNO BUILDING DATABASE
  const buildingId = await static_db.multi(
    `SELECT * FROM buildings where emulator_serial = '${enno_serial}'`
  );

  const conso_config = await static_db.multi(
    `SELECT * FROM chaudieres where buildingid = ${buildingId[0][0].id}`
  );

  const type_comptage = conso_config[0][0].type_comptage;

  if (type_comptage === "Pulse") {
    try {
      // GET PULSE CONSO DATA FROM DS DATABASE

      const pulse = await Pulse.findAll({
        where: {
          enno_serial: {
            [Op.or]: [
              `${enno_serial}-Pulse`,
              `${enno_serial}-Pulse1`,
              `${enno_serial}-Pulse2`,
              `${enno_serial}-Pulse3`
            ]
          },
          [Op.or]: [
            {
              tmp: {
                [Op.between]: [startDate, endDate]
              }
            }
          ]
        }
      });

      let pulse_parsed = [];

      pulse.map(el =>
        pulse_parsed.push({
          tmp: el.tmp,
          value: el.value,
          cmd_name: el.cmd_name
        })
      );

      res.status(200).json({
        description: "Consumption data (Kwh)",
        Pulse: pulse_parsed
      });
    } catch (error) {
      res.status(500).json({
        description: "Can not access Consommation Data",
        error: error
      });
    }
  } else if (type_comptage === "FTP") {
    try {
      const ftp = await Ftp.findAll({
        where: {
          enno_serial: `${enno_serial} FTP`,
          [Op.or]: [
            {
              tmp: {
                [Op.between]: [startDate, endDate]
              }
            }
          ]
        }
      });

      let ftp_parsed = [];

      ftp.map(el =>
        ftp_parsed.push({
          tmp: el.tmp,
          value: el.value,
          cmd_name: el.cmd_name
        })
      );

      res.status(200).json({
        description: "Consumption data (Kwh)",
        Consommation: ftp_parsed
      });
    } catch {
      res.status(500).json({
        description: "Can not access Consumption Data",
        error: error
      });
    }
  }
};

exports.ConsumptionLast = async (req, res, next) => {
  const { enno_serial } = req.params;

  // GET STATIC DATA FROM E-NNO BUILDING DATABASE
  const buildingId = await static_db.multi(
    `SELECT * FROM buildings where emulator_serial = '${enno_serial}'`
  );

  const conso_config = await static_db.multi(
    `SELECT * FROM chaudieres where buildingid = ${buildingId[0][0].id}`
  );

  const type_comptage = conso_config[0][0].type_comptage;

  if (type_comptage === "Pulse") {
    try {
      // GET PULSE CONSO DATA FROM DS DATABASE
      const pulse_last = await Pulse.findAll({
        where: {
          enno_serial: {
            [Op.or]: [
              `${enno_serial}-Pulse`,
              `${enno_serial}-Pulse1`,
              `${enno_serial}-Pulse2`,
              `${enno_serial}-Pulse3`
            ]
          },
          [Op.or]: [
            {
              tmp: {
                [Op.between]: [
                  new Date(),
                  new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                ]
              }
            }
          ]
        }
      });

      let pulse_last_parsed = [];

      pulse_last.map(el =>
        pulse_last_parsed.push({
          tmp: el.tmp,
          value: el.value,
          cmd_name: el.cmd_name
        })
      );

      res.status(200).json({
        description: "Consumption data (Kwh)",
        Consumption: pulse_last_parsed
      });
    } catch (error) {
      res.status(500).json({
        description: "Can not access Consumption Data",
        error: error
      });
    }
  } else if (type_comptage === "FTP") {
    try {
      const ftp = await Ftp.findAll({
        where: {
          enno_serial: `${enno_serial} FTP`,
          [Op.or]: [
            {
              tmp: {
                [Op.between]: [
                  new Date(),
                  new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                ]
              }
            }
          ]
        }
      });

      let ftp_last_parsed = [];

      ftp_last.map(el =>
        ftp_last_parsed.push({
          tmp: el.tmp,
          value: el.value,
          cmd_name: el.cmd_name
        })
      );

      res.status(200).json({
        description: "Consumption data (Kwh)",
        Consommation: ftp_last_parsed
      });
    } catch {
      res.status(500).json({
        description: "Can not access Consumption Data",
        error: error
      });
    }
  }
};
