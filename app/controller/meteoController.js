const { db, static_db } = require("../config/db.config.js");
const Meteo = db.meteo;

const Op = db.Sequelize.Op;

exports.Meteo = async (req, res, next) => {
  const { enno_serial, startDate, endDate } = req.params;

  try {
    // GET STATIC DATA FROM E-NNO BUILDING DATABASE
    const buildingId = await static_db.multi(
      `SELECT * FROM buildings where emulator_serial = '${enno_serial}'`
    );

    const geo_config = await static_db.multi(
      `SELECT * FROM geoconfigs where buildingid = ${buildingId[0][0].id}`
    );
    const key = geo_config[0][0].meteosite;
    const meteo = await Meteo.findAll({
      where: {
        key: `meteonorm/:${key}`,
        [Op.or]: [
          {
            tmp: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      }
    });

    let meteo_parsed = [];

    meteo.map(el =>
      meteo_parsed.push({
        tmp: el.tmp,
        value: el.value,
        cmd_name: el.cmd_name,
        meteo_id: el.key
      })
    );

    res.status(200).json({
      description: "Meteo data",
      Météo: meteo_parsed
    });
  } catch (error) {
    res.status(500).json({
      description: "Can not access meteo data",
      error: error
    });
  }
};

exports.MeteoLast = async (req, res, next) => {
  const { enno_serial } = req.params;

  // GET STATIC DATA FROM E-NNO BUILDING DATABASE
  const buildingId = await static_db.multi(
    `SELECT * FROM buildings where emulator_serial = '${enno_serial}'`
  );

  const geo_config = await static_db.multi(
    `SELECT * FROM geoconfigs where buildingid = ${buildingId[0][0].id}`
  );

  const key = geo_config[0][0].meteosite;

  try {
    const meteo_last = await Meteo.findAll({
      where: {
        key: `meteonorm/:${key}`,
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

    let meteo_last_parsed = [];

    meteo_last.map(el =>
      meteo_last_parsed.push({
        tmp: el.tmp,
        value: el.value,
        cmd_name: el.cmd_name,
        meteo_id: el.key
      })
    );

    res.status(200).json({
      description: "Meteo data --> Last 24 hours",
      Météo: meteo_last_parsed
    });
  } catch (error) {
    res.status(500).json({
      description: "Can not access meteo data",
      error: error
    });
  }
};
