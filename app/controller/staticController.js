const { static_db } = require("../config/db.config.js");

exports.static = async (req, res) => {
  const { enno_serial } = req.params;

  try {
    // GET STATIC DATA FROM E-NNO BUILDING DATABASE
    const buildingId = await static_db.multi(
      `SELECT * FROM buildings where emulator_serial = '${enno_serial}'`
    );
    const admin = await static_db.multi(
      `SELECT * FROM admins where id = ${buildingId[0][0].adminId}`
    );
    const archi_config = await static_db.multi(
      `SELECT * FROM archiconfigs where buildingid = ${buildingId[0][0].id}`
    );
    const geo_config = await static_db.multi(
      `SELECT * FROM geoconfigs where buildingid = ${buildingId[0][0].id}`
    );
    const conso_config = await static_db.multi(
      `SELECT * FROM chaudieres where buildingid = ${buildingId[0][0].id}`
    );

    res.status(200).json({
      description: "Building Static Datas",
      STATIC: {
        egid: geo_config.egid,
        adresse:
          geo_config[0][0].adresse +
          " " +
          geo_config[0][0].npa +
          " " +
          geo_config[0][0].commune,
        SRE: archi_config[0][0].SRE,
        affectation: archi_config[0][0].affectation,
        client: admin[0][0].client,
        gerance: admin[0][0].gerance,
        manager: admin[0][0].manager,
        type_comptage: conso_config[0][0].type_comptage
      }
    });
  } catch (error) {
    res.status(500).json({
      description: "Can not access building static data",
      error: error
    });
  }
};
