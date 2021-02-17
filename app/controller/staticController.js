const { static_db } = require("../config/db.config.js");

exports.static = async (req, res) => {
  const { key } = req.params;

  try {
    // GET STATIC DATA FROM E-NNO BUILDING DATABASE

    // GET GRAPHICS DATA
    const building_emulator = await static_db.multi(
      `SELECT emulator_serial FROM buildings where key = '${key}'`
    );
    const buildingId = await static_db.multi(
      `SELECT * FROM buildings where emulator_serial = '${building_emulator[0][0]["emulator_serial"]}'`
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
    const chaudiere_config = await static_db.multi(
      `SELECT * FROM chaudieres where buildingid = ${buildingId[0][0].id}`
    );

    res.status(200).json({
      description: "Building Static Datas",
      emulator_serial: building_emulator[0][0]["emulator_serial"],
      egid: geo_config.egid,
      adresse: geo_config[0][0].adresse,
      npa: geo_config[0][0].npa,
      commune: geo_config[0][0].commune,
      latitude: geo_config[0][0].latitude,
      longitude: geo_config[0][0].longitude,
      agent_energetique: chaudiere_config[0][0].agent_energetique,
      affectation: archi_config[0][0].affectation,
      client: admin[0][0].client,
      gerance: admin[0][0].gerance,
      manager: admin[0][0].manager
    });
  } catch (error) {
    res.status(500).json({
      description: "Can not access building static data",
      error: error
    });
  }
};

exports.static_egid = async (req, res) => {
  const { egid } = req.params;

  try {
    // GET STATIC DATA FROM E-NNO BUILDING DATABASE
    const geo_config = await static_db.multi(
      `SELECT * FROM geoconfigs where egid = ${egid}`
    );

    res.status(200).json({
      description: "Building Static Datas",
      egid: geo_config.egid,
      adresse: geo_config[0][0].adresse,
      npa: geo_config[0][0].npa,
      commune: geo_config[0][0].commune,
      agent_energetique: chaudiere_config[0][0].agent_energetique,
      affectation: archi_config[0][0].affectation,
      client: admin[0][0].client,
      gerance: admin[0][0].gerance,
      manager: admin[0][0].manager
    });
  } catch (error) {
    res.status(500).json({
      description: "Can not access building static data",
      error: error
    });
  }
};
