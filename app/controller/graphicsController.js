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

    console.log("EMULATOR SERIAL", building_emulator);

    if (!lastSeen || lastSeen === "") {
      const graphics = await dynamic_graphics.findAll({
        where: {
          emulator_serial: building_emulator[0][0].emulator_serial
        }
      });
      All.push({
        tmp: graphics[0].dataValues.tmp,
        tt: graphics[0].dataValues.tt,
        conso_pred: graphics[0].dataValues.conso_pred,
        conso_measured: graphics[0].dataValues.conso_measured,
        opti: graphics[0].dataValues.opti,
        emulator_serial: graphics[0].dataValues.emulator_serial
      });
    } else {
      const graphics = await dynamic_graphics.findAll({
        where: {
          emulator_serial: building_emulator[0][0].emulator_serial,
          tmp: { [Op.gt]: lastSeen }
        }
      });
      graphics.map(el => {
        console.log(
          All.push({
            tmp: el.dataValues.tmp,
            tt: el.dataValues.tt,
            conso_pred: el.dataValues.conso_pred,
            conso_measured: el.dataValues.conso_measured,
            opti: el.dataValues.opti,
            emulator_serial: el.dataValues.emulator_serial
          })
        );
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
