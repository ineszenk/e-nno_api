const { db } = require("../config/db.config.js");
const config = require("../config/config.js");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
  // Save User to Database
  console.log("Processing func -> SignUp");

  User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(() => {
      res.send("User registered successfully!");
    })
    .catch(err => {
      res.status(500).send("Fail! Error -> " + err);
    });
};

exports.signin = (req, res) => {
  console.log("Sign-In");

  const password = req.body.password;
  const username = req.body.username;

  User.findOne({
    where: {
      username: username
    }
  })
    .then(async user => {
      // Get hashed password
      const hash = user["dataValues"].password;

      // Compared with password entered by the user
      var passwordIsValid = bcrypt.compareSync(password, hash);
      if (!passwordIsValid) {
          return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
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
