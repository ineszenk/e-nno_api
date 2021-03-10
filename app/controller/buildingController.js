const { static_db } = require("../config/db.config.js");

exports.building = async (req, res) => {
  const { egid } = req.params;

  try {
    // GET STATIC DATA FROM E-NNO BUILDING DATABASE
    console.log(egid);
    // GET GRAPHICS DATA
    const geo_config = await static_db.multi(
      `SELECT * FROM geoconfigs where egid = '${egid}'`
    );
    console.log("--geo--", geo_config);

    const adminId = await static_db.multi(
      `SELECT * FROM buildings where id = ${geo_config[0][0].buildingid}`
    );
    console.log("--adminId--", adminId);

    const admin = await static_db.multi(
      `SELECT * FROM admins where id = ${adminId[0][0].adminId}`
    );

    console.log("--admin--", admin);

    const archi_config = await static_db.multi(
      `SELECT * FROM archiconfigs where buildingid = ${geo_config[0][0].buildingid}`
    );

    console.log("--archi--", archi_config);

    const adresse = geo_config[0][0].adresse;
    const num = adresse.split(" ").slice(-1)[0];
    const rue = adresse.substring(0, adresse.length - num.length);

    res.status(200).json({
      rue: rue,
      numero: num,
      npa: geo_config[0][0].npa,
      commune: geo_config[0][0].commune,
      pays: geo_config[0][0].country,
      latitude: geo_config[0][0].latitude,
      longitude: geo_config[0][0].longitude,
      affectation: archi_config[0][0].affectation,
      sre: archi_config[0][0].SRE,
      periode_construction: archi_config[0][0].annee_construction,
      nombre_niveaux: archi_config[0][0].niveaux,
      proprietaire: admin[0][0].client,
      gerance: admin[0][0].gerance,
      chauffagiste: admin[0][0].manager
    });
  } catch (error) {
    res.status(500).json({
      description: "Can not access building static data",
      error: error
    });
  }
};
