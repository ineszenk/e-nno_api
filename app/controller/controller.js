const { db, static_db } = require("../config/db.config.js");
const config = require("../config/config.js");
const User = db.user;
const Role = db.role;
const Gh = db.gh;
const Pulse = db.pulse;
const Ftp = db.ftp;
const Meteo = db.meteo;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  console.log("Processing func -> SignUp");

  User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles.map(role => role.toUpperCase())
          }
        }
      })
        .then(roles => {
          user.addRoles(roles).then(() => {
            res.send("User registered successfully!");
          });
        })
        .catch(err => {
          res.status(500).send("Error -> " + err);
        });
    })
    .catch(err => {
      res.status(500).send("Fail! Error -> " + err);
    });
};

exports.signin = (req, res) => {
  console.log("Sign-In");

  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send("User Not Found.");
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          auth: false,
          accessToken: null,
          reason: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });

      res.status(200).send({ auth: true, accessToken: token });
    })
    .catch(err => {
      res.status(500).send("Error -> " + err);
    });
};

exports.adminBoard = (req, res) => {
  User.findOne({
    where: { id: req.userId },
    attributes: ["name", "username", "email"],
    include: [
      {
        model: Role,
        attributes: ["id", "name"],
        through: {
          attributes: ["userId", "roleId"]
        }
      }
    ]
  })
    .then(user => {
      res.status(200).json({
        description: "Admin Board",
        user: user
      });
    })
    .catch(err => {
      res.status(500).json({
        description: "Can not access Admin Board",
        error: err
      });
    });
};

exports.HydrauliqueGroup = async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const enno_serial = req.params.enno_serial;

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

    // GET HYDRAULIC GROUP DATA FROM DS DATABASE
    const gh_all = await Gh.findAll({
      where: {
        enno_serial: {
          [Op.or]: [`${enno_serial}-GH-A`, `${enno_serial}-GH-B`, enno_serial]
        }
      }
    });

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

    // GET PULSE CONSO DATA FROM DS DATABASE
    const pulse_all = await Pulse.findAll({
      where: {
        enno_serial: {
          [Op.or]: [
            `${enno_serial}-Pulse`,
            `${enno_serial}-Pulse1`,
            `${enno_serial}-Pulse2`,
            `${enno_serial}-Pulse3`
          ]
        }
      }
    });

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

    // GET FTP CONSO DATA FROM DS DATABASE
    const ftp_all = await Ftp.findAll({
      where: {
        enno_serial: `${enno_serial} FTP`
      }
    });

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

    const meteo = await Meteo.findAll({
      where: {
        key: `meteonorm/:${geo_config[0][0].meteosite}`,
        [Op.or]: [
          {
            tmp: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      }
    });

    const meteo_all = await Meteo.findAll({
      where: {
        key: `meteonorm/:${geo_config[0][0].meteosite}`
      }
    });

    res.status(200).json({
      description:
        "Hydraulic group data (GH) - Consumption data (FTP, Pulse, Mbus) - Meteo - Static Database",
      GH: startDate ? gh : gh_all,
      PULSE: startDate ? pulse : pulse_all,
      FTP: startDate ? ftp : ftp_all,
      METEO: startDate ? meteo : meteo_all,
      STATIC: [
        {
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
          manager: admin[0][0].manager
        }
      ]
    });
  } catch (error) {
    res.status(500).json({
      description: "Can not access gh data",
      error: error
    });
  }
};

exports.Meteo = async (req, res, next) => {
  const { startDate, endDate } = req.body;
  console.log(req.params);

  try {
    const meteo = await Meteo.findAll({
      where: {
        key: `meteonorm/:${req.params.key}`,
        [Op.or]: [
          {
            tmp: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      }
    });

    const meteo_all = await Meteo.findAll({
      where: {
        key: `meteonorm/:${req.params.key}`
      }
    });

    res.status(200).json({
      description: "Meteo data",
      Météo: startDate ? meteo : meteo_all
    });
  } catch (error) {
    res.status(500).json({
      description: "Can not access meteo data",
      error: error
    });
  }
};
