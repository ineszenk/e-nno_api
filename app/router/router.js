const verifySignUp = require("./verifySignUp");
const authJwt = require("./verifyJwtToken");
const swaggerUi = require("swagger-ui-express");
const swaggerJsondoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "E-nno API",
      version: "1.0.0",
      description: "E-nno intern API",
      contact: {
        name: "Ines Zenk",
        url: "https://e-nno.ch",
        email: "inz@e-nno.ch"
      }
    },
    servers: [
      {
        url: "http://localhost:3000/"
      }
    ]
  },
  apis: []
};

module.exports = function(app) {
  const controller = require("../controller/controller.js");

  // Create swagger
  const specs = swaggerJsondoc(options);
  app.use("/docs", swaggerUi.serve);

  app.get(
    "/docs",
    swaggerUi.setup(specs, {
      explorer: true
    })
  );

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUserNameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get(
    "/api/gh/:enno_serial",
    [authJwt.verifyToken],
    controller.HydrauliqueGroup
  );

  app.get("/api/meteo/:key", [authJwt.verifyToken], controller.Meteo);
};
