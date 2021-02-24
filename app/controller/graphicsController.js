const { db, static_db } = require("../config/db.config.js");

const dynamic_graphics = db.graphics;

exports.Graphics = async (req, res) => {
  const { key } = req.params;

  try {
    // GET GRAPHICS DATA
    // const building_emulator = await static_db.multi(
    //   `SELECT emulator_serial FROM buildings where key = '${key}'`

    // );

    const building_emulator = new Promise((resolve, reject) => {
      resolve(await static_db.multi(
      `SELECT emulator_serial FROM buildings where key = '${key}'`);
    });
    

    promise1.then((value) => {
      console.log(value);
      // expected output: "Success!"
    });
    
    console.log("EMULATOR SERIAL", building_emulator);

    const graphics = await dynamic_graphics.findAll({
      where: {
        emulator_serial: building_emulator[0][0].emulator_serial
      }
    });

    res.status(200).json({
      description: "Graphics",
      tt: graphics[0].tt,
      conso_pred: graphics[0].conso_pred,
      conso_measured: graphics[0].conso_measured,
      opti: graphics[0].opti,
      emulator_serial: graphics[0].emulator_serial
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      description: "Data not available"
    });
  }
};
