const { db, static_db } = require("../config/db.config.js");

const dynamic_graphics = db.graphics;

exports.Graphics = async (req, res) => {
  const { key } = req.params;

  try {
    // GET GRAPHICS DATA
    const building_emulator = await static_db.multi(
      `SELECT emulator_serial FROM buildings where key = '${key}'`
    );

    console.log("EMULATOR SERIAL", building_emulator);

    const graphics = await dynamic_graphics.findAll({
      where: {
        emulator_serial: building_emulator[0][0].emulator_serial
      }
    });

    const All = [];

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
    // });
    // console.log("ALL", All);

    // const response = {
    //   description: "Graphics",
    //   tt: graphics[0].tt,
    //   conso_pred: graphics[0].conso_pred,
    //   conso_measured: graphics[0].conso_measured,
    //   opti: graphics[0].opti,
    //   emulator_serial: graphics[0].emulator_serial
    // };

    res.status(200).send(All);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      description: "Data not available"
    });
  }
};
