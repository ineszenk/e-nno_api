const { db, static_db } = require("../config/db.config.js");

const dynamic_graphics = db.graphics;

const Op = db.Sequelize.Op;

exports.Graphics = async (req, res) => {
  const { key } = req.params;
  const lastSeen = req.body.lastSeen;
  const All = [];

  try {
    // GET GRAPHICS DATA
    const building_emulator = await static_db.multi(
      `SELECT emulator_serial FROM buildings where key = '${key}'`
    );

    if (!lastSeen || lastSeen === "") {
      const graphics = await dynamic_graphics.findAll({
        where: {
          emulator_serial: building_emulator[0][0].emulator_serial
        }
      });
      graphics.map(el => {
          All.push({
            tmp: el.dataValues.tmp,
            tt: el.dataValues.tt,
            conso_pred: el.dataValues.conso_pred,
            conso_measured: el.dataValues.conso_measured,
            opti: el.dataValues.opti,
            emulator_serial: el.dataValues.emulator_serial
          })
      });
    } else {
      const graphics = await dynamic_graphics.findAll({
        where: {
          emulator_serial: building_emulator[0][0].emulator_serial,
          tmp: { [Op.gt]: lastSeen }
        }
      });
      graphics.map(el => {
          All.push({
            tmp: el.dataValues.tmp,
            tt: el.dataValues.tt,
            conso_pred: el.dataValues.conso_pred,
            conso_measured: el.dataValues.conso_measured,
            opti: el.dataValues.opti,
            emulator_serial: el.dataValues.emulator_serial
          })
      });
    }

    res.status(200).send(All);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      description: "Data not available"
    });
  }
};
