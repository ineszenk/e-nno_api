const verifySignUp = require("./verifySignUp");
const authJwt = require("./verifyJwtToken");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

const swaggerOptions = {
  swaggerOptions: {
    validatorUrl: null
  }
};

module.exports = function(app) {
  const controller = require("../controller/controller.js");

  // Swagger documentation
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptions)
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
