const db = require("../config/db.config.js");
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

  try {
    const gh_all = await Gh.findAll({
      where: {
        enno_serial: {
          [Op.or]: [
            `${req.params.enno_serial}-GH-A`,
            `${req.params.enno_serial}-GH-B`,
            req.params.enno_serial
          ]
        }
      }
    });

    const gh = await Gh.findAll({
      where: {
        enno_serial: {
          [Op.or]: [
            `${req.params.enno_serial}-GH-A`,
            `${req.params.enno_serial}-GH-B`,
            req.params.enno_serial
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

    const pulse_all = await Pulse.findAll({
      where: {
        enno_serial: {
          [Op.or]: [
            `${req.params.enno_serial}-Pulse`,
            `${req.params.enno_serial}-Pulse1`,
            `${req.params.enno_serial}-Pulse2`,
            `${req.params.enno_serial}-Pulse3`
          ]
        }
      }
    });

    const pulse = await Pulse.findAll({
      where: {
        enno_serial: {
          [Op.or]: [
            `${req.params.enno_serial}-Pulse`,
            `${req.params.enno_serial}-Pulse1`,
            `${req.params.enno_serial}-Pulse2`,
            `${req.params.enno_serial}-Pulse3`
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

    const ftp_all = await Ftp.findAll({
      where: {
        enno_serial: `${req.params.enno_serial} FTP`
      }
    });

    const ftp = await Ftp.findAll({
      where: {
        enno_serial: `${req.params.enno_serial} FTP`,
        [Op.or]: [
          {
            tmp: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      }
    });

    res.status(200).json({
      description:
        "Hydraulic group data (GH) - Consumption data (FTP, Pulse, Mbus)",
      GH: startDate ? gh : gh_all,
      PULSE: startDate ? pulse : pulse_all,
      FTP: startDate ? ftp : ftp_all
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
