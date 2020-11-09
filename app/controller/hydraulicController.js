const { db, static_db } = require("../config/db.config.js");
const Gh = db.gh;
const Op = db.Sequelize.Op;

exports.HydrauliqueGroup = async (req, res, next) => {
  const { enno_serial, startDate, endDate } = req.params;

  const gh = await Gh.findAll({
    where: {
      enno_serial: {
        [Op.or]: [`${enno_serial}-GH-A`, `${enno_serial}-GH-B`, enno_serial]
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

  try {
    let gh_parsed = [];
    gh.map(el =>
      gh_parsed.push({ tmp: el.tmp, value: el.value, cmd_name: el.cmd_name })
    );
    res.status(200).json({
      description: "Hydraulic group data",
      HydrauliqueGroup: gh_parsed
    });
  } catch (error) {
    res.status(500).json({
      description: "Can not access GH data",
      error: error
    });
  }
};

// Get the last measurement
exports.HydrauliqueGroupLast = async (req, res, next) => {
  const { enno_serial } = req.params;

  try {
    const gh_last = await Gh.findAll({
      enno_serial: enno_serial,
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
    });

    let gh_last_parsed = [];
    gh_last.map(el =>
      gh_last_parsed.push({
        tmp: el.tmp,
        value: el.value,
        cmd_name: el.cmd_name
      })
    );

    res.status(200).json({
      description: "Hydraulic group data --> Last 24 hours",
      HydrauliqueGroup: gh_last_parsed
    });
  } catch (error) {
    res.status(500).json({
      description: "Can not access GH data",
      error: error
    });
  }
};
